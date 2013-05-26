(function(){

    var Room = require('./../models/room');

    module.exports = function(app){

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
    }
}());