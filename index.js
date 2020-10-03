"use strict";
const { join } = require("path");
const unleash = require("unleash-server");
const passport = require("passport");
const GoogleOAuth2Strategy = require("passport-google-oauth20").Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
// should end with `'/api/auth/callback'` to match router
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "";
const allowedUsers = new RegExp(process.env.ALLOWED_USERS_REGEX);
const enableGoogleLogin = !!GOOGLE_CLIENT_ID;
const baseUriPath = process.env.BASE_URI_PATH || "/";
const getPath = (s) => {
  console.log("route: ", "/" + join(baseUriPath, s));
  return "/" + join(baseUriPath, s);
};
if (enableGoogleLogin) {
  passport.use(
    new GoogleOAuth2Strategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: "email",
      },
      (accessToken, refreshToken, profile, cb) => {
        cb(
          null,
          new unleash.User({
            name: profile.displayName,
            email: profile.emails[0].value,
          })
        );
      }
    )
  );
}

function googleAdminAuth(app) {
  if (!enableGoogleLogin) return console.warn("Google login is not enabled");
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
  app.get(
    getPath("admin/login"),
    passport.authenticate("google", { scope: ["email"] })
  );

  app.get(
    getPath("auth/callback"),
    passport.authenticate("google", {
      successRedirect: getPath("/"),
      failureRedirect: getPath("admin/error-login"),
    })
  );

  app.get(getPath("admin/error-login"), (req, res) => {
    return res
      .status("401")
      .json(
        new unleash.AuthenticationRequired({
          path: getPath("admin/login"),
          type: "custom",
          message: `There was an error authenticating.`,
        })
      )
      .end();
  });

  app.use(getPath("admin/"), (req, res, next) => {
    let emailNotAllowedError = "";
    let showInvalidEmailError = !!(req.user && req.user.email);
    if (req.user && req.user.email && req.user.email.match(allowedUsers)) {
      return next();
    } else {
      emailNotAllowedError =
        "Your email was not on the approved email list. Check with your administrator.";
    }
    // Instruct unleash-frontend to pop-up auth dialog
    return res
      .status("401")
      .json(
        new unleash.AuthenticationRequired({
          path: getPath("admin/login"),
          type: "custom",
          message: showInvalidEmailError
            ? emailNotAllowedError
            : `You have to identify yourself in order to use Unleash.
                      Click the button and follow the instructions.`,
        })
      )
      .end();
  });
}

const sharedSecret = process.env.SHARED_SECRET || "";
function presharedClientAuth(app) {
  if (!sharedSecret)
    return console.warn(`No shared secret, ${getPath("client")} is insecure`);
  app.use(getPath("client"), (req, res, next) => {
    if (req.header("authorization") !== sharedSecret) {
      res.sendStatus(401);
    } else {
      next();
    }
  });
}

const options =
  enableGoogleLogin || sharedSecret
    ? {
        enableLegacyRoutes: false,
        adminAuthentication: "custom",
        baseUriPath,
        preRouterHook: prestartAll(googleAdminAuth, presharedClientAuth),
      }
    : {};

unleash.start(options).then((instance) => {
  console.log(
    `Unleash started on http://localhost:${instance.app.get("port")}`
  );
});

function prestartAll(...callbacks) {
  return (app) => {
    callbacks.forEach((fn) => fn(app));
  };
}
