use serde::{Deserialize, Serialize};

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

#[tauri::command]
pub fn save_session(name: String) -> Result<String, String> {
    Ok(format!("Session {} saved", name))
}

#[tauri::command]
pub fn restore_session(session_name: String) -> Result<(), String> {
    Ok(())
}

#[cfg(not(target_os = "windows"))]
pub fn get_sessions() -> Vec<Session> {
    vec![
        Session {
            version: 1,
            name: "Morning Dev".to_string(),
            saved_at: "2026-04-16T08:00:00Z".to_string(),
            projects: vec![
                SessionProject {
                    name: "devdash".to_string(),
                    root: "/path/to/devdash".to_string(),
                    start_commands: vec!["npm run tauri dev".to_string()],
                    terminal_cwd: "/path/to/devdash".to_string(),
                }
            ],
        }
    ]
}

#[cfg(target_os = "windows")]
pub fn get_sessions() -> Vec<Session> {
    vec![]
}
