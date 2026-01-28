
import { Header } from "@/components/layout/Header";
import { ControlPanel } from "@/components/simulation/ControlPanel";
import { Dashboard } from "@/components/simulation/Dashboard";

export default function SimulationPage() {
    return (
        <div className="flex h-screen flex-col">
            <Header />
            <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
                <ControlPanel />
                <Dashboard />
            </main>
        </div>
    );
}
