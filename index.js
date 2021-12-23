'use strict';

const unleash = require('unleash-server');

function logger(name) {
  return {
    warn: console.log,
    error: console.error,
  };
}


let options = {
    getLogger: logger,
    server: {
        port: 80,
    }
};


unleash.start(options);
