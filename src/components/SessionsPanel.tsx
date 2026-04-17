import { useDevDashStore } from "@/store/useDevDashStore";
import { Button } from "@/components/ui/button";
import { Save, Play, Clock } from "lucide-react";

export function SessionsPanel() {
  const { sessions } = useDevDashStore();

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button size="sm" variant="outline" className="h-8 text-xs">
          <Save className="w-3 h-3 mr-2" /> Save Current Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-sm text-muted-foreground p-4 text-center">
          No saved sessions yet.
        </div>
      ) : (
        sessions.map((session, idx) => (
          <div key={idx} className="flex flex-col space-y-2 p-3 bg-secondary/20 rounded-md border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">{session.name}</span>
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> {new Date(session.saved_at).toLocaleString()}
                </span>
              </div>
              <Button size="sm" className="h-6 text-xs px-3">
                <Play className="w-3 h-3 mr-1" /> Restore
              </Button>
            </div>
            <div className="text-xs text-muted-foreground space-y-1 pl-2">
              {session.projects.map((proj, pidx) => (
                <div key={pidx}>• {proj.name} ({proj.start_commands.length} cmds)</div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
