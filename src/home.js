const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

let control = null;

class Controller {
    constructor(id, name, password) {
        this.user_id = id;
        this.user_name = name;
        this.password = password;
        this.bot_id = null;
        this.socket_io = io(Config.get_url());

        this.loading_div = document.getElementById("loadingScreen");
        this.main_div = document.getElementById("KS_BOT_DIV");

        this.KS_BOT_Messages = document.getElementById("KS_BOT_Messages");

        // Text Input field
        this.send_messages_input = document.getElementById("send_messages_input");

        // Send Text Button
        this.send_messages_button = document.getElementById("send_messages_button");

        // Typing gif
        this.typing_gif = document.getElementById("typing_gif");

        this.socket_io.emit('launch_bot', { session_id: this.user_id });

        this.socket_io.on("WelcomeMessage", data => {
            this.go_to_loading_screen()
            let message_datas = data.data;
            let message_keys = Object.keys(message_datas);
            let full_str = ""
            for (let i in message_keys) {
                let current_message = message_datas[message_keys[i]]
                full_str += this.dict_to_str(current_message)
            }
            this.KS_BOT_Messages.innerHTML = full_str;

            this.remove_loading_screen();

            this.send_messages_button.onclick = this.button_effect
            this.scrollToBottom(this.KS_BOT_Messages)
        })

        this.socket_io.on("BotProcessReply", data => {
            let full_str = ""
            for (let i in data.data) {
                let current_message = data.data[i];
                full_str += this.dict_to_str(current_message);
            }
            this.KS_BOT_Messages.innerHTML += full_str
            this.typing_gif.style.display = "none";
            this.scrollToBottom(this.KS_BOT_Messages)
        })

        this.socket_io.on("Timer Over", data => {
            //console.log(data) // Tells you when your timer is over if your still connected to server
            TimerEvents.create_timer(data.Timer, data.Message)
            let message_data = {
                bot_sent: true,
                id: "RandomTimer",
                message: data.Message,
                date: data.date
            }

            this.KS_BOT_Messages.innerHTML += this.dict_to_str(message_data)
            this.scrollToBottom(this.KS_BOT_Messages)
        })
    }

    /**
     * Shows the user loading screen till this.remove_loading_screen() is called
     */
    go_to_loading_screen = () => {
        this.loading_div.style.display = "block";
        this.main_div.style.display = "none";
    }

    /**
     * Removes loading screen and shows main screen
     */
    remove_loading_screen = () => {
        this.loading_div.style.display = "none";
        this.main_div.style.display = "block";
    }

    /**
     * Uses dicts to create a string HTMLElement that you can add to the page
     * @param {Object.<string, Object>} dicts - data from server you would like to process  
     * @returns {string} string of the HTMLElement
     */
    dict_to_str = (dicts) => {
        let string = `
        <div class="${dicts.bot_sent ? 'BotMessageContainer' : 'UserMessageContainer'}"
        id="MessageContainer${dicts.id}">
            <div class="Message">
                ${dicts.message}
                <div class="MessageDate">
                    ${dicts.date}
                </div>
            </div>
        </div>
        `
        this.bot_id = dicts.bot_id;

        return string
    }

    /**
     * Sends message to server, to be proceessed by the bot
     */
    button_effect = () => {
        if (this.send_messages_input.value.length > 0) {
            this.socket_io.emit('process_new_message', {
                session_id: this.user_id,
                new_message: {
                    message: this.send_messages_input.value,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                }
            });
        }
        this.send_messages_input.value = "";
        this.typing_gif.style.display = "block";
    }

    /**
     * Scrolls node scrollbar to the bottom of the node
     * @param {HTMLElement} node - Node you will like to scroll to the bottom of
     */
    scrollToBottom = (node) => {
        node.scrollTop = node.scrollHeight;
    }
}

ipcRenderer.send('LogInCredentials')

ipcRenderer.on('hereIsCredentials', (event, data) => {
    control = new Controller(data.id, data.name, data.password)
})