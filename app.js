// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
    if(!err) {
        console.log("We are connected");
    } else {
        console.log(err);
    }
    var collection = db.collection('test');
    var docs = [{
        foo: 'bar1'
    },{
        foo: 'bar2'
    }];
    collection.insert(docs, {w: 1}, function(err, result){
        console.log(result);
        var all = collection.find().toArray(function(err, items){
            console.log(items);
        });
    });
});