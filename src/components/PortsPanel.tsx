import { useDevDashStore } from "@/store/useDevDashStore";

export function PortsPanel() {
  const { ports } = useDevDashStore();

  if (ports.length === 0) {
    return (
      <div className="text-[13px] text-[#a1a1aa] italic">
        No open ports
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ports.map((port, idx) => (
        <div key={idx} className="flex items-center justify-between group">
          <div className="flex gap-3">
            <div className="mt-1.5 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#52525b]" />
            </div>
            <div>
              <div className="text-[14px] text-[#a1a1aa] font-medium tracking-wide">
                {port.process_name}
              </div>
              <div className="text-[12px] text-[#71717a] mt-0.5">
                Port {port.port} &middot; {port.process_name} &middot; 7m
              </div>
            </div>
          </div>
          <button className="text-[13px] text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors pr-2">
            Stop
          </button>
        </div>
      ))}
    </div>
  );
}
