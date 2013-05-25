
var mongoose = require('mongoose');
var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');

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

var Room = mongoose.model('Room', roomSchema);


mongoose.connect(mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('success');
});

var app = express();
app.use(express.bodyParser());
app.use(express.static(staticDir));

app.get('/', function(req, res){
    res.send('Account-it');
});

app.get('/roomIds', function(req, res){
    console.log('all rooms requested');
    Room.find().select('_id').exec(function(err, selection){
        if (err) {
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

https.createServer(ssl, app).listen(port, function() {
    console.log("Account-it listening on " + port);
});

/*
http.createServer(app).listen(port, function(){
    console.log("Account-it listening on " + port);
});*/

