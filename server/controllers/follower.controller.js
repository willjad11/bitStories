const { Follower } = require('../models/follower.model');

module.exports.createFollower = async (request, response) => {
    const followCheck = await Follower.findOne(request.body);
    if (followCheck === null) {
        Follower.create(request.body)
        .then(follower => response.json(follower))
        .catch(err => response.status(400).json(err));
    }
    else {
        return response.status(400).json({ errors: { follower: { message: "You already followed this user" } } });
    }
}

module.exports.getAllFollowers = (request, response) => {
    Follower.find({})
        .then(follower => response.json(follower))
        .catch(err => response.json(err));
}

module.exports.getFollower = (request, response) => {
    Follower.findOne(request.body)
        .then(follower => response.json(follower))
        .catch(err => response.status(400).json(err));
}

module.exports.deleteFollower = (request, response) => {
    Follower.deleteOne({ _id: request.params.id })
        .then(deleteConfirmation => response.json(deleteConfirmation))
        .catch(err => response.json(err))
}