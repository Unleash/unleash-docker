/* eslint-disable import/no-extraneous-dependencies */

'use strict';

/**
 * Google OAuth 2.0
 *
 * You should read Using OAuth 2.0 to Access Google APIs:
 * https://developers.google.com/identity/protocols/OAuth2
 *
 * The implementation assumes the following environment variables:
 *
 *  - GOOGLE_CLIENT_ID
 *  - GOOGLE_CLIENT_SECRET
 *  - GOOGLE_CALLBACK_URL
 *  - ALLOWED_DOMAIN
 */

const passport = require('@passport-next/passport');
const GoogleOAuth2Strategy = require('@passport-next/passport-google-oauth2')
    .Strategy;

const  { User, AuthenticationRequired } = require('unleash-server');
// const { User, AuthenticationRequired } = require('../lib/server-impl.js');

var util = require('util')

passport.use(
    new GoogleOAuth2Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },

        (accessToken, refreshToken, profile, done) => {
            console.log(util.inspect(profile, {showHidden: false, depth: null}))
            if (profile._json.hd !== process.env.ALLOWED_DOMAIN) {
        done(new Error( "Only " + process.env.ALLOWED_DOMAIN + " domain is supported" ));
    } else {
            done(
                null,
                new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    imageUrl: profile.photos[0].value,
                }),
            );
    }

        },
    ),
);

function enableGoogleOauth(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
    app.get(
        '/api/admin/login',
        passport.authenticate('google', { scope: ['email'] }),
    );

    app.get(
        '/api/auth/callback',
        passport.authenticate('google', {
            failureRedirect: '/api/admin/error-login',
        }),
        (req, res) => {
            // Successful authentication, redirect to your app.
            res.redirect('/');
        },
    );

    app.use('/api/admin/', (req, res, next) => {
        if (req.user) {
            return next();
        }
        // Instruct unleash-frontend to pop-up auth dialog
        return res
            .status('401')
            .json(
                new AuthenticationRequired({
                    path: '/api/admin/login',
                    type: 'custom',
                    message: `You have to identify yourself in order to use Unleash. 
                        Click the button and follow the instructions.`,
                }),
            )
            .end();
    });
}

module.exports = enableGoogleOauth;
