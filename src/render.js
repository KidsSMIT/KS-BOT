const render = require('electron').ipcRenderer
const shell = require('electron').shell;
/**
 * Turns string into Dom element
 * @param {string} html html string you would like to turn into HTMLElement
 * @returns {HTMLElement}
 */
toDom = (html) => {
    let doc = document.createElement("template");
    doc.innerHTML = html.trim()
    return doc.content;
}

/**
 * @param {string} id - id of document you want to grab/create
 * @param {string} typess - The type of document you would like to create if the document does not exist
 * @return {HTMLElement}
 */
document.getOrCreate = (id, typess = 'div') => {
    try {
        var doc = document.getElementById(id);
        if (doc == null) throw new Error("Doc does not exist")
        return doc
    } catch (err) {
        console.log("creating new doc")
        var doc = document.createElement(typess);
        doc.id = id;
        return doc;
    }
}

/**
 * A MenuOption that allows structure to Menu 
 * 
 * @external MenuOptions
 */
class MenuOptions {
    /**
     * @param {(Function | null)} click  -  menuOption click
     * @params {external:Menu} sumbenu - This function uses Menu class,
     */
    constructor(click = null, submenu = new Menu({})) {
        this.click = click;
        if (this.click == null) {
            this.click = function() {}
        }
        this.submenu = submenu;
    }
}

/**
 * A Menu Object allows for structure and etc 
 * 
 * @external Menu
 */

class Menu {
    /**
     * Creates a menu template to be used by titleBar
     * @param {Object.<string, MenuOptions>} options should be in the following format
     * 
     * {
     * 
     * 	"Name of New Menu Option": new MenuOptions()
     * 
     * }
     */
    constructor(options = {}) {
        this.length = 0;
        let keys = Object.keys(options);
        for (var i = 0; i < keys.length; i++) {
            if (this[keys[i]] !== undefined) {
                console.error(`Key "${keys[i]}" already exist`);
                console.log(this[keys[i]])
            } else {
                this[keys[i]] = options[keys[i]];
                this.length += 1;
            }
        }
    }

    /**
     * Creates and returns html element for the Menu and returns it in string format.
     * @param {string} background_color -  Background color for the html element defualt is black
     * @param {string} text_color - Color for the html element defualt is white
     * @return {string} html element
     */
    create_html_string = (background_color = "black", text_color = "white") => {
        let menu_string = "";
        // loops through all varaibles in the class instance
        for (var i in this) {
            // makes sure the varaible are not the following 
            if (i !== 'length' && i !== "create_html_string" && i !== 'load_all_buttons' && i !== "Parent") {
                let new_string;
                // creates individualize strings for each variable
                if (this[i].submenu.length > 0) {
                    new_string = `
			  <span style="color: ${text_color};" id="menu_options_${i}" class="dropdown">${i} +
			  </span>
					`
                } else {
                    new_string = `
			  <span style="color: ${text_color};" id="menu_options_${i}" class="dropdown">${i}
			  </span>
					`
                }

                // adds that string to menu_string
                menu_string += new_string
            }
        }
        // returns that string
        return menu_string
    }

    /**
     * Gives each button in the class instance individualize effect for the html doc
     * @param {string} parent_dom - This is the previous parent element id, defualt is false meaning, that this
     * button is the parent
     * 
     * @param {HTMLElement} parent -  This the previous parent elemnet, default is null, meaning that this button 
     * is the parent
     */
    load_all_buttons = (parent_dom = null) => {
        //checks if we are working in a child button or parent button
        if (parent_dom == null) {
            for (var i in this) {
                if (i !== 'length' && i !== "create_html_string" && i !== 'load_all_buttons' && i !== 'Parent') {
                    let doc = document.getElementById(`menu_options_${i}`);
                    doc.onclick = this[i].click;
                    this[i].Parent = null;
                    let obj = this[i]
                        //console.log(obj)
                    doc.oncontextmenu = (ev) => {
                        ev.preventDefault()
                        if (document.getElementById("title_bar_article").children.length == 0) {
                            document.getElementById("title_bar_button").onclick = function() {
                                document.getElementById("title_bar_article").innerHTML = '';
                                document.getElementById("title_bar_load_options_popup").style.display = "none";
                            }
                            this.load_all_buttons(obj)
                        } else {
                            document.getElementById("title_bar_article").innerHTML = '';
                            document.getElementById("title_bar_load_options_popup").style.display = "none";
                            document.getElementById("title_bar_button").onclick = function() {
                                document.getElementById("title_bar_article").innerHTML = '';
                                document.getElementById("title_bar_load_options_popup").style.display = "none";
                            }
                        }
                    }
                }
            }
        } else {
            for (var i in parent_dom.submenu) {
                if (i !== 'length' && i !== "create_html_string" && i !== 'load_all_buttons' && i !== "Parent") {
                    document.getElementById("title_bar_load_options_popup").style.display = "block";
                    let doc = document.getElementById("title_bar_article");
                    parent_dom.submenu[i].Parent = parent_dom;
                    let obj = parent_dom.submenu[i];
                    if (doc.children.length == 0) {
                        if (obj.submenu.length == 0) {
                            doc.innerHTML = `
				  <div id="title_bar_article_${i}">${i}</div>
				`
                        } else {
                            doc.innerHTML = `
				  <div id="title_bar_article_${i}">${i} +</div>
				`
                        }
                    } else {
                        if (obj.submenu.length == 0) {
                            doc.appendChild(toDom(`<div id="title_bar_article_${i}">${i}</div>`))
                        } else {
                            doc.appendChild(toDom(`<div id="title_bar_article_${i}">${i} +</div>`))
                        }
                    }
                    console.log(i);
                    console.log(obj)
                    let current_doc = document.getElementById(`title_bar_article_${i}`);
                    current_doc.onclick = obj.click;

                    current_doc.oncontextmenu = (ev) => {
                        if (obj.submenu.length >= 1) {
                            ev.preventDefault();
                            doc.innerHTML = ``;
                            parent_dom.submenu.load_all_buttons(obj);
                            document.getElementById("title_bar_button").onclick = function() {
                                document.getElementById("title_bar_article").innerHTML = '';
                                document.getElementById("title_bar_load_options_popup").style.display = "none";
                                parent_dom.submenu.load_all_buttons(parent_dom)
                            }
                        }
                    }
                    if (parent_dom.Parent == null) {
                        document.getElementById("title_bar_button").onclick = function() {
                            document.getElementById("title_bar_article").innerHTML = '';
                            document.getElementById("title_bar_load_options_popup").style.display = "none";
                        }
                    }
                }
            }
        }
    }
}

class TitleBar {
    /**
     * Class that handles the creating/updating/managing of titleBar
     * 
     * @param {string} backgroundColor - Background Color for titleBar
     * @param {string} icon - Location for the icon of titleBar
     * @param {string} text_color - Color you would like title text to be
     * @param {boolean} shadow -  Would you like to give the DOM elements shadow effect
     * @param {Menu} menu - Menu of the titleBar, if none is provided defualt will be used
     */
    constructor(backgroundColor, icon, text_color = "white", shadow = false, menu = null) {
        this.backgroundColor = backgroundColor;
        this.icon = icon;
        this.text_color = text_color;
        this.shadow = shadow;
        window.shadow = this.shadow;
        this.default_menu = new Menu({
            "Menu": new MenuOptions(
                function() { console.log("I was clicked") },
                new Menu({
                    "File": new MenuOptions(
                        function() { console.log("file was clicked") },
                        new Menu({
                            "Exit": new MenuOptions(
                                function() { render.send("closeWindow") },
                            ),
                        })
                    ),
                    "Edit": new MenuOptions(
                        function() { console.log("Edit was clicked") },
                        new Menu({
                            "Undo": new MenuOptions(function() { document.execCommand('undo') }),
                            "Redo": new MenuOptions(function() { document.execCommand('redo') }),
                            "Cut": new MenuOptions(function() { document.execCommand('cut') }),
                            "Copy": new MenuOptions(function() { document.execCommand('copy') }),
                            "Paste": new MenuOptions(function() { document.execCommand('paste') }),
                            "Select All": new MenuOptions(function() { document.execCommand('selectAll') })
                        })
                    ),
                    "View": new MenuOptions(
                        function() { console.log("View was clicked") },
                        new Menu({
                            "Reload": new MenuOptions(function() { render.send("ReloadWindow") }),
                            "Force Reload": new MenuOptions(function() { render.send("ForceReload") }),
                            "Toggle Developer Tools": new MenuOptions(function() { render.send("TDEVTOOLS") }),
                            "Zoom In": new MenuOptions(function() { render.send("ZOOMIN") }),
                            "Zoom Out": new MenuOptions(function() { render.send("ZOOMOUT") }),
                            "Toggle Full Screen": new MenuOptions(function() { render.send("maximizeWindow") })
                        })
                    ),
                    "Window": new MenuOptions(
                        function() { console.log("Window was clicked") },
                        new Menu({
                            "Minimize": new MenuOptions(function() { render.send("maximizeWindow") }),
                            "Zoom": new MenuOptions(
                                function() { render.send("NORMALZOOM") },
                                new Menu({
                                    "Zoom In": new MenuOptions(function() { render.send("ZOOMIN") }),
                                    "Zoom Out": new MenuOptions(function() { render.send("ZOOMOUT") }),
                                })
                            ),
                            "Close": new MenuOptions(function() { render.send("closeWindow") })
                        })
                    ),
                    "Help": new MenuOptions(
                        function() { console.log('Help was clicked') },
                    )
                })
            )
        })

        this.menu = menu || this.default_menu;
        window.addEventListener('keydown', function(e) {
            if (e.keyCode === 88 && e.metaKey) {
                document.execCommand('cut');
            } else if (e.keyCode === 67 && e.metaKey) {
                document.execCommand('copy');
            } else if (e.keyCode === 86 && e.metaKey) {
                document.execCommand('paste');
            } else if (e.keyCode === 65 && e.metaKey) {
                document.execCommand('selectAll');
            } else if (e.keyCode === 90 && e.metaKey) {
                document.execCommand('undo');
            } else if (e.keyCode === 89 && e.metaKey) {
                document.execCommand('redo');
            }
        });
        this.create()
    }

    /**
     * Loads in the titleBar to the selected window
     */
    create = () => {
        let doc = document.getElementById("titalBarContainer")
        if (doc == null) {
            let doc = document.createElement("div");
            doc.id = "titalBarContainer"
            doc.className = "topnav";
            let menu_string = this.menu.create_html_string(this.backgroundColor, this.text_color)
            doc.style.display = "block";
            doc.style.backgroundColor = this.backgroundColor
            doc.style.color = this.text_color
            doc.innerHTML = `
		  <span class="iconSpan" id="iconSpan">
			<img src="${this.icon}" alt="Icon of app" width="90" height="60" crossorigin="anonymous">
		  </span>
		  ${menu_string}
		  <span class="titleSpan" id="titleSpan">${document.title}</span>
		  
		  <span class="dashSpan" id="dashSpan"></span>
		  <span class="minimizeSpan" id="minimizeSpan"></span>
		  <span class="closeSpan" id="closeSpan"></span>
		`
            document.body.insertBefore(doc, document.body.firstChild)
            document.body.insertBefore(toDom(`<div id="title_bar_load_options_popup" class="opt_popup">
		  <button id="title_bar_button"><</button>
		  <article id="title_bar_article">
		  </article>
		</div>`), document.getElementById("titalBarContainer").nextSibling)
        } else {
            let menu_string = this.menu.create_html_string(this.backgroundColor, this.text_color)
            doc.style = `display: block; background-color: ${this.backgroundColor}; color:${this.text_color};`
            doc.innerHTML = `
		  <span class="iconSpan" id="iconSpan">
			<img src="${this.icon}" alt="Icon of app" width="90" height="60" crossorigin="anonymous">
		  </span>
		  ${menu_string}
		  <span class="titleSpan" id="titleSpan">${document.title}</span>
		  
		  <span class="dashSpan" id="dashSpan"></span>
		  <span class="minimizeSpan" id="minimizeSpan"></span>
		  <span class="closeSpan" id="closeSpan"></span>
		`
        }
        this.menu.load_all_buttons()
        document.getElementById("dashSpan").onclick = this.dash;
        document.getElementById("minimizeSpan").onclick = this.minimize;
        document.getElementById("closeSpan").onclick = this.close;
        document.getElementById("iconSpan").onclick = this.go_to_home;
        document.getElementById("titleSpan").onclick = this.go_to_captalist;
    }

    updateMenu = (menu) => {
        this.menu = menu
        this.create()
    }

    /**
     * Button effect for when the dash "-" button on titleBar is clicked
     */
    dash = () => {
        render.send("minimizeWindow")
    }

    /**
     * Button effect for when the mininize button on titleBar is clicked
     */
    minimize = () => {
        render.send("maximizeWindow")
    }

    /** 
     * Button effect for when the close "X" button title on titleBar is clicked
     */
    close = () => {
        render.send("closeWindow")
    }

    /**
     * Button effect for when the app icon is clicked
     */
    go_to_home = () => {
        console.log("Go to home was clicked")
            //render.send("go_to_home") // We don't need this for real
        shell.openExternal(Config.get_url())
    }

    /**
     * Button effect for when the page title is clicked
     */
    go_to_captalist = () => {
        console.log("Go to captalist was clicked")
        console.log("Base Url is ", Config.get_url())
        shell.openExternal(Config.get_url())
    }
}

var menu = new Menu({
    "Menu": new MenuOptions(
        function() { console.log("I was clicked") },
        new Menu({
            "BIG": new MenuOptions(
                function() { console.log("BIG") },
                new Menu({
                    'optionsBIG': new MenuOptions()
                })
            ),
            "WayBigger": new MenuOptions(
                function() { console.log("WayBigger") },
                new Menu({
                    'optionsWB': new MenuOptions()
                })
            ),
            "moreT": new MenuOptions(
                function() {},
                new Menu({
                    'optionsMORET': new MenuOptions()
                })
            )
        })
    )
})

var head = document.getElementsByTagName('HEAD')[0];
var link = document.createElement('link');
// set the attributes for link element 
link.rel = 'stylesheet';

link.type = 'text/css';

link.href = 'render.css';
head.appendChild(link);

let title_bar = new TitleBar("#333", "icon.png", text_color = "white", shadow = true)