use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct PortEntry {
    pub port: u16,
    pub protocol: String,
    pub pid: u32,
    pub process_name: String,
    pub project_name: Option<String>,
    pub status: String,
    pub is_conflict: bool,
}

#[cfg(not(target_os = "windows"))]
pub fn get_ports() -> Vec<PortEntry> {
    vec![
        PortEntry {
            port: 1420,
            protocol: "TCP".to_string(),
            pid: 1234,
            process_name: "node".to_string(),
            project_name: Some("devdash".to_string()),
            status: "LISTEN".to_string(),
            is_conflict: false,
        },
        PortEntry {
            port: 3000,
            protocol: "TCP".to_string(),
            pid: 9988,
            process_name: "python".to_string(),
            project_name: Some("backend-api".to_string()),
            status: "LISTEN".to_string(),
            is_conflict: true,
        },
        PortEntry {
            port: 3000,
            protocol: "TCP".to_string(),
            pid: 9989,
            process_name: "node".to_string(),
            project_name: None,
            status: "LISTEN".to_string(),
            is_conflict: true,
        },
    ]
}

#[cfg(target_os = "windows")]
pub fn get_ports() -> Vec<PortEntry> {
    vec![]
}
