# Passport-SimpleID

[Passport](http://passportjs.org/) strategy for authenticating with [SimpleID](https://id.schat.me)
using the OAuth 2.0 API.

This module lets you authenticate using SimpleID in your Node.js applications.
By plugging into Passport, SimpleID authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Usage

#### Configure Strategy

The SimpleID authentication strategy authenticates users using a SimpleID account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

    passport.use(new SimpleIdStrategy({
        clientID: SIMPLEID_CLIENT_ID,
        clientSecret: SIMPLEID_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/simpleid/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ simpleId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'simpleid'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/simpleid',
      passport.authenticate('simpleid'));

    app.get('/auth/simpleid/callback', 
      passport.authenticate('simpleid', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 Alexander Sedov <[https://schat.me/](https://schat.me/)>
Copyright (c) 2011-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>

