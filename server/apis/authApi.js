(function(){

    var passport = require('passport');
    var FacebookStrategy = require('passport-facebook').Strategy;
    var User = require('./../models/user');
    var config = require('./../config');

    passport.use(new FacebookStrategy({
            clientID: config.facebook.appId,
            clientSecret: config.facebook.secret,
            callbackURL: config.publicUrl + config.facebook.callbackRoute
        },
        function(accessToken, refreshToken, profile, done) {
            console.log('Logged in ' + profile.displayName);
            done(null, profile.displayName);
        }
    ));

    module.exports = function(app){

        app.get('/win', function(req, res){
            res.send('Login success');
        });

        app.get('/fail', function(req, res){
            res.send('Login fail');
        });

        app.get('/auth/facebook', passport.authenticate('facebook'));

        app.get(config.facebook.callbackRoute,
            passport.authenticate('facebook', {
                successRedirect: '/win',
                failureRedirect: '/fail'
            }));

        app.post('/signup', function(req, res){
            User.findOne({ name: req.body.name }, function(err, user){
                if(user){
                    res.status(422).send('Username taken');
                } else {
                    user = new User({
                        name: req.body.name,
                        password: req.body.password
                    });
                    user.save(function(err, user){
                        if (err) {
                            res.status(500).send('Saving user failed');
                        } else {
                            res.send(user._id);
                        }
                    });
                }
            });
            var user = new User({
                name: req.body.name,
                password: req.body.password
            })
        });



    }
}());