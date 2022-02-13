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

        this.smith_handler = SMITH_Handler.__init__(this.user_id) // S.M.I.T.H Voice Assitant

        // Keeps a collection of all the randomly_generated_id for later user
        this.randomly_generated_id = [];

        this.socket_io.emit('launch_bot', { session_id: this.user_id });

        this.socket_io.on("WelcomeMessage", this._event_welcome_message);

        this.socket_io.on("BotProcessReply", this._event_bot_process_reply);

        this.socket_io.on("Timer Over", this._event_timer_over);

        this.socket_io.on("Here is The Weather", this._event_here_is_the_weather);

        this.socket_io.on("Here is The News", this._event_here_is_the_news);

        this.socket_io.on("SPEAK", this._event_speak);

        this.socket_io.on("Switch To Voice Assitant", this._event_switch_to_voice_assitant);

        this.socket_io.on("Switch To Text Assitant", this._event_switch_to_text_assitant);
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
        this.typing_gif.style.display = "block";
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
    }

    /**
     * Scrolls node scrollbar to the bottom of the node
     * @param {HTMLElement} node - Node you will like to scroll to the bottom of
     */
    scrollToBottom = (node) => {
        node.scrollTop = node.scrollHeight;
    }

    /**
     * Generate random id for what ever event div
     * @return {String} randomly generate id
     */
    generate_random_id = () => {
        let id = Math.random().toString(36).slice(2);

        // We want to make sure all id's are unique
        if (this.randomly_generated_id.includes(id)) { return this.generate_random_id() }

        this.randomly_generated_id.push(id);

        return id;
    }

    /**
     * This function handles the welcome message socket_io event
     * @param {Object.<string, Object>} data - Data sent by server in welcome message event
     */
    _event_welcome_message = (data) => {
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
    }

    /**
     * This function handles the BotProcessReply socket_io event
     * @param {Object.<string, Object>} data - Data sent by the server in BotProcessReply event
     */
    _event_bot_process_reply = (data) => {
        if (data.return === "Success") {
            let full_str = ""
            for (let i in data.data) {
                let current_message = data.data[i];
                full_str += this.dict_to_str(current_message);
            }
            this.KS_BOT_Messages.innerHTML += full_str
            this.typing_gif.style.display = "none";
            this.scrollToBottom(this.KS_BOT_Messages)
        }else {
            this.socket_io.emit('launch_bot', { session_id: this.user_id });
            this.socket_io.emit('process_new_message', {
                session_id: this.user_id,
                new_message: {
                    message: data.message,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                }
            });
        }
    }

    /**
     * This function handles the "Time Over" socket_io event
     * @param {Object.<string, Object>} data - Data sent by the server in Timer Over event
     */
    _event_timer_over = (data) => {
        //console.log(data) // Tells you when your timer is over if your still connected to server
        let mew_timer = TimerEvents.create_timer(data.Timer, data.Message)
        let message_data = {
            bot_sent: true,
            id: "RandomTimer" + mew_timer.id,
            message: data.Message,
            date: data.date
        }

        this.KS_BOT_Messages.innerHTML += this.dict_to_str(message_data)
        this.scrollToBottom(this.KS_BOT_Messages)
    }

    /**
     * This function handles the "Here is the Weather" socket_io event
     * @param {Object.<string, Object>} data - Data sent by the server in "Here is the Weather" event
     */
    _event_here_is_the_weather = (data) => {
        let message_data = {
            bot_sent: true,
            id: "RandomWeatherEvent" + this.generate_random_id(),
            message: data.Message,
            date: data.date
        }

        this.KS_BOT_Messages.innerHTML += this.dict_to_str(message_data)
        this.scrollToBottom(this.KS_BOT_Messages)
    }

    /**
     * This function handles the "Here is the News" socket_io event
     * @param {Object.<string, Object>} data - Data sent by the server in "Here is the News" event
     */
    _event_here_is_the_news = (data) => {
        let message_data = {
            bot_sent: true,
            id: "RandomNewsEvent" + this.generate_random_id(),
            message: data.Message,
            date: data.date
        }

        this.KS_BOT_Messages.innerHTML += this.dict_to_str(message_data)
        this.scrollToBottom(this.KS_BOT_Messages)
    }

    /**
     * This Function handles the Speak socket_io event
     * @param {Object.<string, Object>} data - Data sent by the server in Speak event
     */
    _event_speak = (data) => {
        var msg = new SpeechSynthesisUtterance();
        msg.text = data.what_to_speak;
        window.speechSynthesis.speak(msg);
    }

    /**
     * This Function handles the Switch To Voice Assitant socket_io event
     * @param {Object.<string, Object>} data - Data sent by the server in Switch to Voice Assitant event
     */
    _event_switch_to_voice_assitant = (data) => {
        this.main_div.style.display = "none";
        this.smith_handler.run()
    }

    /**
     * This event handles the Switch To Text Assistant socket_io event
     * @param {Object.<string, Object>} data - Data sent by the server in Switch To Text Assitant event
     */
    _event_switch_to_text_assitant = (data) => {
        this.smith_handler.close()
    }
}

ipcRenderer.send('LogInCredentials')

ipcRenderer.on('hereIsCredentials', (event, data) => {
    // Changed to a global for easier access
    window.KS_Bot_Controller = new Controller(data.id, data.name, data.password)
})