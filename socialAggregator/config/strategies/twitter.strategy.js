var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../../models/userModel');

module.exports = function(){

    passport.use(new TwitterStrategy({
            consumerKey: '5D8oFiFVpykcOjYHiPcqCI4iX',
            consumerSecret: 'MSrpU4bVzozoIYkGbbeBTxxAZu926A15HN3vZNRkLa9RH0zh90',
            callbackURL: 'http://localhost:3000/auth/twitter/callback',
            passReqToCallback: true
        },
        function(req, token, tokenSecret, profile, done){

            if(req.user) {

                var query = {};
                if(req.user.google) {

                    var query = {'google.id': req.user.google.id};
                } else if(req.user.facebook) {

                    var query = {'facebook.id': req.user.facebook.id};
                }

                User.findOne(query, function(err, user) {

                    if(user) {
                        user.twitter = {};
                        user.twitter.id = profile.id;
                        user.twitter.token = token;
                        user.twitter.tokenSecret = tokenSecret;

                        user.save();
                        done(null, user);
                    }
                })
            } else {

                var query = {'twitter.id': profile.id};

                User.findOne(query, function (error, user) {

                    if (user) {

                        done(null, user);
                    } else {

                        var user = new User;
                        //user.email = profile.emails[0].value;
                        user.image = profile._json.profile_image_url;
                        user.displayName = profile.displayName;

                        user.twitter = {};
                        user.twitter.id = profile.id;
                        user.twitter.token = token;
                        user.twitter.tokenSecret = tokenSecret;

                        user.save();
                        done(null, user);
                    }
                });
            }

        }))
};