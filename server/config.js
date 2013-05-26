(function(){

    module.exports = {
        port: process.env.PORT || 8000,
        mongoUrl: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/accountItDb',
        staticDir: 'client',
        sslKey: 'server/server-key.pem',
        sslCert: 'server/server-cert.pem'
    };

}());