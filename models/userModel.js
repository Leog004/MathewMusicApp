const crypto = require('crypto');
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Every User must have a name']
    },
    slug: String,
    email: {
        type: String,
        required: [true, 'Every user must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide an password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String, 
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on create or save!!
            validator: function(el){
                return el === this.password;
            },
            message: 'Password is not the same!'
        }
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    active:{
        type: Boolean,
        default: true,
        select: false
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    }
});


userSchema.pre('save', async function(next) {
    
    // Only run this function if the password was modified
    if(!this.isModified('password')) return next();

    // Hash the password with the cost of 12   
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });


userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestap = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestap;
    }

    return false;
}


userSchema.methods.createPasswordResetToken = function(){

    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};


userSchema.pre(/^find/, function(next) {
    // this points to the current user
    this.find({active: {$ne: false}});
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;