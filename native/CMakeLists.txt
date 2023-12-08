cmake_minimum_required(VERSION 3.21)
project(Game3D)

set(SCRIPTS
        "${CMAKE_CURRENT_LIST_DIR}/Script/assets/client-C5D_gxjW.js")

if (APPLE)
    find_library(JAVASCRIPTCORE_LIBRARY JavaScriptCore)
    if (IOS)
        set(PLIST_FILE
                "${CMAKE_CURRENT_LIST_DIR}/iOS/Info.plist")
        set(STORYBOARD
                "${CMAKE_CURRENT_LIST_DIR}/iOS/Base.lproj/Main.storyboard"
                "${CMAKE_CURRENT_LIST_DIR}/iOS/Base.lproj/LaunchScreen.storyboard")
        set(RESOURCE_FILES ${STORYBOARD} ${SCRIPTS})
        set(ADDITIONAL_LIBRARIES PRIVATE z NativeXr)
        set(SOURCES
                ${SOURCES}
                "iOS/AppDelegate.swift"
                "iOS/ViewController.swift"
                "iOS/LibNativeBridge.h"
                "iOS/LibNativeBridge.mm")
        set_source_files_properties(${SCRIPTS} PROPERTIES MACOSX_PACKAGE_LOCATION "Scripts")
    else ()
        set(PLIST_FILE "${CMAKE_CURRENT_LIST_DIR}/macOS/Info.plist")
        set(STORYBOARD "${CMAKE_CURRENT_LIST_DIR}/macOS/Base.lproj/Main.storyboard")
        set(RESOURCE_FILES ${STORYBOARD})
        set(SOURCES
                ${SOURCES}
                "macOS/main.m"
                "macOS/AppDelegate.m"
                "macOS/AppDelegate.h"
                "macOS/ViewController.mm"
                "macOS/ViewController.h")
        set_source_files_properties(${SCRIPTS} PROPERTIES MACOSX_PACKAGE_LOCATION "Resources/Scripts")
    endif ()
    set(ADDITIONAL_LIBRARIES ${ADDITIONAL_LIBRARIES}
            PRIVATE ${JAVASCRIPTCORE_LIBRARY}
            PRIVATE NativeCamera)
    set(RESOURCE_FILES ${STORYBOARD})
elseif (UNIX)
    set(SOURCES
            ${SOURCES}
            "X11/App.cpp")
elseif (WINDOWS_STORE)
    set(APPX_FILES "UWP/Package.appxmanifest" "UWP/TemporaryKey.pfx")
    set_property(SOURCE ${APPX_FILES} PROPERTY VS_DEPLOYMENT_CONTENT 1)
    set(APPX_ASSETS
            "UWP/Assets/LockScreenLogo.scale-200.png"
            "UWP/Assets/SplashScreen.scale-200.png"
            "UWP/Assets/Square44x44Logo.scale-200.png"
            "UWP/Assets/Square44x44Logo.targetsize-24_altform-unplated.png"
            "UWP/Assets/Square150x150Logo.scale-200.png"
            "UWP/Assets/StoreLogo.png"
            "UWP/Assets/Wide310x150Logo.scale-200.png")
    set_property(SOURCE ${APPX_ASSETS} PROPERTY VS_DEPLOYMENT_CONTENT 1)
    set_property(SOURCE ${APPX_ASSETS} PROPERTY VS_DEPLOYMENT_LOCATION "Assets")
    set(SOURCES
            ${SOURCES}
            ${APPX_FILES}
            ${APPX_ASSETS}
            "UWP/App.cpp"
            "UWP/App.h")
    set(ADDITIONAL_LIBRARIES PRIVATE NativeXr)
elseif (WIN32)
    set(SOURCES
            ${SOURCES}
            "Win32/App.cpp"
            "Win32/App.h"
            "Win32/App.ico"
            "Win32/App.rc"
            "Win32/Resource.h"
            "Win32/small.ico"
            "Win32/targetver.h"
            Win32/Babylon/AppRuntime.h
            Win32/Babylon/Dispatchable.h
            Win32/Babylon/JsRuntime.h
            Win32/Babylon/JsRuntimeScheduler.h
            Win32/Babylon/ScriptLoader.h
            Win32/Babylon/Graphics/Device.h
            Win32/Babylon/Graphics/Platform.h
            Win32/Babylon/Graphics/RendererType.h
            Win32/Babylon/Plugins/ExternalTexture.h
            Win32/Babylon/Plugins/NativeCamera.h
            Win32/Babylon/Plugins/NativeCapture.h
            Win32/Babylon/Plugins/NativeEngine.h
            Win32/Babylon/Plugins/NativeInput.h
            Win32/Babylon/Plugins/NativeOptimizations.h
            Win32/Babylon/Plugins/NativeTracing.h
            Win32/Babylon/Plugins/NativeXr.h
            Win32/Babylon/Polyfills/Canvas.h
            Win32/Babylon/Polyfills/Console.h
            Win32/Babylon/Polyfills/Window.h
            Win32/Babylon/Polyfills/XMLHttpRequest.h
            Win32/napi/env.h
            Win32/napi/js_native_api.h
            Win32/napi/js_native_api_types.h
            Win32/napi/napi.h
            Win32/napi/napi-inl.h
            Win32/js_native_api.h
            Win32/js_native_api_types.h
            Win32/node.h
            Win32/node_api.h
            Win32/node_api_types.h
            Win32/node_buffer.h
            Win32/node_object_wrap.h
            Win32/node_version.h
            Win32/uv.h
            Win32/v8.h
            Win32/v8-array-buffer.h
            Win32/v8-callbacks.h
            Win32/v8-container.h
            Win32/v8-context.h
            Win32/v8-cppgc.h
            Win32/v8-data.h
            Win32/v8-date.h
            Win32/v8-debug.h
            Win32/v8-embedder-heap.h
            Win32/v8-embedder-state-scope.h
            Win32/v8-exception.h
            Win32/v8-extension.h
            Win32/v8-external.h
            Win32/v8-forward.h
            Win32/v8-function.h
            Win32/v8-function-callback.h
            Win32/v8-initialization.h
            Win32/v8-internal.h
            Win32/v8-isolate.h
            Win32/v8-json.h
            Win32/v8-local-handle.h
            Win32/v8-locker.h
            Win32/v8-maybe.h
            Win32/v8-memory-span.h
            Win32/v8-message.h
            Win32/v8-microtask.h
            Win32/v8-microtask-queue.h
            Win32/v8-object.h
            Win32/v8-persistent-handle.h
            Win32/v8-platform.h
            Win32/v8-primitive.h
            Win32/v8-primitive-object.h
            Win32/v8-profiler.h
            Win32/v8-promise.h
            Win32/v8-proxy.h
            Win32/v8-regexp.h
            Win32/v8-script.h
            Win32/v8-snapshot.h
            Win32/v8-statistics.h
            Win32/v8-template.h
            Win32/v8-traced-handle.h
            Win32/v8-typed-array.h
            Win32/v8-unwinder.h
            Win32/v8-value.h
            Win32/v8-value-serializer.h
            Win32/v8-version.h
            Win32/v8-wasm.h
            Win32/v8-weak-callback-info.h
            Win32/v8config.h
            Win32/zconf.h
            Win32/zlib.h
            Win32/uv/aix.h
            Win32/uv/bsd.h
            Win32/uv/darwin.h
            Win32/uv/errno.h
            Win32/uv/linux.h
            Win32/uv/os390.h
            Win32/uv/posix.h
            Win32/uv/sunos.h
            Win32/uv/threadpool.h
            Win32/uv/tree.h
            Win32/uv/unix.h
            Win32/uv/version.h
            Win32/uv/win.h
            Win32/openssl/aes.h
            Win32/openssl/asn1.h
            Win32/openssl/asn1_asm.h
            Win32/openssl/asn1_mac.h
            Win32/openssl/asn1_no-asm.h
            Win32/openssl/asn1err.h
            Win32/openssl/asn1t.h
            Win32/openssl/asn1t_asm.h
            Win32/openssl/asn1t_no-asm.h
            Win32/openssl/async.h
            Win32/openssl/asyncerr.h
            Win32/openssl/bio.h
            Win32/openssl/bio_asm.h
            Win32/openssl/bio_no-asm.h
            Win32/openssl/bioerr.h
            Win32/openssl/blowfish.h
            Win32/openssl/bn.h
            Win32/openssl/bn_conf.h
            Win32/openssl/bn_conf_asm.h
            Win32/openssl/bn_conf_no-asm.h
            Win32/openssl/bnerr.h
            Win32/openssl/buffer.h
            Win32/openssl/buffererr.h
            Win32/openssl/camellia.h
            Win32/openssl/cast.h
            Win32/openssl/cmac.h
            Win32/openssl/cmp.h
            Win32/openssl/cmp_asm.h
            Win32/openssl/cmp_no-asm.h
            Win32/openssl/cmp_util.h
            Win32/openssl/cmperr.h
            Win32/openssl/cms.h
            Win32/openssl/cms_asm.h
            Win32/openssl/cms_no-asm.h
            Win32/openssl/cmserr.h
            Win32/openssl/comp.h
            Win32/openssl/comperr.h
            Win32/openssl/conf.h
            Win32/openssl/conf_api.h
            Win32/openssl/conf_asm.h
            Win32/openssl/conf_no-asm.h
            Win32/openssl/conferr.h
            Win32/openssl/configuration.h
            Win32/openssl/configuration_asm.h
            Win32/openssl/configuration_no-asm.h
            Win32/openssl/conftypes.h
            Win32/openssl/core.h
            Win32/openssl/core_dispatch.h
            Win32/openssl/core_names.h
            Win32/openssl/core_object.h
            Win32/openssl/crmf.h
            Win32/openssl/crmf_asm.h
            Win32/openssl/crmf_no-asm.h
            Win32/openssl/crmferr.h
            Win32/openssl/crypto.h
            Win32/openssl/crypto_asm.h
            Win32/openssl/crypto_no-asm.h
            Win32/openssl/cryptoerr.h
            Win32/openssl/cryptoerr_legacy.h
            Win32/openssl/ct.h
            Win32/openssl/ct_asm.h
            Win32/openssl/ct_no-asm.h
            Win32/openssl/cterr.h
            Win32/openssl/decoder.h
            Win32/openssl/decodererr.h
            Win32/openssl/des.h
            Win32/openssl/dh.h
            Win32/openssl/dherr.h
            Win32/openssl/dsa.h
            Win32/openssl/dsaerr.h
            Win32/openssl/dso_conf.h
            Win32/openssl/dso_conf_asm.h
            Win32/openssl/dso_conf_no-asm.h
            Win32/openssl/dtls1.h
            Win32/openssl/e_os2.h
            Win32/openssl/ebcdic.h
            Win32/openssl/ec.h
            Win32/openssl/ecdh.h
            Win32/openssl/ecdsa.h
            Win32/openssl/ecerr.h
            Win32/openssl/encoder.h
            Win32/openssl/encodererr.h
            Win32/openssl/engine.h
            Win32/openssl/engineerr.h
            Win32/openssl/err.h
            Win32/openssl/err_asm.h
            Win32/openssl/err_no-asm.h
            Win32/openssl/ess.h
            Win32/openssl/ess_asm.h
            Win32/openssl/ess_no-asm.h
            Win32/openssl/esserr.h
            Win32/openssl/evp.h
            Win32/openssl/evperr.h
            Win32/openssl/fips_names.h
            Win32/openssl/fipskey.h
            Win32/openssl/fipskey_asm.h
            Win32/openssl/fipskey_no-asm.h
            Win32/openssl/hmac.h
            Win32/openssl/http.h
            Win32/openssl/httperr.h
            Win32/openssl/idea.h
            Win32/openssl/kdf.h
            Win32/openssl/kdferr.h
            Win32/openssl/lhash.h
            Win32/openssl/lhash_asm.h
            Win32/openssl/lhash_no-asm.h
            Win32/openssl/macros.h
            Win32/openssl/md2.h
            Win32/openssl/md4.h
            Win32/openssl/md5.h
            Win32/openssl/mdc2.h
            Win32/openssl/modes.h
            Win32/openssl/obj_mac.h
            Win32/openssl/objects.h
            Win32/openssl/objectserr.h
            Win32/openssl/ocsp.h
            Win32/openssl/ocsp_asm.h
            Win32/openssl/ocsp_no-asm.h
            Win32/openssl/ocsperr.h
            Win32/openssl/opensslconf.h
            Win32/openssl/opensslconf_asm.h
            Win32/openssl/opensslv.h
            Win32/openssl/opensslv_asm.h
            Win32/openssl/opensslv_no-asm.h
            Win32/openssl/ossl_typ.h
            Win32/openssl/param_build.h
            Win32/openssl/params.h
            Win32/openssl/pem.h
            Win32/openssl/pem2.h
            Win32/openssl/pemerr.h
            Win32/openssl/pkcs7.h
            Win32/openssl/pkcs7_asm.h
            Win32/openssl/pkcs7_no-asm.h
            Win32/openssl/pkcs7err.h
            Win32/openssl/pkcs12.h
            Win32/openssl/pkcs12_asm.h
            Win32/openssl/pkcs12_no-asm.h
            Win32/openssl/pkcs12err.h
            Win32/openssl/prov_ssl.h
            Win32/openssl/proverr.h
            Win32/openssl/provider.h
            Win32/openssl/quic.h
            Win32/openssl/rand.h
            Win32/openssl/randerr.h
            Win32/openssl/rc2.h
            Win32/openssl/rc4.h
            Win32/openssl/rc5.h
            Win32/openssl/ripemd.h
            Win32/openssl/rsa.h
            Win32/openssl/rsaerr.h
            Win32/openssl/safestack.h
            Win32/openssl/safestack_asm.h
            Win32/openssl/safestack_no-asm.h
            Win32/openssl/seed.h
            Win32/openssl/self_test.h
            Win32/openssl/sha.h
            Win32/openssl/srp.h
            Win32/openssl/srp_asm.h
            Win32/openssl/srp_no-asm.h
            Win32/openssl/srtp.h
            Win32/openssl/ssl.h
            Win32/openssl/ssl2.h
            Win32/openssl/ssl3.h
            Win32/openssl/ssl_asm.h
            Win32/openssl/ssl_no-asm.h
            Win32/openssl/sslerr.h
            Win32/openssl/sslerr_legacy.h
            Win32/openssl/stack.h
            Win32/openssl/store.h
            Win32/openssl/storeerr.h
            Win32/openssl/symhacks.h
            Win32/openssl/tls1.h
            Win32/openssl/trace.h
            Win32/openssl/ts.h
            Win32/openssl/tserr.h
            Win32/openssl/txt_db.h
            Win32/openssl/types.h
            Win32/openssl/ui.h
            Win32/openssl/ui_asm.h
            Win32/openssl/ui_no-asm.h
            Win32/openssl/uierr.h
            Win32/openssl/whrlpool.h
            Win32/openssl/x509.h
            Win32/openssl/x509_asm.h
            Win32/openssl/x509_no-asm.h
            Win32/openssl/x509_vfy.h
            Win32/openssl/x509_vfy_asm.h
            Win32/openssl/x509_vfy_no-asm.h
            Win32/openssl/x509err.h
            Win32/openssl/x509v3.h
            Win32/openssl/x509v3_asm.h
            Win32/openssl/x509v3_no-asm.h
            Win32/openssl/x509v3err.h
            Win32/openssl/archs/VC-WIN64A/asm/crypto/buildinf.h
            Win32/openssl/archs/VC-WIN64A/asm/include/crypto/bn_conf.h
            Win32/openssl/archs/VC-WIN64A/asm/include/crypto/dso_conf.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/asn1.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/asn1t.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/bio.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/cmp.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/cms.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/conf.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/configuration.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/crmf.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/crypto.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/ct.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/err.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/ess.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/fipskey.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/lhash.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/ocsp.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/opensslv.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/pkcs7.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/pkcs12.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/safestack.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/srp.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/ssl.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/ui.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/x509.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/x509_vfy.h
            Win32/openssl/archs/VC-WIN64A/asm/include/openssl/x509v3.h
            Win32/openssl/archs/VC-WIN64A/asm/include/progs.h
            Win32/openssl/archs/VC-WIN64A/asm/providers/common/include/prov/der_digests.h
            Win32/openssl/archs/VC-WIN64A/asm/providers/common/include/prov/der_dsa.h
            Win32/openssl/archs/VC-WIN64A/asm/providers/common/include/prov/der_ec.h
            Win32/openssl/archs/VC-WIN64A/asm/providers/common/include/prov/der_ecx.h
            Win32/openssl/archs/VC-WIN64A/asm/providers/common/include/prov/der_rsa.h
            Win32/openssl/archs/VC-WIN64A/asm/providers/common/include/prov/der_sm2.h
            Win32/openssl/archs/VC-WIN64A/asm/providers/common/include/prov/der_wrap.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/crypto/buildinf.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/crypto/bn_conf.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/crypto/dso_conf.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/asn1.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/asn1t.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/bio.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/cmp.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/cms.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/conf.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/configuration.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/crmf.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/crypto.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/ct.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/err.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/ess.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/fipskey.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/lhash.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/ocsp.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/opensslv.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/pkcs7.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/pkcs12.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/safestack.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/srp.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/ssl.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/ui.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/x509.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/x509_vfy.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/openssl/x509v3.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/include/progs.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/providers/common/include/prov/der_digests.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/providers/common/include/prov/der_dsa.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/providers/common/include/prov/der_ec.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/providers/common/include/prov/der_ecx.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/providers/common/include/prov/der_rsa.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/providers/common/include/prov/der_sm2.h
            Win32/openssl/archs/VC-WIN64A/asm_avx2/providers/common/include/prov/der_wrap.h
            Win32/openssl/archs/VC-WIN64A/no-asm/crypto/buildinf.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/crypto/bn_conf.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/crypto/dso_conf.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/asn1.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/asn1t.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/bio.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/cmp.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/cms.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/conf.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/configuration.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/crmf.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/crypto.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/ct.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/err.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/ess.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/fipskey.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/lhash.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/ocsp.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/opensslv.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/pkcs7.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/pkcs12.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/safestack.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/srp.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/ssl.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/ui.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/x509.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/x509_vfy.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/openssl/x509v3.h
            Win32/openssl/archs/VC-WIN64A/no-asm/include/progs.h
            Win32/openssl/archs/VC-WIN64A/no-asm/providers/common/include/prov/der_digests.h
            Win32/openssl/archs/VC-WIN64A/no-asm/providers/common/include/prov/der_dsa.h
            Win32/openssl/archs/VC-WIN64A/no-asm/providers/common/include/prov/der_ec.h
            Win32/openssl/archs/VC-WIN64A/no-asm/providers/common/include/prov/der_ecx.h
            Win32/openssl/archs/VC-WIN64A/no-asm/providers/common/include/prov/der_rsa.h
            Win32/openssl/archs/VC-WIN64A/no-asm/providers/common/include/prov/der_sm2.h
            Win32/openssl/archs/VC-WIN64A/no-asm/providers/common/include/prov/der_wrap.h
    )
    set(ADDITIONAL_LIBRARIES PRIVATE NativeXr NativeCamera)
endif ()

if (WIN32)
    set(WIN32_EXECUTABLE TRUE)
    link_directories(BEFORE Win32-lib)
    add_executable(Game3D WIN32 ${SCRIPTS} ${SOURCES} ${RESOURCE_FILES})
else ()
    add_executable(Game3D ${SCRIPTS} ${SOURCES} ${RESOURCE_FILES})
endif ()

target_compile_definitions(Game3D PRIVATE UNICODE)
target_compile_definitions(Game3D PRIVATE _UNICODE)

if (WINDOWS_STORE)
    target_compile_options(Game3D PRIVATE /ZW)
    target_compile_options(Game3D PRIVATE /await)
endif ()

target_include_directories(Game3D PRIVATE "Source" ".")

target_link_libraries(Game3D
        PRIVATE AppRuntime
        PRIVATE Canvas
        PRIVATE Console
        PRIVATE ExternalTexture
        PRIVATE GraphicsDevice
        PRIVATE NativeCapture
        PRIVATE NativeEngine
        PRIVATE NativeInput
        PRIVATE NativeOptimizations
        PRIVATE ScriptLoader
        PRIVATE Window
        PRIVATE XMLHttpRequest
        PRIVATE TestUtils
        ${ADDITIONAL_LIBRARIES})

# See https://gitlab.kitware.com/cmake/cmake/-/issues/23543
# If we can set minimum required to 3.26+, then we can use the `copy -t` syntax instead.
add_custom_command(TARGET Game3D POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E $<IF:$<BOOL:$<TARGET_RUNTIME_DLLS:Game3D>>,copy,true> $<TARGET_RUNTIME_DLLS:Game3D> $<TARGET_FILE_DIR:Game3D> COMMAND_EXPAND_LISTS)

if (UNIX AND NOT APPLE AND NOT ANDROID)
    # Ubuntu mixes old experimental header and new runtime libraries
    # Resulting in crash at runtime for std::filesystem
    # https://stackoverflow.com/questions/56738708/c-stdbad-alloc-on-stdfilesystempath-append
    target_link_libraries(Game3D
            PRIVATE stdc++fs)
endif ()

if (APPLE)
    if (IOS)
        set_target_properties(Game3D PROPERTIES
                MACOSX_BUNDLE true
                MACOSX_BUNDLE_INFO_PLIST "${PLIST_FILE}"
                XCODE_ATTRIBUTE_CLANG_ENABLE_OBJC_ARC YES
                RESOURCE "${RESOURCE_FILES}"

                XCODE_ATTRIBUTE_IPHONEOS_DEPLOYMENT_TARGET ${DEPLOYMENT_TARGET}
                XCODE_ATTRIBUTE_PRODUCT_BUNDLE_IDENTIFIER "io.github.codetoil.game3d.iOS"

                XCODE_ATTRIBUTE_SWIFT_VERSION "4.0"
                XCODE_ATTRIBUTE_SWIFT_OBJC_BRIDGING_HEADER "${CMAKE_CURRENT_LIST_DIR}/iOS/LibNativeBridge.h"
                XCODE_ATTRIBUTE_LD_RUNPATH_SEARCH_PATHS "@executable_path/Frameworks"
                XCODE_ATTRIBUTE_ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES YES

                # CMake seems to add a custom flag "-Wno-unknown-pragmas" to the Swift compiler. That flag is used for Clang,
                # So we need to make sure we override it with nothing here in order to compile Swift.
                XCODE_ATTRIBUTE_OTHER_SWIFT_FLAGS "")

        # Swift support
        set(CMAKE_Swift_COMPILER_FORCED TRUE)
        set(CMAKE_Swift_LANGUAGE_VERSION 4.0)
        enable_language(Swift)
    else ()
        target_link_libraries(Game3D PUBLIC "-framework MetalKit")

        set_target_properties(Game3D PROPERTIES
                MACOSX_BUNDLE true
                MACOSX_BUNDLE_INFO_PLIST "${PLIST_FILE}"
                XCODE_ATTRIBUTE_CLANG_ENABLE_OBJC_ARC YES
                RESOURCE "${RESOURCE_FILES}"
                FOLDER "Game3D")
    endif ()
    set_property(TARGET Game3D PROPERTY UNITY_BUILD false)
endif ()

if (WINDOWS_STORE)
    set_property(SOURCE ${SCRIPTS} PROPERTY VS_DEPLOYMENT_CONTENT 1)
    set_property(SOURCE ${SCRIPTS} PROPERTY VS_DEPLOYMENT_LOCATION "Scripts")
    set_property(SOURCE ${REFERENCE_IMAGES} PROPERTY VS_DEPLOYMENT_LOCATION "ReferenceImages")
else ()
    foreach (SCRIPT ${SCRIPTS})
        get_filename_component(SCRIPT_NAME "${SCRIPT}" NAME)
        add_custom_command(
                OUTPUT "${CMAKE_CFG_INTDIR}/Scripts/${SCRIPT_NAME}"
                COMMAND "${CMAKE_COMMAND}" -E copy "${CMAKE_CURRENT_SOURCE_DIR}/${SCRIPT}" "${CMAKE_CURRENT_BINARY_DIR}/${CMAKE_CFG_INTDIR}/Scripts/${SCRIPT_NAME}"
                COMMENT "Copying ${SCRIPT_NAME}"
                MAIN_DEPENDENCY "${CMAKE_CURRENT_SOURCE_DIR}/${SCRIPT}")
    endforeach ()
    foreach (IMAGE ${REFERENCE_IMAGES})
        get_filename_component(IMAGE_NAME "${IMAGE}" NAME)
        add_custom_command(
                OUTPUT "${CMAKE_CFG_INTDIR}/ReferenceImages/${IMAGE_NAME}"
                COMMAND "${CMAKE_COMMAND}" -E copy "${CMAKE_CURRENT_SOURCE_DIR}/${IMAGE}" "${CMAKE_CURRENT_BINARY_DIR}/${CMAKE_CFG_INTDIR}/ReferenceImages/${IMAGE_NAME}"
                COMMENT "Copying ${IMAGE_NAME}"
                MAIN_DEPENDENCY "${CMAKE_CURRENT_SOURCE_DIR}/${IMAGE}")
    endforeach ()
endif ()

set_property(TARGET Game3D PROPERTY FOLDER Apps)
source_group(TREE ${CMAKE_CURRENT_SOURCE_DIR} FILES ${SCRIPTS})
source_group(TREE ${CMAKE_CURRENT_SOURCE_DIR} FILES ${SOURCES})
set_property(DIRECTORY ${CMAKE_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT Game3D)

set_property(TARGET Game3D PROPERTY CXX_STANDARD 17)
