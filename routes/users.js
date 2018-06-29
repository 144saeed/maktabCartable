
var express = require('express');
var router = express.Router();
var passport=require('passport');
require('../config/passport')(passport);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource Test');
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/roll', // redirect to the secure profile section
  failureRedirect : '/'
}),
function(req, res) {
  console.log("here");
});


module.exports = router;
