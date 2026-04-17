import { useDevDashStore } from "@/store/useDevDashStore";
import { ChevronRight } from "lucide-react";

export function ProjectsPanel() {
  const { projects } = useDevDashStore();

  if (projects.length === 0) {
    return (
      <div className="text-[13px] text-[#a1a1aa] italic">
        No active projects
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project, idx) => (
        <div key={idx} className="flex items-center justify-between group cursor-pointer">
          <div className="flex gap-3">
            <div className="mt-1.5 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            </div>
            <div>
              <div className="text-[14px] text-[#e4e4e7] font-medium tracking-wide">
                {project.name}
              </div>
              <div className="text-[12px] text-[#71717a] mt-0.5">
                {project.processes.length} processes &middot; {Math.round(project.ram_mb)} MB &middot; 57m
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71717a] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}
