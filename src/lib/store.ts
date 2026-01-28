
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
    economicResults: EconomicResult | null;

    // Actions
    setFeedstockType: (type: FeedstockType) => void;
    setParams: (params: Partial<SimulationStore>) => void;
    runSimulation: () => Promise<void>;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
    feedstockType: FEEDSTOCK_TYPES.CHICKEN,
    feedstockMass: 10,
    temperature: 320,
    pressure: 18,
    retentionTime: 45,

    isSimulating: false,
    simulationData: [],
    yieldMeasures: { bioOilYield: 0, gasYield: 0, charYield: 0, aqueousYield: 0 },
    economicResults: null,

    setFeedstockType: (type) => set({ feedstockType: type }),
    setParams: (params) => set((state) => ({ ...state, ...params })),

    runSimulation: async () => {
        set({ isSimulating: true });

        // Artificial delay for "simulation" feel
        await new Promise(resolve => setTimeout(resolve, 1500));

        const { feedstockType, temperature, retentionTime, feedstockMass } = get();
        const feedstock = DEFAULT_FEEDSTOCK[feedstockType];

        // Run Kinetic Model
        const kineticResults = runSimulation(feedstock, temperature, retentionTime, {
            Ea: 120, // Default activation energy
            A: 1.5e8 // Default pre-exponential factor
        });

        // Run Economics
        // Basic assumptions for the competition
        const economicInput = {
            capex: 45_000_000_000,
            opexPerYear: 8_500_000_000,
            capacityTonPerYear: feedstockMass * 300, // 300 days/year
            bioOilPrice: 12000,
            years: 10,
            taxRate: 0.22,
            discountRate: 0.1
        };
        const econResults = calculateEconomics(economicInput);

        set({
            isSimulating: false,
            simulationData: kineticResults.results,
            yieldMeasures: kineticResults.measures,
            economicResults: econResults
        });
    }
}));
