const { Post } = require('../models/post.model');
const { Follower } = require('../models/follower.model');

module.exports.createPost = (request, response) => {
    Post.create(request.body)
        .then(post => response.json(post))
        .catch(err => response.status(400).json(err));
}

module.exports.getAllPosts = (request, response) => {
    Post.find({})
        .then(post => response.json(post))
        .catch(err => response.json(err));
}

module.exports.getPost = (request, response) => {
    Post.findOne({ _id: request.params.id })
        .then(post => response.json(post))
        .catch(err => response.json(err))
}

module.exports.getFollowedPosts = (request, response) => {
    Follower.find({ userID: request.params.id })
        .then((follower) => {
            followedUsers = [];
            for (item of follower) {
                followedUsers.push(item.profileID)
            }
            Post.find({ authorID: { $in: followedUsers } }).sort({ "createdAt": -1 })
                .then(posts => response.json(posts))
                .catch(err => response.json(err))
            }
        )
        .catch(err => response.json(err))
}

module.exports.getProfilePosts = (request, response) => {
    Post.find({ authorID: request.params.id }).sort({ "createdAt": -1 })
        .then(post => response.json(post))
        .catch(err => response.json(err))
}

module.exports.updatePost = (request, response) => {
    Post.findOneAndUpdate({ _id: request.params.id }, request.body, { new: true, runValidators: true })
        .then(updatedPost => response.json(updatedPost))
        .catch(err => response.status(400).json(err))
}

module.exports.deletePost = (request, response) => {
    Post.deleteOne({ _id: request.params.id })
        .then(deleteConfirmation => response.json(deleteConfirmation))
        .catch(err => response.json(err))
}