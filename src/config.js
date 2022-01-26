var Config = {
    /**
     * Server url for debugging and working on feature, 
     * Change this when ever you start working on a new feature
     */
    debug_url: "https://KS-BOT-Server.learncode2.repl.co",

    /**
     * This is server url for production, do not change this,
     * Set this to all your url when you are ready to merge your new feature
     */
    production_url: "https://ksbot.kidssmit.com",

    /**
     * Sets if to user the debug_url or production url, change to the right url
     * before you commit
     */
    debug: true,

    /**
     * Returns the correct URL based on if you are in debug or not
     * @return {String} Correct server url
     */
    get_url: () => {
        if (Config.debug) {
            return Config.debug_url
        }
        return Config.production_url;
    }
}