import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useDevDashStore } from "./store/useDevDashStore";
import { Settings, Search } from "lucide-react";
import { ProjectsPanel } from "./components/ProjectsPanel";
import { PortsPanel } from "./components/PortsPanel";
import { BuildsPanel } from "./components/BuildsPanel";
import { SessionsPanel } from "./components/SessionsPanel";

function App() {
  const { setProjects, setPorts, setBuilds, projects } = useDevDashStore();

  useEffect(() => {
    const unlistenProjects = listen("projects-updated", (event: any) => {
      setProjects(event.payload);
    });
    const unlistenPorts = listen("ports-updated", (event: any) => {
      setPorts(event.payload);
    });
    const unlistenBuilds = listen("builds-updated", (event: any) => {
      setBuilds(event.payload);
    });

    return () => {
      unlistenProjects.then(f => f());
      unlistenPorts.then(f => f());
      unlistenBuilds.then(f => f());
    };
  }, []);

  const totalRam = projects.reduce((acc, p) => acc + p.ram_mb, 0);
  const totalProjects = projects.length;

  return (
    <div className="h-screen w-screen bg-[#111113] text-[#e4e4e7] flex flex-col overflow-hidden font-sans selection:bg-yellow-500/30">
      {/* Header */}
      <header className="px-5 pt-5 pb-3 drag-region flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-xl tracking-tight text-white drag-region">DevWatch</h1>
          <button className="text-[#a1a1aa] hover:text-white transition-colors cursor-pointer">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-sm text-[#a1a1aa] flex items-center gap-1.5">
          <span>{totalProjects} project(s) running</span>
          <span>&middot;</span>
          <span>{Math.round(totalRam)} MB RAM</span>
        </div>

        <div className="mt-2">
          <button className="bg-[#27272a]/50 text-[#facc15] border border-[#facc15]/20 hover:bg-[#facc15]/10 px-3 py-1.5 rounded-md text-xs font-medium transition-colors">
            Stop All Projects
          </button>
        </div>
      </header>

      <div className="px-5">
        <div className="h-px w-full bg-[#27272a]" />
      </div>

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 flex flex-col gap-6 custom-scrollbar">
        {/* Running Projects Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-[#e4e4e7]">Running Projects</h2>
            <button className="text-[#a1a1aa] hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
          <ProjectsPanel />
        </section>

        <div className="h-px w-full bg-[#27272a]" />

        {/* Open Ports Section */}
        <section>
          <h2 className="text-[13px] font-semibold text-[#e4e4e7] mb-3">Open Ports</h2>
          <PortsPanel />
        </section>

        <div className="h-px w-full bg-[#27272a]" />

        {/* Sessions Section */}
        <section>
          <SessionsPanel />
        </section>

        <div className="h-px w-full bg-[#27272a]" />

        {/* Build Activity Section */}
        <section>
          <BuildsPanel />
        </section>

      </main>
    </div>
  );
}

export default App;
