(function(){
    var mongoose = require('mongoose');

    var roomSchema = mongoose.Schema({
        name: String,
        email: String,
        password: String,
        confirmationId: String,
        confirmed: Boolean,
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