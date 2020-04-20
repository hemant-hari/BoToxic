var mongoose = require('mongoose');
var config = require('./config');
var userGetter = require('./models/user');

var User = userGetter(mongoose);

mongoose.connect(config.url, { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to MongoDB Server")
});

module.exports = mongoose;
module.exports.db = db;