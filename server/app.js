(function(){

    'use strict';

    var mongoose = require('mongoose');
    var express = require('express');
    var fs = require('fs');
    var http = require('http');
    var https = require('https');
    var passport = require('passport');
    var FacebookStrategy = require('passport-facebook').Strategy;

    var config = require('./config');

    var Room = require('./room');
    var User = require('./user');

    mongoose.connect(config.mongoUrl);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
        console.log('success');
    });


    /* Passport */

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


    /* Application */

    var app = express();

    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'greygoose' }));
    app.use(express.static(config.staticDir));


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


    /* Routing */

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

    app.get('/roomIds', function(req, res){
        console.log('all rooms requested');
        Room.find().select('_id').exec(function(err, selection){
            if (err, user) {
                res.send(500);
            } else {
                res.send(selection.map(function(obj){
                    return obj._id;
                }));
            }
        });
    });

    app.get('/room/:id', function(req, res){
        Room.findById(req.params.id, function(err, room){
            if (err){
                res.send(404);
            } else {
                res.send(room);
            }
        });
    });

    app.post('/room/:id', function(req, res){
        Room.findByIdAndUpdate(req.params.id, req.body, function(err, room){
            if (err){
                res.send(500);
            } else {
                res.send(room);
            }
        });
    });

    app.put('/room', function(req, res){
        var room = new Room(req.body);
        room.save(function(err){
            if (err) {
                res.send(500);
            } else {
                res.send(room);
            }
        });
    });

    app.del('/room/:id', function(req, res){
        Room.findById(req.params.id, function(err, room){
            if (err){
                res.send(500);
            } else {
                room.remove(function(err, room){
                    if (err) {
                        res.send(500);
                    } else {
                        res.send();
                    }
                });
            }
        });
    });


    /* Startup */

    http.createServer(app).listen(config.port, function(){
        console.log("Account-it listening on " + config.port);
    });

}());



