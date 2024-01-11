import {app, BrowserWindow} from "electron/main";
import path from "path";

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // Open the DevTools.
    win.webContents.openDevTools();
}

app.whenReady().then(async () => {
    await createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});