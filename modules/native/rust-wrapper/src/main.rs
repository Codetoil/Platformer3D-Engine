use std::borrow::Cow;
use quick_js::console::Level;
use quick_js::JsValue;

fn main() {
    fn load_client() -> Cow<'static, str> {
        let bytes = include_bytes!("client.js");
        let js = String::from_utf8_lossy(bytes);
        js
    }
    fn load_dedicated_server() -> Cow<'static, str> {
        let bytes = include_bytes!("dedicated_server.js");
        let js = String::from_utf8_lossy(bytes);
        js
    }
    fn load_singleplayer() -> Cow<'static, str> {
        let bytes = include_bytes!("singleplayer.js");
        let js = String::from_utf8_lossy(bytes);
        js
    }
    let js = load_dedicated_server();

    let mut context_builder = quick_js::Context::builder();
    context_builder = context_builder.console(|level: Level, args: Vec<JsValue>| {
        match level {
            Level::Error | Level::Warn => eprintln!("{}: {:?}", level, args),
            _ => println!("{}: {:?}", level, args)
        }
    });
    let context = context_builder.build().unwrap();


    // Load Javascript
    context.eval(&js).unwrap();
    println!("Dummy Statement");
}