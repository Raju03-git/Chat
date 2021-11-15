const mongoose = require('mongoose');

let db = {};

/**
 * Connects to Database
 */
db.connect = () => {
    mongoose.connect('mongodb://localdbuser:K3b0L1l0ca1Da7aT3575T0r3@52.251.35.156:25217/TalenthubDevDb', { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('open', () => {
        console.log('Database Connected');
    });

    mongoose.connection.on('error', (err) => {
        console.log(`Database connection Error ${err}`);
    });
};

//db.Message = require('./schema/message');

module.exports = db;