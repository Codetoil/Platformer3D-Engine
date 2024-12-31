use std::borrow::Cow;
use quick_js::console::Level;
use quick_js::JsValue;

pub fn run_js(js: Cow<'static, str>)
{
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