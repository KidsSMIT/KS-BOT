// Modules to control application life and create native browser window
const { app, ipcMain, Tray, BrowserWindow } = require('electron');

if (require('electron-squirrel-startup')) return app.quit();

const { autoUpdater } = require("electron-updater");


const path = require('path');

require(path.resolve(__dirname, "debug_console"))

// Used to Debug Releases that won't have a console... Comment out when devloping


const fs = require("fs");
try {
    fs.unlinkSync(path.resolve(process.resourcesPath, "console.log"))
        // We will need to delete the previous log, so we will only deal with recent errors
} catch (err) {
    console.error(err)
}

//Uncomment this if you are not running in dev mode
console.file(path.resolve(process.resourcesPath, "console.log"));

const { KS, image } = require(path.join(__dirname, 'KS'));
const db_func = require(path.join(__dirname, 'db'));

db_func.does_db_exit_if_not_create()

let cap = new KS(null, 'KS', null, 1300,
    600, {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
    }, false)


console.log(cap.add_child("KS", "index.html", false, (win) => { console.log("DONE") }, true));
console.log(cap.add_child("Home", "home.html", false, function() { console.log("Added Home to ks") }));

let run = () => {
    cap.run(() => {})
    autoUpdater.checkForUpdates();
}

ipcMain.on("login", (event, arg) => {
    cap.user.create_user(arg.id, arg.name, arg.password)
    cap.openWindow("Home");
})

ipcMain.on("LogInCredentials", (event, arg) => {
    cap.currentWindow.webContents.send('hereIsCredentials', {
        id: cap.user.id,
        name: cap.user.name,
        password: cap.user.password
    })
})

// AutoUpdate Code
ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
})

autoUpdater.on('update-downloaded', (info) => {
    cap.currentWindow.webContents.send('updateReady')
});

// End Of AutoUpdate Code

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        run();
    }
});

let tray = null

app.whenReady().then(() => {
    tray = new Tray(image.resize({ width: 600, height: 600 }))
    tray.setTitle('KS-Bot');
    run();
})

// This is for the render process do not touch
ipcMain.on("closeWindow", () => {
    app.quit()
})

ipcMain.on("minimizeWindow", () => {
    cap.currentWindow.isMinimized() ? cap.currentWindow.restore() : cap.currentWindow.minimize()
})

ipcMain.on("maximizeWindow", () => {
    if (cap.currentWindow.isFullScreen()) {
        cap.currentWindow.setFullScreen(false)
    } else {
        cap.currentWindow.setSimpleFullScreen(false)
        cap.currentWindow.setFullScreen(true)
    }
})

ipcMain.on("RemoveAlwaysOnTop", () => {
    cap.currentWindow.setAlwaysOnTop(false, 'screen');
})

ipcMain.on("AddAlwaysOnTop", () => {
    cap.currentWindow.setAlwaysOnTop(true, 'screen');
})

ipcMain.on("go_to_home", () => {
    cap.openWindow('Home')
})

ipcMain.on("ReloadWindow", () => {
    cap.currentWindow.reload()
})

ipcMain.on("ForceReload", () => {
    cap.currentWindow.webContents.reloadIgnoringCache()
})

ipcMain.on("TDEVTOOLS", () => {
    let devtools = new BrowserWindow();
    cap.currentWindow.webContents.setDevToolsWebContents(devtools.webContents)
    cap.currentWindow.webContents.openDevTools({ mode: 'detach' });
    cap.currentWindow.on("hide", function() {
        devtools.close()
    })
})

ipcMain.on("ZOOMIN", () => {
    var currentZoom = cap.currentWindow.webContents.getZoomFactor();
    cap.currentWindow.webContents.zoomFactor = currentZoom + 0.2;
})

ipcMain.on("ZOOMOUT", () => {
    var currentZoom = cap.currentWindow.webContents.getZoomFactor();
    cap.currentWindow.webContents.zoomFactor = currentZoom - 0.2;
})

ipcMain.on("NORMALZOOM", () => {
        cap.currentWindow.webContents.setZoomFactor(1.0);
    })
    // End of the render process