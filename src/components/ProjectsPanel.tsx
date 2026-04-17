import { useDevDashStore } from "@/store/useDevDashStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Cpu, HardDrive } from "lucide-react";

export function ProjectsPanel() {
  const { projects } = useDevDashStore();

  if (projects.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center">
        No active projects detected.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project, idx) => (
        <div key={idx} className="flex flex-col space-y-2 p-3 bg-secondary/20 rounded-md border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">{project.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Cpu className="w-3 h-3 mr-1" />
                {project.cpu_percent}%
              </Badge>
              <Badge variant="outline" className="text-xs">
                <HardDrive className="w-3 h-3 mr-1" />
                {project.ram_mb} MB
              </Badge>
              <Button size="sm" variant="destructive" className="h-6 text-xs px-2">Kill All</Button>
            </div>
          </div>
          <div className="space-y-1 mt-2">
            {project.processes.map(proc => (
              <div key={proc.pid} className="flex items-center justify-between text-xs text-muted-foreground pl-6">
                <span>{proc.name} ({proc.pid})</span>
                <div className="flex items-center space-x-2">
                  <span>{proc.cpu_percent}% CPU</span>
                  <span>{proc.ram_mb} MB</span>
                  <button className="text-destructive hover:underline ml-2">Kill</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
