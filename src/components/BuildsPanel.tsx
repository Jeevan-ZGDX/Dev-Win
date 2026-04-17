import { ChevronRight } from "lucide-react";
import { useDevDashStore } from "@/store/useDevDashStore";

export function BuildsPanel() {
  const { builds } = useDevDashStore();

  const activeBuilds = builds.filter(b => b.exit_code === null);

  return (
    <div className="flex flex-col gap-6">
      {/* Build Activity */}
      <div>
        <h2 className="text-[13px] font-semibold text-[#e4e4e7] mb-3">Build Activity</h2>
        {activeBuilds.length === 0 ? (
          <div className="text-[13px] text-[#a1a1aa] italic">
            No active builds
          </div>
        ) : (
          <div className="space-y-3">
            {activeBuilds.map((build, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="mt-1.5 flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
                </div>
                <div>
                  <div className="text-[14px] text-[#e4e4e7] font-medium tracking-wide">
                    {build.project_name} <span className="text-[#a1a1aa] font-normal">&middot; {build.tool}</span>
                  </div>
                  <div className="text-[12px] text-[#71717a] mt-0.5 font-mono truncate max-w-[300px]">
                    {build.output_tail.split('\n').pop() || "Building..."}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-px w-full bg-[#27272a]" />

      {/* Recent Builds */}
      <div className="flex items-center justify-between group cursor-pointer">
        <h2 className="text-[13px] font-semibold text-[#e4e4e7]">Recent Builds</h2>
        <ChevronRight className="w-4 h-4 text-[#e4e4e7]" />
      </div>
    </div>
  );
}
