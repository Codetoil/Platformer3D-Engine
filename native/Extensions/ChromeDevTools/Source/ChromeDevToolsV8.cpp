#include <Extensions/ChromeDevTools.h>

#include <V8InspectorAgent.h>
#include <Babylon/JsRuntime.h>

class ChromeDevTools::Impl final : public std::enable_shared_from_this<Impl>
    {
    public:
        explicit Impl(Napi::Env env)
            : m_env(env)
        {
            Babylon::JsRuntime::GetFromJavaScript(env).Dispatch([this](Napi::Env env) {
                auto& v8Platform = *Babylon::JsRuntime::NativeObject::GetFromJavaScript(env).Get("_V8Platform").As<Napi::External<v8::Platform>>().Data();
                auto v8Isolate = v8::Isolate::GetCurrent();
                auto v8Context = v8Isolate->GetCurrentContext();
                m_inspector = std::make_unique<Babylon::V8InspectorAgent>(v8Platform, v8Isolate, v8Context, "Game3D Native");
            });
        }

        ~Impl()
        {
            if (m_inspector != nullptr)
            {
                m_inspector->stop();
            }
        }

        static bool SupportsInspector()
        {
            return true;
        }

        void StartInspector(const unsigned short port, const std::string& appName)
        {
            Babylon::JsRuntime::GetFromJavaScript(m_env).Dispatch([this, port, appName](Napi::Env) {
                if (m_inspector->IsStarted())
                {
                    m_inspector->stop();
                }

                m_inspector->start(port, appName);
            });
        }

        void StopInspector()
        {
            Babylon::JsRuntime::GetFromJavaScript(m_env).Dispatch([this](Napi::Env) {
                m_inspector->stop();
            });
        }

    private:
        std::unique_ptr<Babylon::V8InspectorAgent> m_inspector{};
        Napi::Env m_env;
    };

    ChromeDevTools ChromeDevTools::Initialize(Napi::Env env)
    {
        return {ChromeDevTools(std::make_shared<Impl>(env))};
    }

    ChromeDevTools::ChromeDevTools(std::shared_ptr<Impl> impl)
        : m_impl{std::move(impl)}
    {
    }

    bool ChromeDevTools::SupportsInspector() const
    {
        return m_impl->SupportsInspector();
    }

    void ChromeDevTools::StartInspector(const unsigned short port, const std::string& appName) const
    {
        m_impl->StartInspector(port, appName);
    }

    void ChromeDevTools::StopInspector() const
    {
        m_impl->StopInspector();
    }