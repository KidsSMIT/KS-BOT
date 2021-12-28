const sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
const path = require('path');
const db_file_loc = path.resolve(process.resourcesPath, "client.db")