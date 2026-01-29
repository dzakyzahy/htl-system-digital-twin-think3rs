
import { create } from 'zustand';
import { FeedstockType, FEEDSTOCK_TYPES, DEFAULT_FEEDSTOCK } from '@/lib/simulation/constants';
import { runSimulation, SimulationState } from '@/lib/simulation/kineticModel';
import { calculateEconomics, EconomicResult } from '@/lib/simulation/economics';

interface SimulationStore {
    // Inputs
    feedstockType: FeedstockType;
    feedstockMass: number; // tons
    temperature: number; // C
    pressure: number; // MPa
    retentionTime: number; // min

    // Results
    isSimulating: boolean;
    simulationData: SimulationState[];
    yieldMeasures: {
        bioOilYield: number;
        gasYield: number;
        charYield: number;
        aqueousYield: number;
        hhv?: number;
        err?: number;
    };
    optimizationData: any[]; // New field for the chart
    economicResults: EconomicResult | null;

    // Actions
    setFeedstockType: (type: FeedstockType) => void;
    setParams: (params: Partial<SimulationStore>) => void;
    runSimulation: () => Promise<void>;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
    feedstockType: FEEDSTOCK_TYPES.CHICKEN,
    feedstockMass: 50,
    temperature: 320,
    pressure: 18,
    retentionTime: 45,

    isSimulating: false,
    simulationData: [],
    optimizationData: [], // Initial empty
    yieldMeasures: { bioOilYield: 0, gasYield: 0, charYield: 0, aqueousYield: 0 },
    economicResults: null,

    setFeedstockType: (type) => set({ feedstockType: type }),
    setParams: (params) => set((state) => ({ ...state, ...params })),

    runSimulation: async () => {
        set({ isSimulating: true });

        // Artificial delay for "simulation" feel
        await new Promise(resolve => setTimeout(resolve, 1500));

        const { feedstockType, temperature, retentionTime, feedstockMass, pressure } = get(); // Fetch pressure
        const feedstock = DEFAULT_FEEDSTOCK[feedstockType];

        // Run Kinetic Model (Now with Pressure)
        const kineticResults = runSimulation(feedstock, temperature, pressure, retentionTime, {
            Ea: 120, // Default activation energy
            A: 1.5e8 // Default pre-exponential factor
        });

        // Run Economics
        // Data from Indonesian Journal of Kinetic/Economic Analysis (2024 update)
        // CAPEX Base for 10 ton/day pilot plant ~ 45 Billion IDR
        const economicInput = {
            capexBase: 45_000_000_000,
            opexBase: 8_500_000_000,
            capacityTonPerYear: feedstockMass * 300, // 300 days/year
            bioOilPrice: 13500, // Updated market price Rp 13.500/L (Diesel equivalent)
            years: 10,
            taxRate: 0.22, // PPh Badan
            discountRate: 0.1, // WACC
            // Dynamic Simulation Outputs
            bioOilYield: kineticResults.measures.bioOilYield,
            temperature: temperature,
            pressure: get().pressure // need to fetch current pressure
        };
        const econResults = calculateEconomics(economicInput);

        set({
            isSimulating: false,
            simulationData: kineticResults.results,
            yieldMeasures: kineticResults.measures,
            optimizationData: kineticResults.optimizationData,
            economicResults: econResults
        });
    }
}));
