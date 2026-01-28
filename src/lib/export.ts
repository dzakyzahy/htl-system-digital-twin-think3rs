
import Papa, { UnparseConfig } from 'papaparse';
import { SimulationState } from './simulation/kineticModel';
import { EconomicResult } from './simulation/economics';


export const downloadCSV = (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportSimulationData = (data: SimulationState[]) => {
    const formatted = data.map(row => ({
        Time_Min: row.time.toFixed(2),
        Biomass_Conc: row.biomass.toFixed(4),
        BioOil_Conc: row.bioOil.toFixed(4),
        Gas_Conc: row.gas.toFixed(4),
        Char_Conc: row.char.toFixed(4)
    }));
    downloadCSV(formatted, `HTL_Simulation_Data_${new Date().toISOString()}.csv`);
};

export const exportEconomicReport = (econ: EconomicResult) => {
    // 1. Metrics Section
    const metrics = [
        { Metric: 'NPV (10 Years)', Value: econ.npv, Unit: 'IDR' },
        { Metric: 'ROI', Value: econ.roi, Unit: '%' },
        { Metric: 'Payback Period', Value: econ.paybackPeriod, Unit: 'Years' },
        { Metric: 'Annual Revenue', Value: econ.annualRevenue, Unit: 'IDR' },
    ];

    // 2. Cash Flow Section
    // Flatten approach: We will export Cash Flows as a separate structure or just rows
    // For simplicity, we export key metrics first, or two files. 
    // Let's combine them or just export Cash Flow yearly
    const cashFlows = econ.cashFlows.map((cf, i) => ({
        Year: i,
        CashFlow: cf,
        Cumulative: econ.cumulativeCashFlows[i]
    }));

    downloadCSV(metrics, `HTL_Economic_Metrics_${new Date().toISOString()}.csv`);
    // Optional: downloadCSV(cashFlows, 'cash_flows.csv');
};
