
import { ECONOMIC_DEFAULTS } from './constants';

export interface EconomicInput {
    capexBase: number; // Base CAPEX for standard conditions
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

export interface EconomicResult {
    npv: number;
    roi: number;
    paybackPeriod: number;
    annualRevenue: number;
    annualProfit: number;
    cashFlows: number[];
    cumulativeCashFlows: number[];
}

export const calculateEconomics = (input: EconomicInput): EconomicResult => {
    const { capexBase, opexBase, capacityTonPerYear, bioOilPrice, years, taxRate, discountRate, bioOilYield, temperature, pressure } = input;

    // 1. CAPEX Adjustment (Sophisticated Engineering Cost Model)
    // High pressure requires thicker walls (Pressure Vessel Code). Cost ~ P^1.5
    // High temperature requires exotic alloys (Hastelloy/Inconel) > 350C.
    let capexMultiplier = 1.0;

    // Pressure effect
    if (pressure > 20) capexMultiplier += 0.15; // +15% for high pressure ratings
    if (pressure > 25) capexMultiplier += 0.25;

    // Temperature effect (Metallurgy constraint)
    if (temperature > 350) capexMultiplier += 0.10; // Upgrade to 316L/310S
    if (temperature > 400) capexMultiplier += 0.30; // Upgrade to Inconel 625 (Expensive!)
    if (temperature > 500) capexMultiplier += 0.80; // Specialized Ceramics/Refractory

    const adjustedCapex = capexBase * capexMultiplier;

    // 2. OPEX Adjustment (Energy Balance)
    // Higher T = More heating duty (Q = m*Cp*dT). Approx linear with T.
    // Higher P = Higher pumping cost (Work = V*dP).
    const energyFactor = 1.0 + ((temperature - 300) / 1000) + ((pressure - 15) / 200);
    const adjustedOpex = opexBase * energyFactor;

    // 3. Revenue Calculation (Product Sales)
    // Bio-oil Density approx 0.95 kg/L. Market sells by Mass or Volume.
    // We assume price is per Liter.
    // Yearly Bio-oil Mass (ton) = Feedstock (ton) * (Yield / 100)
    const bioOilMassTon = capacityTonPerYear * (bioOilYield / 100);
    const bioOilVolumeLiters = bioOilMassTon * 1000 / 0.95; // kg -> L

    // Additional Credit: Bio-char (Soil amendment) ~ Rp 2000/kg
    // We assume Char yield roughly inversely proportional to Oil (simplified)
    const estimatedCharYield = Math.max(0, 40 - bioOilYield * 1.5); // Heuristic
    const charRevenue = (capacityTonPerYear * (estimatedCharYield / 100) * 1000) * 2000;

    // Total Revenue
    const oilRevenue = bioOilVolumeLiters * bioOilPrice;
    const annualRevenue = oilRevenue + charRevenue;

    // 4. Financial Metrics
    const grossProfit = annualRevenue - adjustedOpex;
    const depreciation = adjustedCapex / years;
    const taxableIncome = grossProfit - depreciation;

    // Tax Shield
    const tax = taxableIncome > 0 ? taxableIncome * taxRate : 0;
    const netProfit = grossProfit - tax;

    // Cash Flow = Net Profit + Depreciation
    const annualCashFlow = netProfit + depreciation;

    const cashFlows: number[] = [];
    const cumulativeCashFlows: number[] = [];

    // Year 0: Investment
    cashFlows.push(-adjustedCapex);
    cumulativeCashFlows.push(-adjustedCapex);

    for (let i = 1; i <= years; i++) {
        cashFlows.push(annualCashFlow);
        cumulativeCashFlows.push(cumulativeCashFlows[i - 1] + annualCashFlow);
    }

    // NPV Calculation
    let npv = -adjustedCapex;
    for (let i = 1; i <= years; i++) {
        npv += annualCashFlow / Math.pow(1 + discountRate, i);
    }

    // ROI
    const totalProfit = (annualCashFlow * years) - adjustedCapex;
    const roi = (totalProfit / adjustedCapex) * 100;

    // Payback Period (Simple)
    let paybackPeriod = 0;
    if (annualCashFlow > 0) {
        paybackPeriod = adjustedCapex / annualCashFlow;
    } else {
        paybackPeriod = 999; // Never
    }

    return {
        npv,
        roi,
        paybackPeriod,
        annualRevenue,
        annualProfit: netProfit,
        cashFlows,
        cumulativeCashFlows
    };
};

export const generateSensitivityData = (baseInput: EconomicInput) => {
    // Vary parameters by +/- 20%
    const variations = [-0.2, -0.1, 0, 0.1, 0.2];

    const results = variations.map(v => {
        const input = { ...baseInput, bioOilPrice: baseInput.bioOilPrice * (1 + v) };
        const res = calculateEconomics(input);
        return { change: v * 100, npv: res.npv, var: 'Price' };
    });

    // Add more variables if needed (e.g. CAPEX)
    return results;
};
