import { useDevDashStore } from "@/store/useDevDashStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Network } from "lucide-react";

export function PortsPanel() {
  const { ports } = useDevDashStore();

  if (ports.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center">
        No active developer ports detected.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Port</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Process</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ports.map((port, idx) => (
            <TableRow key={idx} className={port.is_conflict ? "bg-destructive/10" : ""}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <Network className="w-3 h-3 text-muted-foreground" />
                  <span>{port.port}</span>
                </div>
              </TableCell>
              <TableCell>
                {port.project_name ? (
                  <Badge variant="secondary" className="text-xs">{port.project_name}</Badge>
                ) : (
                  <span className="text-muted-foreground text-xs">Unknown</span>
                )}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {port.process_name} ({port.pid})
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="h-6 text-xs px-2 text-destructive hover:text-destructive">Kill</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
