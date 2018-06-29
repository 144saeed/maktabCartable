var express = require('express');
var fs=require('fs');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {

  
  res.sendFile(global.RootDirectory+'/views/login.html', { title: 'Express' });
});
router.get('/dashboard', function(req, res, next) {
  res.send('dashboard', { title: 'Express' });
});
router.get('/roll',isLoggedIn, function(req, res, next) {

  res.sendFile(global.RootDirectory+'/views/roll.html', { title: 'Express' });
});
router.get('/layout', function(req, res, next) {
  res.render('layout');
});


function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}


module.exports = router;
