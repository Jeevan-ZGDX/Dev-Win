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

pub fn get_builds() -> Vec<BuildEntry> {
    // In a full implementation, this reads from SQLite.
    // For now, it returns an empty vector as per DevWatch UI "No active builds"
    Vec::new()
}
