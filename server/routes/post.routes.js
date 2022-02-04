const PostController = require('../controllers/post.controller');
const { authenticate } = require('../config/jwt.config');

module.exports = function (app) {
    app.get('/api/posts/:id', authenticate, PostController.getFollowedPosts);
    app.get('/api/profileposts/:id', authenticate, PostController.getProfilePosts);
    app.get('/api/post/:id', authenticate, PostController.getPost);
    app.post('/api/posts', authenticate, PostController.createPost);
    app.put('/api/post/:id', authenticate, PostController.updatePost);
    app.delete('/api/post/:id', authenticate, PostController.deletePost);
}