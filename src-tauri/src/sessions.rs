use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Clone, Serialize, Deserialize)]
pub struct SessionProject {
    pub name: String,
    pub root: String,
    pub start_commands: Vec<String>,
    pub terminal_cwd: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Session {
    pub version: i32,
    pub name: String,
    pub saved_at: String,
    pub projects: Vec<SessionProject>,
}

fn get_sessions_dir() -> PathBuf {
    let mut path = dirs::data_dir().unwrap_or_else(|| PathBuf::from("."));
    path.push("DevDash");
    path.push("sessions");
    let _ = fs::create_dir_all(&path);
    path
}

#[tauri::command]
pub fn save_session(name: String) -> Result<String, String> {
    let session = Session {
        version: 1,
        name: name.clone(),
        saved_at: "Now".to_string(), // In real app, use chrono
        projects: Vec::new(),
    };
    
    let mut path = get_sessions_dir();
    path.push(format!("{}.json", name));
    
    if let Ok(json) = serde_json::to_string_pretty(&session) {
        if fs::write(path, json).is_ok() {
            return Ok(format!("Session {} saved", name));
        }
    }
    Err("Failed to save session".to_string())
}

#[tauri::command]
pub fn restore_session(_session_name: String) -> Result<(), String> {
    Ok(())
}

pub fn get_sessions() -> Vec<Session> {
    let mut sessions = Vec::new();
    let dir = get_sessions_dir();
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            if let Ok(content) = fs::read_to_string(entry.path()) {
                if let Ok(session) = serde_json::from_str::<Session>(&content) {
                    sessions.push(session);
                }
            }
        }
    }
    sessions
}
