'use strict'
const path = require('path')
const unleash = require('unleash-server')
const passport = require('passport')
const GoogleOAuth2Strategy = require('passport-google-oauth20').Strategy
const { inspect } = require('util')
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
// should end with `'/api/auth/callback'` to match router
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || ''
const sharedSecret = process.env.SHARED_SECRET || ''
const allowedUsers = new RegExp(process.env.ALLOWED_USERS_REGEX)
const enableGoogleLogin = !!GOOGLE_CLIENT_ID

if (enableGoogleLogin) {
  passport.use(
    new GoogleOAuth2Strategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: 'email',
      },
      (accessToken, refreshToken, profile, cb) => {
        cb(
          null,
          new unleash.User({
            name: profile.displayName,
            email: profile.emails[0].value,
          })
        )
      }
    )
  )
}

function googleAdminAuth(app) {
  app.use((req, res, next) => {
    next()
  })
  if (!enableGoogleLogin) return
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => done(null, user))
  app.get(
    '/api/admin/login',
    passport.authenticate('google', { scope: ['email'] })
  )

  app.get(
    '/api/auth/callback',
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/api/admin/error-login',
    })
  )

  app.get('/api/admin/error-login', (req, res) => {
    return res
      .status('401')
      .json(
        new unleash.AuthenticationRequired({
          path: '/api/admin/login',
          type: 'custom',
          message: `There was an error authenticating.`,
        })
      )
      .end()
  })

  app.use('/api/admin/', (req, res, next) => {
    let emailNotAllowedError = ''
    if (req.user && req.user.email && req.user.email.match(allowedUsers)) {
      return next()
    } else {
      emailNotAllowedError =
        'Your email was not on the approved email list. Check with your administrator.'
    }
    // Instruct unleash-frontend to pop-up auth dialog
    return res
      .status('401')
      .json(
        new unleash.AuthenticationRequired({
          path: '/api/admin/login',
          type: 'custom',
          message:
            emailNotAllowedError ||
            `You have to identify yourself in order to use Unleash.
                      Click the button and follow the instructions.`,
        })
      )
      .end()
  })
}

const options = enableGoogleLogin
  ? {
      enableLegacyRoutes: false,
      adminAuthentication: 'custom',
      preRouterHook: googleAdminAuth,
    }
  : {}

unleash.start(options).then((instance) => {
  console.log(`Unleash started on http://localhost:${instance.app.get('port')}`)
})
