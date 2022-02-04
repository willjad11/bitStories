const UserController = require('../controllers/user.controller');
const { authenticate } = require('../config/jwt.config');

module.exports = function (app) {
    app.post("/api/register", UserController.register);
    app.post("/api/login", UserController.login);
    app.get("/api/users/:id", authenticate, UserController.getOne);
    app.get("/api/followedusers/:id", authenticate, UserController.getFollowedUsers);
    app.get("/api/followers/:id", authenticate, UserController.getFollowers);
    app.put("/api/users/:id", authenticate, UserController.updateUser);
    app.get("/api/logout", authenticate, UserController.logout);
}