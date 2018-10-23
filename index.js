'use strict';

const fs = require("fs");
const unleash = require('unleash-server');

let options = {};

if (process.env.DATABASE_URL_FILE) {
    options.databaseUrl = fs.readFileSync(process.env.DATABASE_URL_FILE);
}

unleash.start(options);
