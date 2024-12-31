#[path = "../../js_container.rs"] mod js_container;
use std::borrow::Cow;

fn main() {
    fn load_singleplayer() -> Cow<'static, str> {
        let bytes = include_bytes!("singleplayer.js");
        let js = String::from_utf8_lossy(bytes);
        js
    }
    let js = load_singleplayer();
    js_container::run_js(js);
}