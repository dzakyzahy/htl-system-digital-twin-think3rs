
import { FeedstockComposition } from './constants';

export interface KineticParams {
    A: number;
    Ea: number; // kJ/mol
    T: number; // Kelvin
}

export interface SimulationState {
    time: number;
    biomass: number;
    bioOil: number;
    gas: number;
    char: number;
}

// Arrhenius Equation
export const calculateK = (A: number, Ea: number, T: number): number => {
    const R = 8.314; // J/(mol·K)
    return A * Math.exp(-(Ea * 1000) / (R * T));
};

// Simplified Kinetic Model (Lumped)
// Biomass -> [Bio-oil, Gas, Char]
// This is a simplified 3-parallel reaction model often used for HTL
// For a more complex series-parallel model (e.g. Biomass -> Bio-oil -> Gas), we can adjust derivatives
export const derivatives = (state: SimulationState, k: { k1: number, k2: number, k3: number }) => {
    // k1: Biomass -> Bio-oil
    // k2: Biomass -> Gas
    // k3: Biomass -> Char

    // First order kinetics: dC/dt = -k*C
    const dBiomass = -(k.k1 + k.k2 + k.k3) * state.biomass;
    const dBioOil = k.k1 * state.biomass;
    const dGas = k.k2 * state.biomass;
    const dChar = k.k3 * state.biomass;

    return { dBiomass, dBioOil, dGas, dChar };
};

export const runSimulation = (
    feedstock: FeedstockComposition,
    temperatureC: number,
    retentionTimeMin: number,
    params: { Ea: number, A: number }
): { results: SimulationState[], measures: any } => {
    const T = temperatureC + 273.15;
    const dt = 0.5; // step size in minutes
    const steps = Math.ceil(retentionTimeMin / dt);

    // Component-Contribution Model (CCM) for HTL
    // Reference: Madsen & Glasius (2019) / Zhou et al. (2020)
    // Lipid -> Bio-oil (High efficiency)
    // Protein -> Bio-oil + Aqueous (Ammonia)
    // Carbohydrate -> Gas + Char + minimal Bio-oil

    // 1. Calculate normative yields based on dry matter composition
    const lipidYield = feedstock.lipid * 0.95; // 95% conversion of lipids to bio-oil
    const proteinYield = feedstock.protein * 0.35; // 35% conversion of protein to bio-oil
    const carbYield = feedstock.carbohydrate * 0.10; // 10% conversion of carbs to bio-oil (mostly gas/char)

    // Theoretical max bio-oil % (Dry basis)
    let theoreticalBioOil = lipidYield + proteinYield + carbYield;

    // 2. Temperature Adjustment Factor (T effect on Yield)
    // Optimal range for HTL is typically 300-330°C.
    // > 340°C = Gasification dominates (Yield drops)
    // < 280°C = Incomplete conversion (Yield low)
    let tempFactor = 1.0;
    if (temperatureC > 330) {
        // Yield drops 0.5% per degree above 330
        tempFactor = 1.0 - ((temperatureC - 330) * 0.005);
    } else if (temperatureC < 300) {
        // Yield drops 0.8% per degree below 300
        tempFactor = 1.0 - ((300 - temperatureC) * 0.008);
    }
    tempFactor = Math.max(0.1, tempFactor); // Clamp

    const predictedBioOilYield = theoreticalBioOil * tempFactor;

    // Base rate constant from global Arrhenius
    const kGlobal = calculateK(params.A, params.Ea, T);

    // 3. Determine Kinetic Ratios (k1:k2:k3) to match the predicted yield at t=inf
    // We want the steady state Bio-oil conc to approach `predictedBioOilYield / 100` (since state is 0-1)
    // In our parallel model: BioOil_Final = k1 / (k1+k2+k3)

    // Base ratios derived from predicted outcome
    let targetOilRatio = predictedBioOilYield / 100;

    // Gas increases heavily with temp and carbs
    let targetGasRatio = (feedstock.carbohydrate * 0.5 + feedstock.protein * 0.2) / 100;
    if (temperatureC > 350) targetGasRatio *= 1.5;

    // Char is the remainder, heavily influenced by lignin (in ash/carb fraction) and low temp
    let targetCharRatio = 1.0 - targetOilRatio - targetGasRatio;

    // Safety normalization
    if (targetCharRatio < 0) {
        const excess = -targetCharRatio;
        targetGasRatio -= excess / 2;
        targetOilRatio -= excess / 2;
        targetCharRatio = 0.05;
    }

    // Assign k values
    const k1 = kGlobal * targetOilRatio;
    const k2 = kGlobal * targetGasRatio;
    const k3 = kGlobal * targetCharRatio;

    const results: SimulationState[] = [];
    let state: SimulationState = {
        time: 0,
        biomass: 1.0, // normalized initial concentration
        bioOil: 0,
        gas: 0,
        char: 0
    };

    results.push({ ...state });

    // RK4 Implementation
    for (let i = 0; i < steps; i++) {
        const k_rates = { k1, k2, k3 };

        // k1 step
        const d1 = derivatives(state, k_rates);

        // k2 step
        const state2: SimulationState = {
            ...state,
            time: state.time + dt / 2,
            biomass: state.biomass + d1.dBiomass * dt / 2,
            bioOil: state.bioOil + d1.dBioOil * dt / 2,
            gas: state.gas + d1.dGas * dt / 2,
            char: state.char + d1.dChar * dt / 2
        };
        const d2 = derivatives(state2, k_rates);

        // k3 step
        const state3: SimulationState = {
            ...state,
            time: state.time + dt / 2,
            biomass: state.biomass + d2.dBiomass * dt / 2,
            bioOil: state.bioOil + d2.dBioOil * dt / 2,
            gas: state.gas + d2.dGas * dt / 2,
            char: state.char + d2.dChar * dt / 2
        };
        const d3 = derivatives(state3, k_rates);

        // k4 step
        const state4: SimulationState = {
            ...state,
            time: state.time + dt,
            biomass: state.biomass + d3.dBiomass * dt,
            bioOil: state.bioOil + d3.dBioOil * dt,
            gas: state.gas + d3.dGas * dt,
            char: state.char + d3.dChar * dt
        };
        const d4 = derivatives(state4, k_rates);

        // Update state
        state.time += dt;
        state.biomass += (d1.dBiomass + 2 * d2.dBiomass + 2 * d3.dBiomass + d4.dBiomass) * dt / 6;
        state.bioOil += (d1.dBioOil + 2 * d2.dBioOil + 2 * d3.dBioOil + d4.dBioOil) * dt / 6;
        state.gas += (d1.dGas + 2 * d2.dGas + 2 * d3.dGas + d4.dGas) * dt / 6;
        state.char += (d1.dChar + 2 * d2.dChar + 2 * d3.dChar + d4.dChar) * dt / 6;

        results.push({ ...state });
    }

    // Calculate final measures (e.g. Yield in %)
    // Assuming ideal conversion, yield % is approx proportional to concentration for our purpose
    // In reality, we multiply by mass balance factors
    // 1 unit of biomass -> X units of products
    const measures = {
        bioOilYield: state.bioOil * 100,
        gasYield: state.gas * 100,
        charYield: state.char * 100,
        aqueousYield: 100 - (state.bioOil + state.gas + state.char) * 100, // Water + soluble organics
    };

    // Correction for aqueous phase (HTL always has it)
    // If aqueous is too low, steal from gas/char for realism in this simplified model
    if (measures.aqueousYield < 10) measures.aqueousYield = 15;

    // Renormalize to 100%
    const totalYield = measures.bioOilYield + measures.gasYield + measures.charYield + measures.aqueousYield;
    measures.bioOilYield = (measures.bioOilYield / totalYield) * 100;
    measures.gasYield = (measures.gasYield / totalYield) * 100;
    measures.charYield = (measures.charYield / totalYield) * 100;
    measures.aqueousYield = (measures.aqueousYield / totalYield) * 100;

    // Dynamic HHV Calculation (Dulong's Formula Approximation)
    // HHV (MJ/kg) = 0.3383*C + 1.422*(H - O/8)
    // We approximate elemental composition of Bio-oil based on feedstock source
    // Lipids yield high H/C ratio bio-oil (High HHV ~ 38-40 MJ/kg)
    // Proteins/Carbs yield oxygenated bio-oil (Lower HHV ~ 28-32 MJ/kg)

    let estimatedHHV = 0;
    if (feedstock.lipid > 1.0) {
        // High lipid (Chicken) -> More hydrocarbon-like
        estimatedHHV = 36 + (feedstock.lipid * 0.2) - ((temperatureC - 300) * 0.05); // Approx 38 MJ/kg
    } else {
        // High Cellulose (Cow) -> More oxygenated
        estimatedHHV = 28 + (feedstock.protein * 0.1); // Approx 30 MJ/kg
    }

    // Energy Recovery Ratio (ERR) = (Mass Yield_oil * HHV_oil) / (Mass_feed * HHV_feed)
    // Assuming HHV_feed is approx 15-18 MJ/kg for manure
    const err = (measures.bioOilYield / 100) * estimatedHHV / 16.0 * 100; // 16 MJ/kg avg feed

    return { results, measures: { ...measures, hhv: estimatedHHV, err } };
};
