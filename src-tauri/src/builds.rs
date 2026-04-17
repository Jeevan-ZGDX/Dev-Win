use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct BuildEntry {
    pub id: i64,
    pub project_name: String,
    pub tool: String,
    pub command: String,
    pub exit_code: Option<i32>,
    pub started_at: String,
    pub duration_ms: Option<i64>,
    pub output_tail: String,
}

#[cfg(not(target_os = "windows"))]
pub fn get_builds() -> Vec<BuildEntry> {
    vec![
        BuildEntry {
            id: 1,
            project_name: "devdash".to_string(),
            tool: "npm".to_string(),
            command: "npm run dev".to_string(),
            exit_code: None,
            started_at: "2026-04-17T10:00:00Z".to_string(),
            duration_ms: None,
            output_tail: "> devdash@0.1.0 dev\n> vite\n\n  VITE v5.0.0  ready in 200 ms".to_string(),
        },
        BuildEntry {
            id: 2,
            project_name: "backend-api".to_string(),
            tool: "cargo".to_string(),
            command: "cargo build --release".to_string(),
            exit_code: Some(0),
            started_at: "2026-04-17T09:45:00Z".to_string(),
            duration_ms: Some(45000),
            output_tail: "    Finished release [optimized] target(s) in 45.0s".to_string(),
        },
    ]
}

#[cfg(target_os = "windows")]
pub fn get_builds() -> Vec<BuildEntry> {
    vec![]
}
