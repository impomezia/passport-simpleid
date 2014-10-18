/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The SimpleID authentication strategy authenticates requests by delegating to
 * https://schat.me using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your SimpleID application's client id
 *   - `clientSecret`  your SimpleID application's client secret
 *   - `callbackURL`   URL to which SimpleID will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new SimpleIdStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/simpleid/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://id.schat.me/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://id.schat.me/oauth/access_token';
  options.scopeSeparator = options.scopeSeparator || ',';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'simpleid';
  this._userProfileURL = options.userProfileURL || 'https://api.schat.me/1/user';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from SimpleID.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `simpleid`
 *   - `id`               the user's SimpleID
 *   - `displayName`      the user's full name
 *   - `profileUrl`       the URL of the profile for the user on id.schat.me
 *   - `emails`           the user's email addresses
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2._useAuthorizationHeaderForGET = true;
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    if (err) {
      done(new InternalOAuthError('failed to fetch user profile', err));
      return;
    }

    try {
      var json = JSON.parse(body);
      json = json.data;

      var profile = { provider: 'simpleid' };
      profile.id          = json.id;
      profile.displayName = json.name;
      profile.profileUrl  = json.link;
      profile.emails      = [{ value: json.email }];

      profile._raw  = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
