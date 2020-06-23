'use strict';

const unleash = require('unleash-server');

const enableGoogleOauth = require('./google-auth-hook');

unleash
    .start({
        adminAuthentication: 'custom',
        preRouterHook: enableGoogleOauth,
    })
    .then(server => {
        // eslint-disable-next-line no-console
        console.log(
            `Unleash started on http://localhost:${server.app.get('port')}`,
        );
    });
