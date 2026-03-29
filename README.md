# 🏭 Hydrothermal Liquefaction (HTL) Digital Twin

**A High-Fidelity Web Simulation Platform for Bio-Oil Production from Poultry and Bovine Manure.**  
*Built for LKTIN AEROSPACE 2026 by Team Think3rs.*


## 🚀 Overview

This Digital Twin platform simulates the **Hydrothermal Liquefaction (HTL)** process, allowing researchers and industry stakeholders to visualize, analyze, and optimize the conversion of poultry waste into valuable Bio-oil. It features real-time kinetic modeling using the **Runge-Kutta 4th Order (RK4)** method, 3D visualization, and comprehensive techno-economic and environmental analysis.

## ✨ Key Features

### 1. 🔬 Advanced Simulation Engine
- **RK4 Numerical Solver**: High-precision resolution of reaction rate differential equations.
- **Component-Contribution Model**: Calculates yields based on Lipids, Proteins, and Carbohydrates.
- **Dynamic Kinetics**: Implements the Arrhenius equation ($k = A e^{-Ea/RT}$) for product distribution.
- **Pressure Correction**: Accounts for solvent density effects (Sub-critical vs. Super-critical).
- **Mass Balance Normalization**: Ensures 100% mass closure for scientific validity.

### 2. 🧊 3D Process Visualization
- Interactive **3D Digital Twin** of the reactor using React Three Fiber.
- Real-time visual feedback for temperature changes and processing states.

### 3. 📊 Interactive Dashboard
- **Product Analysis**: Real-time charts for kinetic profiles, yield distribution, and temperature optimization.
- **Economic Suite (TEA)**: Automatic calculation of **NPV (10-year)**, **ROI**, **IRR**, and **Payback Period**.
- **Mode Analisis Biaya**: Switch between **ISBL** (Equipment Only) and **TCI** (Turnkey Project) based on PNNL-25464.
- **Feedstock Pricing Toggle**: Option to include raw material costs (Rp/kg) in the economic model.
- **🌱 Environmental Impact (LCA)**: CO₂ emission comparison vs. Coal, following IPCC (2006) and Moser et al. (2023) standards.

### 4. 📉 Data & Documentation
- **CSV Export**: Download simulation reports for offline analysis.
- **In-App Documentation**: Detailed explanation of the mathematical models and logic.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Visuals**: [React Three Fiber](https://docs.pmndrs.assets/react-three-fiber) & [Recharts](https://recharts.org/)
- **State**: [Zustand](https://github.com/pmndrs/zustand)
- **UI**: [Framer Motion](https://www.framer.com/motion/) & [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/dzakyzahy/htl-system-digital-twin-think3rs.git
    npm install
    ```
2.  **Run Development**:
    ```bash
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000).

## 👥 Team Think3rs

| Name | Role | Institution |
|------|------|-------------|
| **Syahid Ma'ashum** | Principal Investigator | UGM (Faculty of Animal Science) |
| **M. Ilham Saripul Milah** | Process Simulation Engineer | ITB (Metallurgical Engineering) |
| **Dzaky Zahy Rabbani** | Software & Digital Twin Architect | ITB (Oceanography) |

## 📄 License

This project is licensed under the **MIT License**.

---
