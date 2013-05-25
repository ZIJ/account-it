(function(){

    'use strict';

    var mongoose = require('mongoose');
    var express = require('express');
    var fs = require('fs');
    var http = require('http');
    var https = require('https');
    var passport = require('passport');
    var FacebookStrategy = require('passport-facebook').Strategy;

    var port = process.env.PORT || 8000;
    var mongoUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/accountItDb';
    var staticDir = 'client';
    var sslKey = 'server/server-key.pem';
    var sslCert = 'server/server-cert.pem';


    var roomSchema = mongoose.Schema({
        name: String,
        operations: [{
            name: String,
            amount: Number,
            contributions: [{
                person: String,
                paidAmount: Number,
                ownsAmount: Number
            }]
        }]
    });

    var userSchema = mongoose.Schema({
        //TODO add email
        name: String,
        password: String,
        facebookId: String,
        rooms: []
    });

    var Room = mongoose.model('Room', roomSchema);

    var User = mongoose.model('User', userSchema);

    mongoose.connect(mongoUrl);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
        console.log('success');
    });

    passport.use(new FacebookStrategy({
            clientID: 283370531799932,
            clientSecret: 'fa0370d332815cbc3dbb422df198beaf',
            callbackURL: "http://account-it.herokuapp.com/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            console.log('Logged in ' + profile.displayName);
            done(null, profile.displayName);
        }
    ));

    var app = express();
    app.use(express.bodyParser());
    app.use(express.static(staticDir));

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

    app.get('/win', function(req, res){
        res.send('Login success');
    });

    app.get('/fail', function(req, res){
        res.send('Login fail');
    });

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
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

    var ssl = {
        key: fs.readFileSync(sslKey).toString(),
        cert: fs.readFileSync(sslCert).toString()
    };

    /*
     https.createServer(ssl, app).listen(port, function() {
     console.log("Account-it listening on " + port);
     });*/


    http.createServer(app).listen(port, function(){
        console.log("Account-it listening on " + port);
    });

}());



