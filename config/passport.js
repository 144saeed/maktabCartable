const database = require('./dataBase.js');
const hasher = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;


// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        done(null, id);
    });
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {
            database.checkForUserPassword(username, (err, results, fields) => {
                if (err) {
                    return done(err);
                }
                if (results == undefined) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                hasher.compare(password, results[0].password, (err, ans) => {
                    if (!ans) {
                        return done(null, false, req.flash('loginMessage', 'wrong password.'));
                    } else
                        return done(null, results[0]);
                })
            });
        }));

};