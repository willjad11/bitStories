const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    postContent: {
        type: String,
        required: [true, "Post content is required"],
        minlength: [2, "Post must be 2 characters or longer"],
        maxlength: [200, "Post must be 200 characters or less"]
    },

    authorID: {
        type: String,
        required: [true, "Author ID is required"]
    },

}, { timestamps: true });

module.exports.Post = mongoose.model('Post', PostSchema);