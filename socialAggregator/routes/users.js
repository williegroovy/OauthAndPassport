var express = require('express');
var router = express.Router();
var facebook = require('../services/facebook')('874076809364847', 'c3d80bc063986541f23963bd32dd5bb1');
var twitter = require('../services/twitter')(
    '194303677-QlRfOOJzIFTCM627SfqEeelfQYaGO1vMAs0TOGM8', '9JgOzxXCSdVKp3nxOji5JChQwpuP9TIDhIH3WCizMouZe');

router.use('/', function(req, res, next) {

  if(!req.user) {
    res.redirect('/');
  }

  next();
});

router.use('/', function(req, res, next) {
  if(req.user.twitter) {
    /*twitter.verify((req.user.twitter.token, req.user.twitter.tokenSecret, function(results) {
      console.log('Results', results);
      req.user.twitter.lastPost = 'help';
      next();
    }));
    */
    twitter.getUserTimeLine(
        req.user.twitter.token,
        req.user.twitter.tokenSecret,
        req.user.twitter.id,
        function(results) {
          console.log('Results', results);
          req.user.twitter.lastPost = 'text'; //results[0].text;
          next();
      });
  }
});

router.get('/', function(req, res) {

  if(req.user.facebook) {
    facebook.getImage(req.user.facebook.token,
        function(results) {
          req.user.facebook.image = results.url;

          facebook.getFriends(req.user.facebook.token,
              function(results) {
                req.user.facebook.friends = results.total_count;

                res.render('users', {user: req.user});
          });
    });
  } else {
    res.render('users', {user: req.user});
  }
});

module.exports = router;
