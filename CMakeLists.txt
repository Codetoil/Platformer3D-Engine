cmake_minimum_required(VERSION 3.21)
project(Game3D)

add_subdirectory(native/BabylonNative)

set(SCRIPTS
        "dist-native/assets/client-C5D_gxjW.js")

if (UNIX)
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

if (UNIX AND NOT native/Android)
    # Ubuntu mixes old experimental header and new runtime libraries
    # Resulting in crash at runtime for std::filesystem
    # https://stackoverflow.com/questions/56738708/c-stdbad-alloc-on-stdfilesystempath-append
    target_link_libraries(Game3D
            PRIVATE stdc++fs)
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
