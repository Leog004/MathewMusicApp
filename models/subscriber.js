const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({

    emailAddress: {
        type: String,
        unique: [true, 'You have already submitted your email!']
    },
    pageAdded:{
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }

});

const Subscriber = mongoose.model('Subscribers', subscriberSchema);

module.exports = Subscriber;
