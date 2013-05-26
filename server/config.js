(function(){

    module.exports = {
        publicUrl: 'http://account-it.herokuapp.com',
        port: process.env.PORT || 8000,
        mongoUrl: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/accountItDb',
        staticDir: 'client',
        facebook: {
            appId: 283370531799932,
            secret: 'fa0370d332815cbc3dbb422df198beaf',
            callbackRoute: '/auth/facebook/callback'
        },
        sslKey: 'server/server-key.pem',
        sslCert: 'server/server-cert.pem'
    };

}());