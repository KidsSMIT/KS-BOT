class SMITH_Handler {
    static #_instance;

    /**
     * Gives aceess to a SMITH_Handler instance
     * @param {string} session_id - User session_id gotten from server after log in
     * @returns {SMITH_Handler} instance of SMITH_Handler
     */
    static __init__ = (session_id) => {
        if (SMITH_Handler.#_instance == null){
            SMITH_Handler.#_instance = new SMITH_Handler(session_id)
        }

        return SMITH_Handler.#_instance;
    }

    constructor(session_id){
        this.container = document.getElementById("smith_container") || this.create_Container()
        this.container.style.display = "block";

        this.session_id = session_id;

        this.can_run = true;

        this.running = false;

        this.load_recognition() 
    }

    /**
     * Starts the run process for SMITH, if SMITH can not run on user system it will close itself
     */
    run = () => {
        if (this.can_run) {
            this.read_file("smith.svg", (text) => {
                this.running = true;
                this.container.innerHTML = text;

                this.container.innerHTML += "<h1>S.M.I.T.H</h1>"
                let this1 = this;
                this.container.onclick = function() { 
                    this1.process_command("Switch to bot now")
                }
                document.body.style = "margin: 0; background-color: #011C2D; color: #FFFFFF; font-family: 'Helvetica', sans-serif;"

                this.speech("Hello there, what can I do for you")
            })
        }else {
            this.speech("SMITH is still loading please try again later");
            this.close();
        }
    }


    /**
     * Closes SMITH and enables KS-Bot
     */
    close = () => {
        this.speech("Closing Smith now");
        this.container.innerHTML = "";
        document.body.style = "margin: 0; font-family: Arial, Helvetica, sans-serif";


        this.running = false;
        window.KS_Bot_Controller.main_div.style.display = "block";
    }

    /**
     * Reads a file in user directory, expected to be used to read the smith.svg file, but should work for any file
     * @param {string} file_name - Path to file you would like to read
     * @param {Function} callback - Function to call when done reading file, the function should expect a parameter of file contents
     */
    read_file = (file_name, callback) => {
        fetch(file_name)
        .then(response => response.text())
        .then(text => callback(text))
    }

    /**
     * Sends message to server for processing and return
     * @param {string} text - User command you will like to send to server to process 
     */
    process_command = (text) => {
        // We as using the KS_Bot_Controller class instance to send a socket_io event to server
        // for processing and get a return back
        if (text.length >= 2) { // If statement because now that SMITH is alive it send text with no statement, and we are correcting that issue
            window.KS_Bot_Controller.socket_io.emit('process_new_message', {
                session_id: this.session_id,
                new_message: {
                    message: text,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                }
            });
        }
    }

    /**
    * Loads in the defualt browser speech recognition to be used
    * Calls a function when ever Speech is ready for transcription
    */
    load_recognition = () => {
        let this1 = this
        this1.channel = new MessageChannel();
        
        let model_fun = async () => {
            this1.model = await Vosk.createModel(`${Config.get_url()}/static/vosk-model-small-en-us-0.15.tar.gz`);
            this1.model.registerPort(this1.channel.port1);
            const sampleRate = 48000;

            this1.recognizer = new this1.model.KaldiRecognizer(sampleRate);
            this1.recognizer.setWords(true);

            this1.recognizer.on("result", (message) => {
                const result = message.result;         
                if (this1.running && !speechSynthesis.speaking) {
                    this1.process_command(`${result.text} `)
                }
            });

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    channelCount: 1,
                    sampleRate
                },
            });

            const audioContext = new AudioContext();
            await audioContext.audioWorklet.addModule('recognizer-processor.js')

            const recognizerProcessor = new AudioWorkletNode(audioContext, 'recognizer-processor', { channelCount: 1, numberOfInputs: 1, numberOfOutputs: 1 });
            recognizerProcessor.port.postMessage({action: 'init', recognizerId: this1.recognizer.id}, [ this1.channel.port2 ])
            recognizerProcessor.connect(audioContext.destination);
            
            const source = audioContext.createMediaStreamSource(mediaStream);
            source.connect(recognizerProcessor);
            this1.can_run =  true;
            return "DONE LOADING MODULE"
        }

        model_fun().then(answer => {})
    }
    /**
     * Uses browsers default voice to say a text
     * @param {string} response - What will you like SMITH to say?
     */
    speech = (response) => {
        speechSynthesis.speak(new SpeechSynthesisUtterance(response));
    }

    /**
     * Creates a new container and appends it to body, setting the container to not visible
     * @returns {HTMLElement} Container HTMLElement
     */
    create_Container = () => {
        let container = document.createElement("div")
        container.id = "smith_container";
        container.style = "max-width: 250px; text-align: center; margin: 0px auto; padding: 20%; position: fixed; top: 2vh; left: 20vw;"
        container.style.display = "none";
        document.body.appendChild(container)
        return container;
    }
}
