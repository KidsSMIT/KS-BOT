const { app, BrowserWindow, nativeImage } = require("electron")

const path = require("path")

const db_func = require(path.join(__dirname, "db"))

const { Users } = require(path.join(__dirname, "user"))

const image = nativeImage.createFromPath(
    path.join(__dirname, "icon.png")
)

class KS {

    constructor(parent, parent_name, parent_func, width, height, webpref, frame) {
        this.parent = parent;
        this.parent_name = parent_name;
        this.width = width;
        this.height = height = height;
        this.webpref = webpref;
        this.parent_func = parent_func;
        this.windows = {};
        this.triggers = {};
        this.currentWindow = null;
        this.update_window = null;
        this.frame = frame;
        this.data = null;
        this.user = new Users(null, null, null);
    }

    /**
     * Adds a new window to class window dictonary
     * @param {string} name -  Name of the new window
     * @param {string} file_name - File Name of the new Window
     * @param {boolean} open_dev - When New Window is created, open dev tools or not
     * @param {Function} callback - Function to call after showing window
     * @param {boolean} parent - Whether or not the new window is the class parent window
     */
    add_child = (name, file_name, open_dev, callback, parent = false) => {
        if (name in this.windows) {
            throw `Window name '${name}' already exist`
        }

        if (parent == false) {
            let new_child_func = () => {
                let new_child = new BrowserWindow({
                    width: this.width,
                    height: this.height,
                    show: false,
                    fullscreen: true,
                    webPreferences: this.webpref,
                    icon: image.resize({ width: 600, height: 600 }),
                    alwaysOnTop: true,
                    frame: this.frame
                });

                new_child.on("close", this.close_all);
                new_child.loadFile(path.join(__dirname, file_name))
                if (open_dev == true) {
                    let devtools = new BrowserWindow();
                    new_child.webContents.setDevToolsWebContents(devtools.webContents)
                    new_child.webContents.openDevTools();
                    new_child.on("hide", function() {
                        devtools.close()
                    })
                }

                new_child.webContents.setZoomFactor(1.0);
                new_child.webContents
                    .setVisualZoomLevelLimits(1, 5)
                    .then(console.log("Zoom Levels Have been Set between 100% and 500%"))
                    .catch((err) => console.log(err));

                this.windows[name] = new_child;
                new_child.on('show', () => {
                    new_child.maximize()
                    callback(new_child)
                })
            }
            this.triggers[name] = new_child_func;
            return `Added ${name} to ${this.parent_name} program`

        } else {
            this.parent_func = () => {
                this.parent = new BrowserWindow({
                    width: this.width,
                    height: this.height,
                    fullscreen: true,
                    webPreferences: this.webpref,
                    icon: image.resize({ width: 600, height: 600 }),
                    alwaysOnTop: true,
                    frame: this.frame
                });

                this.parent.on("close", app.quit);
                this.parent.loadFile(path.join(__dirname, file_name));
                if (open_dev == true) {
                    let devtools = new BrowserWindow()
                    this.parent.webContents.setDevToolsWebContents(devtools.webContents)
                    this.parent.webContents.openDevTools({ mode: 'detach' });
                    this.parent.on("hide", function() {
                        devtools.close()
                    })
                }

                this.parent.webContents.setZoomFactor(1.0);
                this.parent.webContents
                    .setVisualZoomLevelLimits(1, 5)
                    .then(console.log("Zoom Levels Have been Set between 100% and 500%"))
                    .catch((err) => console.log(err));
                this.windows[this.parent_name] = this.parent;
            }
            this.triggers[this.parent_name] = this.parent_func;
            return `Added ${this.parent_name} to program`
        }
    }

    /**
     * Closes all windows in class
     */
    close_all = () => {
        app.quit()
    }

    /**
     * Opens a window in class... If window is not in class, will not open
     * @param {string} name - Name of window you want to open
     * @param {Function} callback - Function to call after process is complete, the function is optional
     */
    openWindow = (name, callback = function() {}) => {
        let keys = Object.keys(this.triggers);
        if (keys.includes(name)) {
            // This if statement means the window that your going to, is the currentWindow
            if (this.currentWindow == this.windows[name]) { return }
            this.currentWindow.hide();
            this.triggers[name]();
            this.currentWindow = this.windows[name];
            this.currentWindow.show();
            callback();
            return `${name} has been opened.`;
        }
        callback();
        throw `${name} does not exist.`;
    }

    /**
     * Starts the running process of the class, Checks if user is logged in
     * If user logged in - Goes to home page
     * If user is not logged in - Goes to log in page
     * 
     * 
     * LOG IN PAGE SHOULD BE THE PARENT PAGE
     * @param {Function} callback - Function to call when process is complete, this function is optional
     */
    run = (callback = function () {} ) => {
        this.triggers[this.parent_name]()
        this.windows[this.parent_name] = this.parent;
        this.currentWindow = this.parent

        db_func.users_signed_in((row) => {
            if (row == undefined) { return }

            this.user.sign_in(row.server_id, row.name, row.password);
            this.openWindow("Home", callback)
        })

        return `Running ${this.parent_name} APP`
    }
}

module.exports = {
    KS: KS,
    image: image
}