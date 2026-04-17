// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

pub mod processes;
pub mod ports;
pub mod builds;
pub mod sessions;

use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};
use std::time::Duration;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle().clone();

            // Spawn background task to emit mock data
            tauri::async_runtime::spawn(async move {
                loop {
                    let _ = app_handle.emit("projects-updated", processes::get_projects());
                    let _ = app_handle.emit("ports-updated", ports::get_ports());
                    let _ = app_handle.emit("builds-updated", builds::get_builds());
                    tokio::time::sleep(Duration::from_secs(2)).await;
                }
            });

            let open_i = MenuItem::with_id(app, "open", "Open DevDash", true, None::<&str>)?;
            let save_i = MenuItem::with_id(app, "save_session", "Save Session", true, None::<&str>)?;
            let restore_i = MenuItem::with_id(app, "restore_session", "Restore Session...", true, None::<&str>)?;
            let settings_i = MenuItem::with_id(app, "settings", "Settings", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quit DevDash", true, None::<&str>)?;

            let menu = Menu::with_items(
                app,
                &[
                    &open_i,
                    &save_i,
                    &restore_i,
                    &settings_i,
                    &quit_i,
                ],
            )?;

            let _tray = TrayIconBuilder::new()
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "open" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {
                        println!("Menu item {:?} not handled", event.id);
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            sessions::save_session,
            sessions::restore_session
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
