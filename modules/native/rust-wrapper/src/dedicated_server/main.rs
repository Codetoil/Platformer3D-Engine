#[path = "../js_container.rs"] mod js_container;
use std::borrow::Cow;

fn main() {
    fn load_dedicated_server() -> Cow<'static, str> {
        let bytes = include_bytes!("dedicated_server.js");
        let js = String::from_utf8_lossy(bytes);
        js
    }
    let js = load_dedicated_server();
    js_container::run_js(js);
}