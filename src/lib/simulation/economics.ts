
import { ECONOMIC_DEFAULTS } from './constants';

export interface EconomicInput {
    // capexBase is removed, we calculate it dynamically
    opexBase: number;
    capacityTonPerYear: number;
    bioOilPrice: number;
    years: number;
    taxRate: number;
    discountRate: number;
    // Dynamic Factors
    bioOilYield: number; // %
    temperature: number; // For CAPEX adjustment
    pressure: number; // For CAPEX adjustment
}

export interface FinancialMetrics {
    capex: number;
    npv: number;
    roi: number;
    paybackPeriod: number;
    cashFlows: number[];
    cumulativeCashFlows: number[];
}

export interface EconomicResult {
    annualRevenue: number;
    annualProfit: number;
    annualOpex: number;
    isbl: FinancialMetrics; // Equipment Only
    tci: FinancialMetrics;  // Turnkey Project
}

export const calculateEconomics = (input: EconomicInput): EconomicResult => {
    const { opexBase, capacityTonPerYear, bioOilPrice, years, taxRate, discountRate, bioOilYield, temperature, pressure } = input;

    // --- 1. CAPEX Calculation (PNNL-25464) ---

    // Convert annual capacity to daily for scaling (assuming 300 operating days)
    const capacityTonPerDay = capacityTonPerYear / 300;

    // Six-Tenths Rule Scaling for ISBL (Inside Battery Limits)
    // Cost_B = Cost_A * (Cap_B / Cap_A) ^ 0.6
    const scaleRatio = capacityTonPerDay / ECONOMIC_DEFAULTS.ISBL_REF_CAPACITY;
    const isblBaseCost = ECONOMIC_DEFAULTS.CAPEX_ISBL_REF * Math.pow(scaleRatio, ECONOMIC_DEFAULTS.SCALING_FACTOR);

    // Engineering Factors (Temp/Pressure) - Appied to Equipment Cost (ISBL)
    let engineeringMultiplier = 1.0;

    // Pressure effect
    if (pressure > 20) engineeringMultiplier += 0.15;
    if (pressure > 25) engineeringMultiplier += 0.25;

    // Temperature effect (Metallurgy)
    if (temperature > 350) {
        const tempDiff = temperature - 350;
        const materialFactor = 0.1 * Math.exp(tempDiff / 100);
        engineeringMultiplier += materialFactor;
    }

    const isblFinalCost = isblBaseCost * engineeringMultiplier;

    // TCI (Total Capital Investment) Calculation - Lang Factors
    // TCI = ISBL + (ISBL * Factors)
    const { INSTALLATION, CONTROLS, CIVIL, ENGINEERING } = ECONOMIC_DEFAULTS.LANG_FACTORS;
    const tciFactor = 1.0 + INSTALLATION + CONTROLS + CIVIL + ENGINEERING;
    const tciFinalCost = isblFinalCost * tciFactor;

    // --- 2. OPEX & Revenue ---

    // Energy Factor for OPEX
    const energyFactor = 1.0 + ((temperature - 300) / 1000) + ((pressure - 15) / 200);
    const adjustedOpex = opexBase * energyFactor; // This might need scaling too, but keeping simple for now

    // Revenue
    const bioOilMassTon = capacityTonPerYear * (bioOilYield / 100);
    const bioOilVolumeLiters = bioOilMassTon * 1000 / 0.95; // kg -> L

    // Char Credit
    const estimatedCharYield = Math.max(0, 40 - bioOilYield * 1.5);
    const charRevenue = (capacityTonPerYear * (estimatedCharYield / 100) * 1000) * 2000;

    const oilRevenue = bioOilVolumeLiters * bioOilPrice;
    const annualRevenue = oilRevenue + charRevenue;
    const grossProfitBase = annualRevenue - adjustedOpex;

    // --- 3. Financial Metrics Helper ---

    const calculateMetrics = (capex: number): FinancialMetrics => {
        const depreciation = capex / years;
        const taxableIncome = grossProfitBase - depreciation;
        const tax = taxableIncome > 0 ? taxableIncome * taxRate : 0;
        const netProfit = grossProfitBase - tax;
        const annualCashFlow = netProfit + depreciation;

        const cashFlows: number[] = [];
        const cumulativeCashFlows: number[] = [];

        // Year 0
        cashFlows.push(-capex);
        cumulativeCashFlows.push(-capex);

        let npv = -capex;

        for (let i = 1; i <= years; i++) {
            cashFlows.push(annualCashFlow);
            const currentCum = cumulativeCashFlows[i - 1] + annualCashFlow;
            cumulativeCashFlows.push(currentCum);

            npv += annualCashFlow / Math.pow(1 + discountRate, i);
        }

        const totalProfit = (annualCashFlow * years) - capex;
        const roi = (totalProfit / capex) * 100;

        let paybackPeriod = 0;
        if (annualCashFlow > 0) {
            paybackPeriod = capex / annualCashFlow;
        } else {
            paybackPeriod = 999;
        }

        return { capex, npv, roi, paybackPeriod, cashFlows, cumulativeCashFlows };
    };

    // Calculate both scenarios
    const metricsISBL = calculateMetrics(isblFinalCost);
    const metricsTCI = calculateMetrics(tciFinalCost);

    // For annual profit display, we use TCI scenario as it's more realistic for "Net Profit" (higher depreciation usually)
    // But here we calculated logic inside. Let's return the TCI based annual profit for the summary if needed, 
    // or just the pre-depreciation gross profit. 
    // Let's stick to the Net Profit derived from TCI for the general "Annual Profit" field if a single number is needed,
    // or just return gross.
    // Actually, `netProfit` depends on `depreciation` which depends on CAPEX. 
    // Let's recalculate net profit for TCI specifically for the summary.
    const depTCI = tciFinalCost / years;
    const taxIncTCI = grossProfitBase - depTCI;
    const annualProfitTCI = grossProfitBase - (taxIncTCI > 0 ? taxIncTCI * taxRate : 0);

    return {
        annualRevenue,
        annualProfit: annualProfitTCI,
        annualOpex: adjustedOpex,
        isbl: metricsISBL,
        tci: metricsTCI
    };
};

