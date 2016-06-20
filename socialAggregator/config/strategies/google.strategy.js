var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../../models/userModel');

module.exports = function() {
    
    passport.use(new GoogleStrategy({
            clientID: '1044587912586-0jocc703gmbrjrjl07rfs4lt4s41k79f.apps.googleusercontent.com',
            clientSecret: 'zDs79SYo_KTZ16YomD3K5Sdo',
            callbackURL: 'http://localhost:3000/auth/google/callback'
        },
        function (req, accessToken, refreshToken, profile, done) {

            if(req.user) {

                var query = {};
                if(req.user.twitter) {

                    var query = {'twitter.id': req.user.twitter.id};
                } else if(req.user.facebook) {

                    var query = {'facebook.id': req.user.facebook.id};
                }

                User.findOne(query, function(err, user) {

                    if(user) {
                        user.google = {};
                        user.google.id = profile.id;
                        user.google.token = accessToken;

                        user.save();
                        done(null, user);
                    }
                })
            } else {

                var query = {'google.id': profile.id};

                User.findOne(query, function (error, user) {

                    if (user) {

                        done(null, user);
                    } else {

                        var user = new User;

                        user.email = profile.emails[0].value;
                        user.image = profile._json.image.url;
                        user.displayName = profile.displayName;

                        user.google = {};
                        user.google.id = profile.id;
                        user.google.token = accessToken;

                        user.save();
                        done(null, user);
                    }
                });
            }
        }
    ));
};

