use serde::{Deserialize, Serialize};

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

#[cfg(not(target_os = "windows"))]
pub fn get_projects() -> Vec<Project> {
    vec![
        Project {
            name: "devdash".to_string(),
            root: "/path/to/devdash".to_string(),
            cpu_percent: 12.5,
            ram_mb: 450.0,
            processes: vec![
                ProcessEntry {
                    pid: 1234,
                    name: "node".to_string(),
                    cpu_percent: 5.0,
                    ram_mb: 200.0,
                },
                ProcessEntry {
                    pid: 1235,
                    name: "cargo".to_string(),
                    cpu_percent: 7.5,
                    ram_mb: 250.0,
                },
            ],
        },
        Project {
            name: "backend-api".to_string(),
            root: "/path/to/backend-api".to_string(),
            cpu_percent: 2.1,
            ram_mb: 120.0,
            processes: vec![
                ProcessEntry {
                    pid: 9988,
                    name: "python".to_string(),
                    cpu_percent: 2.1,
                    ram_mb: 120.0,
                },
            ],
        },
    ]
}

#[cfg(target_os = "windows")]
pub fn get_projects() -> Vec<Project> {
    // Windows specific logic would go here using windows-rs
    vec![]
}
