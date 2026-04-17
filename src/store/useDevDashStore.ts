import { create } from 'zustand';

export interface ProcessEntry {
  pid: number;
  name: string;
  cpu_percent: number;
  ram_mb: number;
}

export interface Project {
  name: string;
  root: string;
  cpu_percent: number;
  ram_mb: number;
  processes: ProcessEntry[];
}

export interface PortEntry {
  port: number;
  protocol: "TCP" | "UDP";
  pid: number;
  process_name: string;
  project_name: string | null;
  status: "LISTEN" | "ESTABLISHED";
  is_conflict: boolean;
}

export interface BuildEntry {
  id: number;
  project_name: string;
  tool: string;
  command: string;
  exit_code: number | null;
  started_at: string;
  duration_ms: number | null;
  output_tail: string;
}

export interface SessionProject {
  name: string;
  root: string;
  start_commands: string[];
  terminal_cwd: string;
}

export interface Session {
  version: 1;
  name: string;
  saved_at: string;
  projects: SessionProject[];
}

interface DevDashState {
  projects: Project[];
  ports: PortEntry[];
  builds: BuildEntry[];
  sessions: Session[];
  setProjects: (projects: Project[]) => void;
  setPorts: (ports: PortEntry[]) => void;
  setBuilds: (builds: BuildEntry[]) => void;
  setSessions: (sessions: Session[]) => void;
}

export const useDevDashStore = create<DevDashState>((set) => ({
  projects: [],
  ports: [],
  builds: [],
  sessions: [],
  setProjects: (projects) => set({ projects }),
  setPorts: (ports) => set({ ports }),
  setBuilds: (builds) => set({ builds }),
  setSessions: (sessions) => set({ sessions }),
}));
