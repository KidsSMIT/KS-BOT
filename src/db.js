const sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
const path = require('path');
const db_file_loc = path.resolve(process.resourcesPath, "client.db")

/**
 * Checks if table exist in database, if it does not, 
 * it creates it
 */
const table_exist = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
        "id"	INTEGER NOT NULL,
        "server_id"	INTEGER,
        "name"	INTEGER,
        "password"	INTEGER,
        "signed_in"	INTEGER,
        PRIMARY KEY("id" AUTOINCREMENT)
    );
    `
    let db = new sqlite3.Database(db_file_loc, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    db.run(sql)
    db.close()
}

/**
 * Checks if database exist, if it does not it creates it
 * Then it checks if table exist, if it does notit creates it
 */
const does_db_exit_if_not_create = () => {
    // open the database 
    // console.log(db_file_loc)
    if (fs.existsSync(db_file_loc)) {
        table_exist()
    } else {
        fs.open(db_file_loc, 'w', function(err,
            file) {
            if (err) throw err;
            //console.log('Saved!');
        });
        table_exist()
    }
}

/**
 * Checks if any user is signed, and returns a row values for user data to your callback parameter
 * @param {Function} callback - Function to call when the signed in user data has been collected
 */
const users_signed_in = (callback) => {
    // open the database
    let db = new sqlite3.Database(db_file_loc, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    let query = `SELECT server_id, name, password FROM users WHERE signed_in=?`;
    db.get(query, [1], (err, row) => {
        if (err) {
            console.log("WE ARE IN USERS SIGNED IN")
            return console.log(err.message);
        }
        callback(row)
    });
    db.close();
}

/**
 * Checks if users_id exist locally in database
 * @param {string} id - User local id
 * @param {Function} callback - Function to call after checking if user exist; Needs to exoect a parameter of either true or false
 */
const user_exist = (id, callback = function(parm) {}) => {
    let db = new sqlite3.Database(db_file_loc, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    let query = `select id from users where server_id=?`
    db.get(query, [id], (err, row) => {
        if (err) {
            console.log("WE ARE IN USER EXIST")
            return console.log(err.message);
        }
        if (row) {
            callback(true);
        } else {
            callback(false);
        }
    })
}

/**
 * Inserts a new row for the new user into local database
 * @param {string} id - id of the new user
 * @param {string} name - name of new user
 * @param {string} password - password for new user
 * @param {Function} callback - Function to call after inserting new user
 */
const create_user = (id, name, password, callback = function() {}) => {
    let db = new sqlite3.Database(db_file_loc, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    db.run(`insert into users (server_id, name, password, signed_in) values (?,?,?, 0)`, [id, name, password], (err) => {
        if (err) {
            console.log("WE ARE IN CREATE USER")
            console.log(err.message);
        }

        callback()
    })
}

/**
 * Signs User out from local database
 * @param {Function} callback - Function to call after signout has taken place
 */
const sign_out = (callback) => {
    let db = new sqlite3.Database(db_file_loc, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    db.run(`update users set signed_in=? where signed_in=?`, [0, 1], function(err) {
        if (err) {
            console.log("WE ARE IN SIGNOUT")
            return console.log(err.message);
        }

        callback();
    });
    db.close()
}

/**
 * Signs in the user locally on database
 * @param {string} name - Name of user you would like to sign in
 * @param {string} password - Password of user you would like to sign in
 * @param {Function} callback - Function to call once sign in process has taken place
 */
const sign_in = (name, password, callback) => {
    let db = new sqlite3.Database(db_file_loc, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    db.run(`update users set signed_in=? where name=? and password=?`, [1, name, password], function(err) {
        if (err) {
            console.log("We ARE IN SIGNIN")
            return console.log(err.message);
        }
        callback();
    })
}

module.exports = {
    users_signed_in: users_signed_in,
    sign_out: sign_out,
    sign_in: sign_in,
    user_exist: user_exist,
    create_user: create_user,
    does_db_exit_if_not_create: does_db_exit_if_not_create
}