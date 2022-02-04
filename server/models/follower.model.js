const mongoose = require('mongoose');

const FollowerSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: [true, "User ID is required"]
    },

    profileID: {
        type: String,
        required: [true, "Profile ID is required"]
    },

}, { timestamps: true });

module.exports.Follower = mongoose.model('Follower', FollowerSchema);