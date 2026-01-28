# 🏭 Hydrothermal Liquefaction (HTL) Digital Twin

**A High-Fidelity Web Simulation Platform for Bio-Oil Production from Poultry Manure.**  
*Built for LKTIN AEROSPACE 2026 by Team Think3rs.*

![Project Banner](/public/assets/Logo_ITB.png) <!-- Update this if you have a screenshot of the dashboard -->

## 🚀 Overview

This Digital Twin platform simulates the **Hydrothermal Liquefaction (HTL)** process, allowing researchers and industry stakeholders to visualize, analyze, and optimize the conversion of poultry waste (chicken & cow manure) into valuable Bio-oil.

It combines **scientific rigor** with **premium accessibility**, featuring real-time kinetic modeling, 3D visualization, and complete techno-economic analysis.

## ✨ Key Features

### 1. 🔬 Advanced Simulation Engine
- **Component-Contribution Model**: Calculates yields based on exact biochemical composition (Lipids, Proteins, Carbohydrates).
- **Dynamic Kinetics**: Implements Arrhenius equation to model reaction rates ($k = A e^{-Ea/RT}$) and product distribution (Bio-oil, Gas, Char, Aqueous).
- **Real-Time Thermodynamics**: Dynamic calculation of Higher Heating Value (HHV) and Energy Recovery Ratio (ERR).

### 2. 🧊 3D Process Visualization
- Interactive **3D Digital Twin** of the reactor facility using React Three Fiber.
- Visual feedback for temperature changes and processing states.

### 3. 📊 Interactive Dashboard
- **Product Analysis**: Real-time line charts for kinetic profiles and pie charts for yield distribution.
- **Economic Suite**: Automatic calculation of NPV (10-year), ROI, IRR, and Payback Period based on CAPEX/OPEX inputs.
- **Mobile Optimized**: Fully responsive interface for tablets and smartphones.

### 4. 📉 Data Export
- Download comprehensive simulation reports in CSV format for offline analysis.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Visualization**: 
  - [React Three Fiber](https://docs.pmndrs.assets/react-three-fiber) (3D)
  - [Recharts](https://recharts.org/) (2D Charts)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ installed.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/dzakyzahy/htl-system-digital-twin-think3rs.git
    cd htl-system-digital-twin-think3rs
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 Team Think3rs

| Name | Role | Institution |
|------|------|-------------|
| **Syahid Ma'ashum** | Principal Investigator | UGM (Faculty of Animal Science) |
| **M. Ilham Saripul Milah** | Process Simulation Engineer | ITB (Metallurgical Engineering) |
| **Dzaky Zahy Rabbani** | Software & Digital Twin Architect | ITB (Oceanography) |

## 📄 License

This project is licensed under the **MIT License**.

---
*Developed with ❤️ for a sustainable future.*
