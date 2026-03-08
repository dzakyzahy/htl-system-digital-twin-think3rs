
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
    // Use TCI (Turnkey / Realistic) for the export
    const view = econ.tci;

    // 1. Metrics Section
    const metrics = [
        { Metric: 'CAPEX (TCI)', Value: view.capex, Unit: 'IDR' },
        { Metric: 'NPV (10 Years)', Value: view.npv, Unit: 'IDR' },
        { Metric: 'ROI', Value: view.roi, Unit: '%' },
        { Metric: 'Payback Period', Value: view.paybackPeriod, Unit: 'Years' },
        { Metric: 'Annual Revenue', Value: econ.annualRevenue, Unit: 'IDR' },
        { Metric: 'Feedstock Cost', Value: econ.feedstockCost, Unit: 'IDR' },
    ];

    // 2. Cash Flow Section
    const cashFlows = view.cashFlows.map((cf, i) => ({
        Year: i,
        CashFlow: cf,
        Cumulative: view.cumulativeCashFlows[i]
    }));

    downloadCSV(metrics, `HTL_Economic_Metrics_${new Date().toISOString()}.csv`);
    // Optional: downloadCSV(cashFlows, 'cash_flows.csv');
};
