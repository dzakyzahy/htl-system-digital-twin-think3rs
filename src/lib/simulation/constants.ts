
export const FEEDSTOCK_TYPES = {
    CHICKEN: 'Kotoran Ayam',
    COW: 'Kotoran Sapi',
} as const;

export type FeedstockType = typeof FEEDSTOCK_TYPES[keyof typeof FEEDSTOCK_TYPES];

export interface FeedstockComposition {
    moisture: number; // %
    lipid: number; // %
    protein: number; // %
    carbohydrate: number; // %
    ash: number; // %
}

export const DEFAULT_FEEDSTOCK: Record<FeedstockType, FeedstockComposition> = {
    [FEEDSTOCK_TYPES.CHICKEN]: {
        moisture: 75, // Typical range, kept consistent
        lipid: 1.97, // Data from paper (Purnamasari et al., 2021)
        protein: 18.64, // Data from paper
        carbohydrate: 19.62, // Data from paper (Serat Kasar)
        ash: 59.77, // Remainder to 100% dry basis (High ash is typical for manure) - Adjusted to sum to 100 on dry basis
        // Note: The paper values (1.97 + 18.64 + 19.62 = 40.23%). The rest is Ash + Others. 
        // We will normalize to 100% dry weight in the model or here. 
        // Let's assume the provided values are % of Dry Matter.
    },
    [FEEDSTOCK_TYPES.COW]: {
        moisture: 80,
        lipid: 0.24, // Data from paper (Meethal et al., 2023)
        protein: 12.5, // Representative value
        carbohydrate: 45.0, // High cellulosic content
        ash: 42.26,
    }
};

export const MOLECULAR_WEIGHTS = {
    LIPID: 850, // Approximate average for triglycerides
    PROTEIN: 135, // Average amino acid residue
    CARBOHYDRATE: 162, // Hexose unit
};

// Economic Constants (IDR)
// Economic Constants (IDR) - Ref: PNNL-25464 Rev.1 (2016)
export const ECONOMIC_DEFAULTS = {
    // CAPEX Reference: PNNL-25464 Table A.1 adjusted for inflation/location
    // Original: ~$2.8M USD for 10 ton/day (ISBL/Equipment Only)
    CAPEX_ISBL_REF: 45_000_000_000, // Rp 45 Miliar (Base for 10 ton/day)
    ISBL_REF_CAPACITY: 10, // ton/day

    // Scaling Factor (Six-Tenths Rule)
    SCALING_FACTOR: 0.6,

    // Lang Factors for TCI (Total Capital Investment) - Turnkey
    // TCI = ISBL * (1 + Sum(Factors))
    LANG_FACTORS: {
        INSTALLATION: 0.20, // Piping, Electrical, Insulation
        CONTROLS: 0.10,     // Instrumentation & Control (DCS/PLC)
        CIVIL: 0.15,        // Buildings, Foundations, Land
        ENGINEERING: 0.15,  // Design, Supervision, Contingency
    },

    OPEX_FIXED_PERCENT: 0.05, // 5% of CAPEX (Maintenance, Insurance)
    LABOR_COST_PER_YEAR: 1_200_000_000, // Rp 1.2 Miliar (Manager + Operators)
    ELECTRICITY_COST_KWH: 1444, // Rp/kWh (Industrial)
    WATER_COST_M3: 6000, // Rp/m3
    BIO_OIL_PRICE_LITER: 13500, // Adjusted to current market (Bio-diesel equivalent)
    HSD_PRICE_LITER: 14500, // Solar Industri
    INTEREST_RATE: 0.08, // 8%
    TAX_RATE: 0.22, // 22% PPh Badan
};

// Feedstock Prices (Rp/kg) - Literature & Market Average
export const FEEDSTOCK_PRICE: Record<FeedstockType, number> = {
    [FEEDSTOCK_TYPES.CHICKEN]: 100,   // Rp 100/kg (Literatur: limbah murah)
    [FEEDSTOCK_TYPES.COW]: 3500,      // Rp 3.500/kg (Harga pasar pupuk kandang)
};

// Environmental / LCA Constants
export const ENVIRONMENTAL = {
    COAL_EMISSION_FACTOR: 94.6,  // kg CO₂/GJ (IPCC 2006)
    HTL_REDUCTION_FACTOR: 0.3,   // Bio-oil emits 30% of coal (70% lower)
    BIO_OIL_HHV: 32.5,          // MJ/kg (Zhang et al., 2023: range 30-35)
};
