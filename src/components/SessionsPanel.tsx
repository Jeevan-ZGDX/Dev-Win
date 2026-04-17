import { ChevronRight } from "lucide-react";

export function SessionsPanel() {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <h2 className="text-[13px] font-semibold text-[#e4e4e7]">Sessions</h2>
      <div className="flex items-center gap-4">
        <button className="bg-[#27272a]/50 text-[#facc15] hover:bg-[#facc15]/10 px-3 py-1 rounded-md text-[13px] font-medium transition-colors">
          Save
        </button>
        <ChevronRight className="w-4 h-4 text-[#e4e4e7]" />
      </div>
    </div>
  );
}
