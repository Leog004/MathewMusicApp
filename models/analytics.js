const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    ipAddress: {
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
});

const Analy = mongoose.model('Analytics', analyticsSchema);

module.exports = Analy;
