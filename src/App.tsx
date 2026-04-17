import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useDevDashStore } from "./store/useDevDashStore";
import { ProjectsPanel } from "./components/ProjectsPanel";
import { PortsPanel } from "./components/PortsPanel";
import { BuildsPanel } from "./components/BuildsPanel";
import { SessionsPanel } from "./components/SessionsPanel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Activity, Network, Hammer, Save } from "lucide-react";

function App() {
  const { setProjects, setPorts, setBuilds } = useDevDashStore();

  useEffect(() => {
    // Listen for backend updates
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

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden selection:bg-primary/30">
      <header className="h-12 border-b flex items-center justify-between px-4 drag-region">
        <h1 className="font-bold text-lg tracking-tight drag-region">DevDash</h1>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Monitoring</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <Accordion>
          <AccordionItem value="projects">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                <span>Projects</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ProjectsPanel />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ports">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center">
                <Network className="w-4 h-4 mr-2" />
                <span>Developer Ports</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <PortsPanel />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="builds">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center">
                <Hammer className="w-4 h-4 mr-2" />
                <span>Builds & Tasks</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <BuildsPanel />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sessions">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                <span>Sessions</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <SessionsPanel />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}

export default App;
