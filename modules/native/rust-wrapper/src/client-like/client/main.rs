#[path = "../../js_container.rs"] mod js_container;
use std::borrow::Cow;

fn main() {
    fn load_client() -> Cow<'static, str> {
        let bytes = include_bytes!("../client/client.js");
        let js = String::from_utf8_lossy(bytes);
        js
    }
    fn load_integrated_server() -> Cow<'static, str> {
        let bytes = include_bytes!("../client/integratedServerWorker.js");
        let js = String::from_utf8_lossy(bytes);
        js
    }
    let js = load_client();
    let js_integrated_server = load_integrated_server();
    js_container::run_js(js);
}