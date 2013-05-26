(function(){
    var mongoose = require('mongoose');

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

    module.exports = mongoose.model('Room', roomSchema);

}());