var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var User = require('../../models/userModel');

module.exports = function () {
    passport.use(new FacebookStrategy({
            clientID: '874076809364847',
            clientSecret: 'c3d80bc063986541f23963bd32dd5bb1',
            callbackURL: 'http://localhost:3000/auth/facebook/callback',
            passReqToCallback: true
        },
        function (req, accessToken, refreshToken, profile, done) {

            if(req.user) {

                var query = {};
                if(req.user.google) {

                    var query = {'google.id': req.user.google.id};
                } else if(req.user.twitter) {

                    var query = {'twitter.id': req.user.twitter.id};
                }

                User.findOne(query, function(err, user) {

                    if(user) {
                        user.facebook = {};
                        user.facebook.id = profile.id;
                        user.facebook.token = accessToken;

                        user.save();
                        done(null, user);
                    }
                })
            } else {

                var query = {'facebook.id': profile.id};

                User.findOne(query, function (error, user) {

                    if (user) {

                        done(null, user);
                    } else {

                        var user = new User;

                        //user.email = profile.emails[0].value;
                        //user.image = profile._json.image.url;
                        user.displayName = profile.displayName;

                        user.facebook = {};
                        user.facebook.id = profile.id;
                        user.facebook.token = accessToken;

                        user.save();
                        done(null, user);
                    }
                })
            }
        }));
};