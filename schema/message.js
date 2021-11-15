var mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    message: String,
    room: String,
    time: String,
    sentAt: {
        type: Date,
        default: Date.now
    },
    author: String,
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Message', userSchema);
