const mongoose = require('mongoose');
const slugify = require('slugify');

const musicSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, 'Every Song must have a title'],
        unique: true
    },
    slug: String,
    description: {
        type: String
    },
    youtubeURL:{
        type: String 
    },
    spotifyURL:{
        type: String 
    },
    iTunesURL: {
        type: String 
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    }
});

musicSchema.pre('save', function(next){
    this.slug = slugify(this.title, {lower : true});
    next();
});


const Music = mongoose.model('Music', musicSchema);

module.exports = Music;
