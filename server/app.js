(function(){

    'use strict';

    /* Third-party dependencies */

    var mongoose = require('mongoose');
    var express = require('express');
    var http = require('http');

    /* In-project dependencies */

    var config = require('./config');


    /* Persistance */

    mongoose.connect(config.mongoUrl);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
        console.log('success');
    });


    /* App stack initialization */

    var app = express();

    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'greygoose' }));  //TODO move secret to config
    app.use(express.static(config.staticDir));


    /* API endpoints */

    require('./apis/roomApi')(app);
    require('./apis/authApi')(app);


    /* Server startup */

    http.createServer(app).listen(config.port, function(){
        console.log("Account-it 2.0 listening on " + config.port);
    });

}());