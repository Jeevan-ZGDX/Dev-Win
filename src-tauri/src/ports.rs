use serde::{Deserialize, Serialize};
use std::process::Command;
use std::collections::HashMap;

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

pub fn get_ports() -> Vec<PortEntry> {
    let mut ports = Vec::new();
    
    // Cross-platform netstat execution
    #[cfg(target_os = "windows")]
    let output = Command::new("netstat").args(["-ano"]).output();
    
    #[cfg(not(target_os = "windows"))]
    let output = Command::new("ss").args(["-tulpn"]).output();

    if let Ok(output) = output {
        let stdout = String::from_utf8_lossy(&output.stdout);
        let mut port_counts: HashMap<u16, usize> = HashMap::new();
        
        for line in stdout.lines() {
            #[cfg(target_os = "windows")]
            {
                // TCP    0.0.0.0:1420      0.0.0.0:0      LISTENING       1234
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() >= 5 && parts[0] == "TCP" && parts[3] == "LISTENING" {
                    if let Some(port_str) = parts[1].split(':').last() {
                        if let Ok(port) = port_str.parse::<u16>() {
                            if let Ok(pid) = parts[4].parse::<u32>() {
                                *port_counts.entry(port).or_insert(0) += 1;
                                ports.push(PortEntry {
                                    port,
                                    protocol: "TCP".to_string(),
                                    pid,
                                    process_name: format!("Process {}", pid), // We can enrich this with sysinfo later
                                    project_name: None,
                                    status: "LISTEN".to_string(),
                                    is_conflict: false,
                                });
                            }
                        }
                    }
                }
            }
            
            #[cfg(not(target_os = "windows"))]
            {
                // tcp LISTEN 0 128 0.0.0.0:1420 0.0.0.0:* users:(("node",pid=1234,fd=18))
                if line.starts_with("tcp") && line.contains("LISTEN") {
                    let parts: Vec<&str> = line.split_whitespace().collect();
                    if parts.len() >= 5 {
                        let addr_part = if parts[3].contains(':') { parts[3] } else { parts[4] };
                        if let Some(port_str) = addr_part.split(':').last() {
                            if let Ok(port) = port_str.parse::<u16>() {
                                // Just a dummy parsing for Linux to show something
                                ports.push(PortEntry {
                                    port,
                                    protocol: "TCP".to_string(),
                                    pid: 0,
                                    process_name: "Service".to_string(),
                                    project_name: None,
                                    status: "LISTEN".to_string(),
                                    is_conflict: false,
                                });
                            }
                        }
                    }
                }
            }
        }
        
        // Mark conflicts
        for p in &mut ports {
            if let Some(&count) = port_counts.get(&p.port) {
                p.is_conflict = count > 1;
            }
        }
    }
    
    // Sort and limit for UI
    ports.sort_by_key(|p| p.port);
    ports.dedup_by_key(|p| (p.port, p.pid));
    ports.into_iter().take(20).collect()
}
