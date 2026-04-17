import { useDevDashStore } from "@/store/useDevDashStore";
import { Badge } from "@/components/ui/badge";
import { Hammer, Clock, CheckCircle2, XCircle } from "lucide-react";

export function BuildsPanel() {
  const { builds } = useDevDashStore();

  if (builds.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center">
        No active or recent builds.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {builds.map((build, idx) => (
        <div key={idx} className="flex flex-col space-y-2 p-3 bg-secondary/20 rounded-md border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Hammer className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">{build.project_name}</span>
              <Badge variant="outline" className="text-xs">{build.tool}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              {build.exit_code === null ? (
                <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-500">Running</Badge>
              ) : build.exit_code === 0 ? (
                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-500">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Success
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs bg-red-500/10 text-red-500">
                  <XCircle className="w-3 h-3 mr-1" /> Failed ({build.exit_code})
                </Badge>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground flex items-center space-x-4">
            <span className="font-mono bg-background px-1 rounded truncate flex-1">{build.command}</span>
            {build.duration_ms !== null && (
              <span className="flex items-center flex-shrink-0">
                <Clock className="w-3 h-3 mr-1" /> {build.duration_ms}ms
              </span>
            )}
          </div>
          {build.output_tail && (
            <div className="bg-black/90 text-green-400 font-mono text-[10px] p-2 rounded mt-2 max-h-24 overflow-y-auto whitespace-pre-wrap">
              {build.output_tail}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
