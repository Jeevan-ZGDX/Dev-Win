use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};
use sysinfo::{System, ProcessRefreshKind, UpdateKind};

#[derive(Clone, Serialize, Deserialize)]
pub struct ProcessEntry {
    pub pid: u32,
    pub name: String,
    pub cpu_percent: f32,
    pub ram_mb: f32,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Project {
    pub name: String,
    pub root: String,
    pub cpu_percent: f32,
    pub ram_mb: f32,
    pub processes: Vec<ProcessEntry>,
}

static SYSTEM: OnceLock<Mutex<System>> = OnceLock::new();

pub fn get_projects() -> Vec<Project> {
    let sys_mutex = SYSTEM.get_or_init(|| Mutex::new(System::new_all()));
    let mut sys = sys_mutex.lock().unwrap();
    sys.refresh_processes_specifics(
        sysinfo::ProcessRefreshKind::new()
            .with_cpu()
            .with_memory()
            .with_exe(sysinfo::UpdateKind::OnlyIfNotSet)
    );

    let mut projects_map: HashMap<String, Project> = HashMap::new();
    let dev_keywords = ["node", "cargo", "python", "java", "go", "ruby", "npm", "yarn", "pnpm", "devdash", "devwatch"];

    for (pid, process) in sys.processes() {
        let name = process.name().to_string_lossy().to_lowercase();
        
        let is_dev = dev_keywords.iter().any(|k| name.contains(k));
        
        if is_dev {
            let pid_u32 = pid.as_u32();
            let cpu = process.cpu_usage();
            let ram_mb = (process.memory() as f32) / 1024.0 / 1024.0;
            
            let entry = ProcessEntry {
                pid: pid_u32,
                name: name.clone(),
                cpu_percent: cpu,
                ram_mb,
            };

            // Heuristic project grouping: use executable name for now if no clear parent dir is found
            let proj_name = if name.contains("node") || name.contains("npm") {
                "Frontend Web".to_string()
            } else if name.contains("cargo") {
                "Rust Backend".to_string()
            } else if name.contains("devdash") || name.contains("devwatch") {
                "DevWatch".to_string()
            } else {
                name.clone()
            };

            let proj = projects_map.entry(proj_name.clone()).or_insert(Project {
                name: proj_name,
                root: "Unknown".to_string(),
                cpu_percent: 0.0,
                ram_mb: 0.0,
                processes: Vec::new(),
            });

            proj.cpu_percent += cpu;
            proj.ram_mb += ram_mb;
            proj.processes.push(entry);
        }
    }

    let mut result: Vec<Project> = projects_map.into_values().collect();
    // Keep only projects with memory > 1MB to filter out noise
    result.retain(|p| p.ram_mb > 1.0);
    result.sort_by(|a, b| b.ram_mb.partial_cmp(&a.ram_mb).unwrap());
    result
}
