(function(){
    var mongoose = require('mongoose');

    var userSchema = mongoose.Schema({
        name: String,
        password: String,
        facebookId: String,
        rooms: []
    });

    module.exports = mongoose.model('User', userSchema);

}());