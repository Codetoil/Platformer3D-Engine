cmake_minimum_required(VERSION 3.21)
project(Game3D)

if (WIN32)
    set(NAPI_JAVASCRIPT_ENGINE V8)
endif ()

add_subdirectory(native/BabylonNative)

set(BABYLON_SCRIPTS
    "node_modules/babylonjs-loaders/babylonjs.loaders.js"
    "node_modules/babylonjs/babylon.max.js"
    "node_modules/babylonjs-materials/babylonjs.materials.js"
    "node_modules/babylonjs-gui/babylon.gui.js")

set(RESOURCES
        "public/assets/about.txt"
        "public/assets/android-chrome-192x192.png"
        "public/assets/android-chrome-512x512.png"
        "public/assets/android-chrome-1024x1024.png"
        "public/assets/apple-touch-icon.png"
        "public/assets/crate.png"
        "public/assets/favicon-16x16.png"
        "public/assets/favicon-32x32.png"
        "public/assets/favicon.ico"
        "public/assets/LICENSE"
        "public/assets/site.webmanifest"
        "public/assets/temp_player.png")

if(APPLE)
    set(SCRIPTS
            ${SCRIPTS}
            "dist-native-apple/client.js")
    find_library(JAVASCRIPTCORE_LIBRARY JavaScriptCore)
    if(IOS)
        set(PLIST_FILE	
            "${CMAKE_CURRENT_LIST_DIR}/native/iOS/Info.plist")
        set(STORYBOARD
            "${CMAKE_CURRENT_LIST_DIR}/native/iOS/Base.lproj/Main.storyboard"
            "${CMAKE_CURRENT_LIST_DIR}/native/iOS/Base.lproj/LaunchScreen.storyboard")
        set(RESOURCE_FILES ${STORYBOARD} ${SCRIPTS} ${RESOURCES})
        set(ADDITIONAL_LIBRARIES PRIVATE z NativeXr)
        set(SOURCES
            ${SOURCES}
            "native/iOS/AppDelegate.swift"
            "native/iOS/ViewController.swift"
            "native/iOS/LibNativeBridge.h"
            "native/iOS/LibNativeBridge.mm")
        set_source_files_properties(${SCRIPTS} ${BABYLON_SCRIPTS} PROPERTIES MACOSX_PACKAGE_LOCATION "Scripts")
    else()
        set(PLIST_FILE "${CMAKE_CURRENT_LIST_DIR}/native/macOS/Info.plist")
        set(STORYBOARD "${CMAKE_CURRENT_LIST_DIR}/native/macOS/Base.lproj/Main.storyboard")
        set(RESOURCE_FILES ${STORYBOARD} ${RESOURCES})
        set(SOURCES
            ${SOURCES}
            "native/macOS/main.m"
            "native/macOS/AppDelegate.m"
            "native/macOS/AppDelegate.h"
            "native/macOS/ViewController.mm"
            "native/macOS/ViewController.h")
        set_source_files_properties(${SCRIPTS} ${BABYLON_SCRIPTS} PROPERTIES MACOSX_PACKAGE_LOCATION "Resources/Scripts")
    endif()
    set(ADDITIONAL_LIBRARIES ${ADDITIONAL_LIBRARIES}
        PRIVATE ${JAVASCRIPTCORE_LIBRARY}
        PRIVATE NativeCamera)
    set(RESOURCE_FILES ${STORYBOARD} ${RESOURCES})
elseif(UNIX)
    set(SOURCES
            ${SOURCES}
            "native/X11/App.cpp")
elseif (WINDOWS_STORE)
    set(APPX_FILES "native/UWP/Package.appxmanifest" "native/UWP/TemporaryKey.pfx")
    set_property(SOURCE ${APPX_FILES} PROPERTY VS_DEPLOYMENT_CONTENT 1)
    set(APPX_ASSETS
            "native/UWP/Assets/LockScreenLogo.scale-200.png"
            "native/UWP/Assets/SplashScreen.scale-200.png"
            "native/UWP/Assets/Square44x44Logo.scale-200.png"
            "native/UWP/Assets/Square44x44Logo.targetsize-24_altform-unplated.png"
            "native/UWP/Assets/Square150x150Logo.scale-200.png"
            "native/UWP/Assets/StoreLogo.png"
            "native/UWP/Assets/Wide310x150Logo.scale-200.png")
    set_property(SOURCE ${APPX_ASSETS} PROPERTY VS_DEPLOYMENT_CONTENT 1)
    set_property(SOURCE ${APPX_ASSETS} PROPERTY VS_DEPLOYMENT_LOCATION "Assets")
    set(SOURCES
            ${SOURCES}
            ${APPX_FILES}
            ${APPX_ASSETS}
            "native/UWP/App.cpp"
            "native/UWP/App.h")
    set(ADDITIONAL_LIBRARIES PRIVATE NativeXr)
elseif (WIN32)
    set(SOURCES
            ${SOURCES}
            "native/Win32/App.cpp"
            "native/Win32/App.h"
            "native/Win32/App.ico"
            "native/Win32/App.rc"
            "native/Win32/Resource.h"
            "native/Win32/small.ico"
            "native/Win32/targetver.h"
    )
    set(ADDITIONAL_LIBRARIES PRIVATE NativeXr NativeCamera)
endif ()

if (WIN32)
    set(WIN32_EXECUTABLE TRUE)
    add_executable(Game3D WIN32 ${BABYLON_SCRIPTS} ${SCRIPTS} ${SOURCES} ${RESOURCE_FILES})
else ()
    add_executable(Game3D ${BABYLON_SCRIPTS} ${SCRIPTS} ${SOURCES} ${RESOURCE_FILES})
endif ()

target_compile_definitions(Game3D PRIVATE UNICODE)
target_compile_definitions(Game3D PRIVATE _UNICODE)

if (WINDOWS_STORE)
    target_compile_options(Game3D PRIVATE /ZW)
    target_compile_options(Game3D PRIVATE /await)
endif ()

target_include_directories(Game3D PRIVATE "dist-native" "native")

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

if(APPLE)
    if(IOS)
        set_target_properties(Game3D PROPERTIES
            MACOSX_BUNDLE true
            MACOSX_BUNDLE_INFO_PLIST "${PLIST_FILE}"
            XCODE_ATTRIBUTE_CLANG_ENABLE_OBJC_ARC YES
            RESOURCE "${RESOURCE_FILES}"

            XCODE_ATTRIBUTE_IPHONEOS_DEPLOYMENT_TARGET ${DEPLOYMENT_TARGET}
            XCODE_ATTRIBUTE_PRODUCT_BUNDLE_IDENTIFIER "io.github.codetoil.Game3D.iOS"

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
    else()
        target_link_libraries(Game3D PUBLIC "-framework MetalKit")

        set_target_properties(Game3D PROPERTIES
            MACOSX_BUNDLE true
            MACOSX_BUNDLE_INFO_PLIST "${PLIST_FILE}"
            XCODE_ATTRIBUTE_CLANG_ENABLE_OBJC_ARC YES
            RESOURCE "${RESOURCE_FILES}"
            FOLDER "Game3D")
    endif()
    set_property(TARGET Game3D PROPERTY UNITY_BUILD false)
endif()

if (WINDOWS_STORE)
    set_property(SOURCE ${SCRIPTS} ${BABYLON_SCRIPTS} PROPERTY VS_DEPLOYMENT_CONTENT 1)
    set_property(SOURCE ${SCRIPTS} ${BABYLON_SCRIPTS} PROPERTY VS_DEPLOYMENT_LOCATION "Scripts")
    set_property(SOURCE ${REFERENCE_IMAGES} PROPERTY VS_DEPLOYMENT_LOCATION "ReferenceImages")
else ()
    foreach (SCRIPT ${SCRIPTS} ${BABYLON_SCRIPTS})
        get_filename_component(SCRIPT_NAME "${SCRIPT}" NAME)
        add_custom_command(
                OUTPUT "${CMAKE_CFG_INTDIR}/Scripts/${SCRIPT_NAME}"
                COMMAND "${CMAKE_COMMAND}" -E copy "${CMAKE_CURRENT_SOURCE_DIR}/${SCRIPT}" "${CMAKE_CURRENT_BINARY_DIR}/${CMAKE_CFG_INTDIR}/Scripts/${SCRIPT_NAME}"
                COMMENT "Copying ${SCRIPT_NAME}"
                MAIN_DEPENDENCY "${CMAKE_CURRENT_SOURCE_DIR}/${SCRIPT}")
    endforeach ()
endif ()

set_property(TARGET Game3D PROPERTY FOLDER Apps)
source_group(TREE ${CMAKE_CURRENT_SOURCE_DIR} FILES ${BABYLON_SCRIPTS})
source_group(TREE ${CMAKE_CURRENT_SOURCE_DIR} FILES ${SCRIPTS})
source_group(TREE ${CMAKE_CURRENT_SOURCE_DIR} FILES ${SOURCES})
set_property(DIRECTORY ${CMAKE_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT Game3D)

set_property(TARGET Game3D PROPERTY CXX_STANDARD 17)
