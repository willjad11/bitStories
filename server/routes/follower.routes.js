const FollowerController = require('../controllers/follower.controller');
const { authenticate } = require('../config/jwt.config');

module.exports = function (app) {
    app.get('/api/followers', authenticate, FollowerController.getAllFollowers);
    app.post('/api/follower', authenticate, FollowerController.getFollower);
    app.post('/api/followers', authenticate, FollowerController.createFollower);
    app.delete('/api/follower/:id', authenticate, FollowerController.deleteFollower);
}