var OAuth = require('OAuth').OAuth;

var Twitter = function(twitterKey, twitterSecret) {

    var key = twitterKey;
    var secret = twitterSecret;

    var oauth = new OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        key,
        secret,
        '1.0A',
        null,
        'HMAC-SHA1'
    );

    var getUserTimeLine = function(userKey, userSecret, userId, done) {

        oauth.get('https://twitter.com/1.1/statuses/user_timeline.json?user_id=' + userId, userKey, userSecret,
            function(error, results, res) {
                results = JSON.parse(results);
                done(results);
            });
    };

    var verify = function(userKey, userSecret, userId, done) {
        oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json', userKey, userSecret,
        function(error, results, res) {
            results = JSON.parse(results);
            done(results);
        });
    };

    return {
        getUserTimeLine: getUserTimeLine,
        verify: verify
    }
};

module.exports = Twitter;