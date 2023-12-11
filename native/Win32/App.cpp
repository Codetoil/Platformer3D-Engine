/**
 *  Game3D, a 3D Platformer built for the web.
 *  Copyright (C) 2021-2023  Codetoil
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

#include "App.h"

#include <Windows.h>
#include <Windowsx.h>
#include <Shlwapi.h>
#include <filesystem>
#include <cstdio>
#include <optional>
#include <cassert>

#include "Babylon/AppRuntime.h"
#include "Babylon/Graphics/Device.h"
#include "Babylon/ScriptLoader.h"
#include "Babylon/Plugins/NativeCapture.h"
#include "Babylon/Plugins/NativeEngine.h"
#include "Babylon/Plugins/NativeOptimizations.h"
#include "Babylon/Plugins/NativeXr.h"
#include "Babylon/Plugins/NativeCamera.h"
#include "Babylon/Plugins/NativeInput.h"
#include <Babylon/Plugins/TestUtils.h>
#include "Babylon/Polyfills/Console.h"
#include "Babylon/Polyfills/Window.h"
#include "Babylon/Polyfills/XMLHttpRequest.h"
#include "Babylon/Polyfills/Canvas.h"

#include "Extensions/ChromeDevTools.h"

#define MAX_LOADSTRING 100

// Global Variables:
HINSTANCE hInst;                     // current instance
WCHAR szTitle[MAX_LOADSTRING];       // The title bar text
WCHAR szWindowClass[MAX_LOADSTRING]; // the main window class name
std::optional<Babylon::AppRuntime> runtime{};
std::optional<Babylon::Graphics::Device> device{};
std::optional<Babylon::Graphics::DeviceUpdate> update{};
Babylon::Plugins::NativeInput* nativeInput{};
std::optional<ChromeDevTools> chromeDevTools{};
std::optional<Babylon::Polyfills::Canvas> nativeCanvas{};
bool minimized{false};
int buttonRefCount{0};

class path;

class path;

// Forward declarations of functions included in this code module:
ATOM MyRegisterClass(HINSTANCE hInstance);
BOOL InitInstance(HINSTANCE, int);
LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);
INT_PTR CALLBACK About(HWND, UINT, WPARAM, LPARAM);

namespace
{
    void Uninitialize()
    {
        if (device)
        {
            update->Finish();
            device->FinishRenderingCurrentFrame();
        }

        nativeCanvas.reset();
        chromeDevTools.reset();
        nativeInput = {};
        runtime.reset();
        update.reset();
        device.reset();
    }

    void RefreshBabylon(HWND hWnd)
    {
        Uninitialize();

        RECT rect;
        if (!GetClientRect(hWnd, &rect))
        {
            return;
        }

        const auto width = static_cast<size_t>(rect.right - rect.left);
        const auto height = static_cast<size_t>(rect.bottom - rect.top);

        Babylon::Graphics::Configuration graphicsConfig{};
        graphicsConfig.Window = hWnd;
        graphicsConfig.Width = width;
        graphicsConfig.Height = height;
        graphicsConfig.MSAASamples = 4;

        device.emplace(graphicsConfig);
        update.emplace(device->GetUpdate("update"));

        device->StartRenderingCurrentFrame();
        update->Start();

        runtime.emplace();

        runtime->Dispatch([hWnd](Napi::Env env) {
            device->AddToJavaScript(env);

            Babylon::Polyfills::Console::Initialize(env, [](const char* message, auto) {
                OutputDebugStringA(message);

                printf("%s", message);
                fflush(stdout);
            });

            Babylon::Polyfills::Window::Initialize(env);

            Babylon::Polyfills::XMLHttpRequest::Initialize(env);

            nativeCanvas.emplace(Babylon::Polyfills::Canvas::Initialize(env));

            Babylon::Plugins::NativeEngine::Initialize(env);

            Babylon::Plugins::NativeOptimizations::Initialize(env);

            Babylon::Plugins::NativeCapture::Initialize(env);

            Babylon::Plugins::NativeCamera::Initialize(env);

            Babylon::Plugins::NativeXr::Initialize(env);

            nativeInput = &Babylon::Plugins::NativeInput::CreateForJavaScript(env);

            chromeDevTools.emplace(ChromeDevTools::Initialize(env));
            if (chromeDevTools->SupportsInspector())
            {
                chromeDevTools->StartInspector(5643, "Game3D Native");
            }
            Babylon::Plugins::TestUtils::Initialize(env, hWnd);
        });

        Babylon::ScriptLoader loader{*runtime};

        loader.LoadScript("app:///Scripts/client-esYu3IGp.js");
    }

    void UpdateWindowSize(const size_t width, const size_t height)
    {
        device->UpdateSize(width, height);
    }
}

int APIENTRY wWinMain(_In_ HINSTANCE hInstance,
    _In_opt_ HINSTANCE hPrevInstance,
    _In_ LPWSTR lpCmdLine,
    _In_ int nCmdShow)
{
    UNREFERENCED_PARAMETER(hPrevInstance);
    UNREFERENCED_PARAMETER(lpCmdLine);

    // Initialize global strings
    LoadStringW(hInstance, IDS_APP_TITLE, szTitle, MAX_LOADSTRING);
    LoadStringW(hInstance, IDC_GAME3DWIN32, szWindowClass, MAX_LOADSTRING);
    MyRegisterClass(hInstance);

    // Perform application initialization:
    if (!InitInstance(hInstance, nCmdShow))
    {
        return FALSE;
    }

    HACCEL hAccelTable = LoadAccelerators(hInstance, MAKEINTRESOURCE(IDC_GAME3DWIN32));

    MSG msg{};

    // Main message loop:
    while (msg.message != WM_QUIT)
    {
        BOOL result;

        if (minimized)
        {
            result = GetMessage(&msg, nullptr, 0, 0);
        }
        else
        {
            if (device)
            {
                update->Finish();
                device->FinishRenderingCurrentFrame();
                device->StartRenderingCurrentFrame();
                update->Start();
            }

            result = PeekMessage(&msg, nullptr, 0, 0, PM_REMOVE) && msg.message != WM_QUIT;
        }

        if (result)
        {
            if (!TranslateAccelerator(msg.hwnd, hAccelTable, &msg))
            {
                TranslateMessage(&msg);
                DispatchMessage(&msg);
            }
        }
    }

    return static_cast<int>(msg.wParam);
}

//
//  FUNCTION: MyRegisterClass()
//
//  PURPOSE: Registers the window class.
//
ATOM MyRegisterClass(HINSTANCE hInstance)
{
    WNDCLASSEXW wcex;

    wcex.cbSize = sizeof(WNDCLASSEX);

    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = WndProc;
    wcex.cbClsExtra = 0;
    wcex.cbWndExtra = 0;
    wcex.hInstance = hInstance;
    wcex.hIcon = LoadIcon(hInstance, MAKEINTRESOURCE(IDC_GAME3DWIN32));
    wcex.hCursor = LoadCursor(nullptr, IDC_ARROW);
    wcex.hbrBackground = reinterpret_cast<HBRUSH>(COLOR_WINDOW + 1);
    wcex.lpszMenuName = MAKEINTRESOURCEW(IDC_GAME3DWIN32);
    wcex.lpszClassName = szWindowClass;
    wcex.hIconSm = LoadIcon(wcex.hInstance, MAKEINTRESOURCE(IDI_SMALL));

    return RegisterClassExW(&wcex);
}

//
//   FUNCTION: InitInstance(HINSTANCE, int)
//
//   PURPOSE: Saves instance handle and creates main window
//
//   COMMENTS:
//
//        In this function, we save the instance handle in a global variable and
//        create and display the main program window.
//
BOOL InitInstance(HINSTANCE hInstance, int nCmdShow)
{
    hInst = hInstance; // Store instance handle in our global variable

    HWND hWnd = CreateWindowW(szWindowClass, szTitle, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, 0, CW_USEDEFAULT, 0, nullptr, nullptr, hInstance, nullptr);

    if (!hWnd)
    {
        return FALSE;
    }

    ShowWindow(hWnd, nCmdShow);
    UpdateWindow(hWnd);
    EnableMouseInPointer(true);

    RefreshBabylon(hWnd);

    return TRUE;
}

void ProcessMouseButtons(tagPOINTER_BUTTON_CHANGE_TYPE changeType, int x, int y)
{
    switch (changeType)
    {
        case POINTER_CHANGE_FIRSTBUTTON_DOWN:
            nativeInput->MouseDown(Babylon::Plugins::NativeInput::LEFT_MOUSE_BUTTON_ID, x, y);
            break;
        case POINTER_CHANGE_FIRSTBUTTON_UP:
            nativeInput->MouseUp(Babylon::Plugins::NativeInput::LEFT_MOUSE_BUTTON_ID, x, y);
            break;
        case POINTER_CHANGE_SECONDBUTTON_DOWN:
            nativeInput->MouseDown(Babylon::Plugins::NativeInput::RIGHT_MOUSE_BUTTON_ID, x, y);
            break;
        case POINTER_CHANGE_SECONDBUTTON_UP:
            nativeInput->MouseUp(Babylon::Plugins::NativeInput::RIGHT_MOUSE_BUTTON_ID, x, y);
            break;
        case POINTER_CHANGE_THIRDBUTTON_DOWN:
            nativeInput->MouseDown(Babylon::Plugins::NativeInput::MIDDLE_MOUSE_BUTTON_ID, x, y);
            break;
        case POINTER_CHANGE_THIRDBUTTON_UP:
            nativeInput->MouseUp(Babylon::Plugins::NativeInput::MIDDLE_MOUSE_BUTTON_ID, x, y);
            break;
        default:
            break;
    }
}

//
//  FUNCTION: WndProc(HWND, UINT, WPARAM, LPARAM)
//
//  PURPOSE: Processes messages for the main window.
//
//  WM_COMMAND  - process the application menu
//  WM_PAINT    - Paint the main window
//  WM_DESTROY  - post a quit message and return
//
//
LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
    switch (message)
    {
        case WM_SYSCOMMAND:
        {
            if ((wParam & 0xFFF0) == SC_MINIMIZE)
            {
                if (device)
                {
                    update->Finish();
                    device->FinishRenderingCurrentFrame();
                }

                runtime->Suspend();

                minimized = true;
            }
            else if ((wParam & 0xFFF0) == SC_RESTORE)
            {
                if (minimized)
                {
                    runtime->Resume();

                    minimized = false;

                    if (device)
                    {
                        device->StartRenderingCurrentFrame();
                        update->Start();
                    }
                }
            }
            DefWindowProc(hWnd, message, wParam, lParam);
            break;
        }
        case WM_COMMAND:
        {
            // Parse the menu selections:
            switch (int wmId = LOWORD(wParam); wmId)
            {
                case IDM_ABOUT:
                    DialogBox(hInst, MAKEINTRESOURCE(IDD_ABOUTBOX), hWnd, About);
                    break;
                case IDM_EXIT:
                    DestroyWindow(hWnd);
                    break;
                default:
                    return DefWindowProc(hWnd, message, wParam, lParam);
            }
            break;
        }
        case WM_SIZE:
        {
            if (device)
            {
                auto width = static_cast<size_t>(LOWORD(lParam));
                auto height = static_cast<size_t>(HIWORD(lParam));
                UpdateWindowSize(width, height);
            }
            break;
        }
        case WM_DESTROY:
        {
            Uninitialize();
            PostQuitMessage(Babylon::Plugins::TestUtils::errorCode);
            break;
        }
        case WM_KEYDOWN:
        {
            break;
        }
        case WM_POINTERWHEEL:
        {
            if (nativeInput != nullptr)
            {
                nativeInput->MouseWheel(Babylon::Plugins::NativeInput::MOUSEWHEEL_Y_ID, -GET_WHEEL_DELTA_WPARAM(wParam));
            }
            break;
        }
        case WM_POINTERDOWN:
        {
            if (nativeInput != nullptr)
            {
                POINTER_INFO info;
                auto pointerId = GET_POINTERID_WPARAM(wParam);
                POINT origin{0, 0};

                if (GetPointerInfo(pointerId, &info) && ClientToScreen(hWnd, &origin))
                {
                    auto x = GET_X_LPARAM(lParam) - origin.x;
                    auto y = GET_Y_LPARAM(lParam) - origin.y;

                    if (info.pointerType == PT_MOUSE)
                    {
                        ProcessMouseButtons(info.ButtonChangeType, x, y);
                    }
                    else
                    {
                        nativeInput->TouchDown(pointerId, x, y);
                    }
                }
            }
            break;
        }
        case WM_POINTERUPDATE:
        {
            if (nativeInput != nullptr)
            {
                auto pointerId = GET_POINTERID_WPARAM(wParam);
                POINTER_INFO info;
                POINT origin{0, 0};

                if (GetPointerInfo(pointerId, &info) && ClientToScreen(hWnd, &origin))
                {
                    auto x = GET_X_LPARAM(lParam) - origin.x;
                    auto y = GET_Y_LPARAM(lParam) - origin.y;

                    if (info.pointerType == PT_MOUSE)
                    {
                        ProcessMouseButtons(info.ButtonChangeType, x, y);
                        nativeInput->MouseMove(x, y);
                    }
                    else
                    {
                        nativeInput->TouchMove(pointerId, x, y);
                    }
                }
            }
            break;
        }
        case WM_POINTERUP:
        {
            if (nativeInput != nullptr)
            {
                auto pointerId = GET_POINTERID_WPARAM(wParam);
                POINTER_INFO info;
                POINT origin{0, 0};

                if (GetPointerInfo(pointerId, &info) && ClientToScreen(hWnd, &origin))
                {
                    auto x = GET_X_LPARAM(lParam) - origin.x;
                    auto y = GET_Y_LPARAM(lParam) - origin.y;

                    if (info.pointerType == PT_MOUSE)
                    {
                        ProcessMouseButtons(info.ButtonChangeType, x, y);
                    }
                    else
                    {
                        nativeInput->TouchUp(pointerId, x, y);
                    }
                }
            }
            break;
        }
        default:
        {
            return DefWindowProc(hWnd, message, wParam, lParam);
        }
    }
    return 0;
}

// Message handler for about box.
INT_PTR CALLBACK About(HWND hDlg, UINT message, WPARAM wParam, LPARAM lParam)
{
    UNREFERENCED_PARAMETER(lParam);
    switch (message)
    {
        case WM_INITDIALOG:
            return TRUE;

        case WM_COMMAND:
            if (LOWORD(wParam) == IDOK)
            {
                EndDialog(hDlg, LOWORD(wParam));
                return TRUE;
            }
            else if (LOWORD(wParam) == IDLICENSE)
            {
                ShellExecute(0, 0, L"https://www.gnu.org/licenses/agpl-3.0.en.html", 0, 0, SW_SHOW);
                return TRUE;
            }
            break;
        default:
            break;
    }
    return FALSE;
}
