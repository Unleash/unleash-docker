'use strict';

const fs = require("fs");
const unleash = require('unleash-server');

let options = {};

options.port = 80

if (process.env.DATABASE_URL_FILE) {
    options.databaseUrl = fs.readFileSync(process.env.DATABASE_URL_FILE, 'utf8');
}

unleash.start(options);
