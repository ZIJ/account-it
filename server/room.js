(function(){
    var mongoose = require('mongoose');

    var userSchema = mongoose.Schema({
        //TODO add email
        name: String,
        password: String,
        facebookId: String,
        rooms: []
    });

    module.exports = mongoose.model('User', userSchema);

}());