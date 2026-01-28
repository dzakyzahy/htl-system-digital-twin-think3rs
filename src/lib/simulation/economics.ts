
import { ECONOMIC_DEFAULTS } from './constants';

export interface EconomicInput {
    capex: number;
    opexPerYear: number;
    capacityTonPerYear: number;
    bioOilPrice: number;
    years: number;
    taxRate: number;
    discountRate: number;
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
    const { capex, opexPerYear, capacityTonPerYear, bioOilPrice, years, taxRate, discountRate } = input;

    const annualRevenue = capacityTonPerYear * 1000 * (bioOilPrice / 0.9); // Convert ton to Liters (approx density 0.9 kg/L)
    const grossProfit = annualRevenue - opexPerYear;
    const depreciation = capex / years;
    const taxableIncome = grossProfit - depreciation;
    const tax = taxableIncome > 0 ? taxableIncome * taxRate : 0;
    const netProfit = grossProfit - tax; // Cash flow approximation (Depreciation added back for cash flow, but subtracted for tax)

    // Simple Cash Flow = Net Profit + Depreciation (since dep is non-cash)
    const annualCashFlow = netProfit + depreciation; // Or roughly Gross Profit - Tax

    const cashFlows: number[] = [];
    const cumulativeCashFlows: number[] = [];

    // Year 0: Investment
    cashFlows.push(-capex);
    cumulativeCashFlows.push(-capex);

    for (let i = 1; i <= years; i++) {
        cashFlows.push(annualCashFlow);
        cumulativeCashFlows.push(cumulativeCashFlows[i - 1] + annualCashFlow);
    }

    // NPV Calculation
    let npv = -capex;
    for (let i = 1; i <= years; i++) {
        npv += annualCashFlow / Math.pow(1 + discountRate, i);
    }

    // ROI
    const totalProfit = (annualCashFlow * years) - capex;
    const roi = (totalProfit / capex) * 100;

    // Payback Period (Simple)
    let paybackPeriod = 0;
    if (annualCashFlow > 0) {
        paybackPeriod = capex / annualCashFlow;
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
