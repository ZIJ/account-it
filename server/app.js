(function(){

    'use strict';

    var mongoose = require('mongoose');
    var express = require('express');
    var http = require('http');

    var config = require('./config');

    mongoose.connect(config.mongoUrl);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
        console.log('success');
    });

    var app = express();

    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'greygoose' }));
    app.use(express.static(config.staticDir));


    require('./apis/roomApi')(app);
    require('./apis/authApi')(app);


    http.createServer(app).listen(config.port, function(){
        console.log("Account-it 2.0 listening on " + config.port);
    });

}());