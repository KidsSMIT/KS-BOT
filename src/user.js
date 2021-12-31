const fetch = require("node-fetch");

const path = require("path");

db_func = require(path.join(__dirname, "db"));

// The user of Global in comments, is refering to
// the server database
/**
 * Users class used to interact with with the user side of the server
 */
class Users {
    /**
     * Users class used to interact with with the user side of the server
     * @param {string} id - Global id of the user
     * @param {string} name - Global name of the user
     * @param {string} password -  Global password of user 
     */
    constructor(id, name, password) {
        this.id = id;
        this.name = name;
        this.password = password;
    }

    /**
     * Creates A user in local database
     * if the user exist already exist in local database it will sign the user in
     * @param {string} id - Global id of the user
     * @param {string} name - Global name of the user
     * @param {string} password -  Global password of user
     */
    create_user = (id, name, password) => {
        db_func.user_exist(id, (val) => {
            if (val == true) {
                console.log("User exist");
                this.sign_in(id, name, password);
            } else {
                this.sign_out();
                db_func.create_user(id, name, password, () => { console.log("Created New User") })
                this.sign_in(id, name, password);
            }
        })
    }

    /**
     * Signs the user globally and locally
     * @param {string} id - Global id of the user
     * @param {string} name - Global name of the user
     * @param {string} password -  Global password of user
     */

    sign_in = (id, name, password, callback = function() {}) => {
        this.id = id;
        this.name = name;
        this.password = password;

        db_func.sign_in(name, password, () => { console.log("Success Sign In") })
        callback();
    }

    /**
     * Signs out the user locally and globally
     * @param {string} id - Global id of the user
     * @param {string} name - Global name of the user
     * @param {string} password -  Global password of user
     */
    sign_out = () => {
        this.id = null;
        this.name = null;
        this.password = null;
        db_func.sign_out(() => { console.log('Success SignOut') });
    }

}

module.exports = {
    Users: Users
}