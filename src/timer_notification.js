var TimerEvents = {

    /**
     * Audio to play and stop playing
     */
    audio: document.getElementById("alarm"),

    /**
     * JSON style collection for the currently displayed tiemrs
     */
    timers: {},

    /**
     * Creates a timer and the html element relating to that timer
     * 
     * @param {string} timer - The timer your creating
     * @param {string} message - The message to display for that timer
     * 
     * @return {Object.<string, Object>} Dicts object for the timer you just created
     */
    create_timer: (timer, message) => {
        new_timer_id = TimerEvents.generate_timer_id();

        TimerEvents.timers[new_timer_id] = {
            id: new_timer_id,
            Timer: timer,
            Message: message
        }

        let html = `
      <div id="TimerEvents:${new_timer_id}" class="TimerEvents">
        <div class="TimerEventsMessage">${message}</div>
        <button class="TimerEventClose" onclick="TimerEvents.delete_timer('${new_timer_id}')">X</button>
      </div>
      `

        document.body.appendChild(TimerEvents.string_to_element(html))

        // If this is the first ever timer created then we want to start
        // Ringing the alarm, else there is already an alarm ringing
        if (Object.keys(TimerEvents.timers).length <= 1) {
            TimerEvents.audio.autoplay = true;
            TimerEvents.audio.loop = 'true';
            TimerEvents.audio.load();
            TimerEvents.audio.play();
        }

        return TimerEvents.timers[new_timer_id]
    },

    /**
     * Generates a random timer id
     * @return {String} string
     */
    generate_timer_id: () => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 10; i++) {
            text += possible.charAt(
                Math.floor(
                    Math.random() * possible.length
                )
            );
        }

        if (text in TimerEvents.timers) {
            return TimerEvents.generate_timer_id()
        }

        return text;
    },

    /**
     * Deletes timer from TimerEvents and delete html element of the timer
     * @param {string} timer_id -  The id for the timer you would like to delete.
     */
    delete_timer: (timer_id) => {
        try {
            let div = document.getElementById(`TimerEvents:${timer_id}`)
            div.remove();
        } catch (err) { console.log(err) }

        delete TimerEvents.timers[timer_id]

        // If this is the last timer we want to stop 
        // Ringing the alarm, else we will keep ringing it
        if (Object.keys(TimerEvents.timers).length == 0) {
            TimerEvents.audio.pause();
            TimerEvents.audio.currentTime = 0;
        }
    },


    /**
     * Turns a String into a html element 
     * @param {string} htmlString - The html string you want to turn into a html element
     * 
     * @returns {HTMLElement} Returns your HTML Element
     */
    string_to_element: (htmlString) => {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    },
}