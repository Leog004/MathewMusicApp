const mongoose = require('mongoose');
const slugify = require('slugify');

const musicSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, 'Every Song must have a title'],
        unique: true
    },
    slug: String,
    lyrics: {
        type: String
    },
    image: {
        type: String
    },
    album:{ String},
    DateReleased: { String},
    HashTags: [String],
    spotifyURL:{
        type: String 
    },
    onHomePage: Boolean,
    show: Boolean,
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
