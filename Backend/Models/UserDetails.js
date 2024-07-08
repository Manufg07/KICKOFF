const mongoose = require('mongoose');
const { Schema } = mongoose;

// User schema and model
const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    fav_team1 :{
        type: String,
        required: false,
        trim: true,
    },
    fav_player : {
        type: String,
        required: false,
        trim: true,
    },    
    profilePicture: { type: String },
    friendsCount: { type: Number, default: 0 }
    },
    {
        timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
