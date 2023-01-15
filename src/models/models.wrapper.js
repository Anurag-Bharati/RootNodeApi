const models = {};

/* USER MODEL */
models.User = require("./user/user");
models.Profile = require("./user/user.profile");
models.UserSession = require("./user/user.sessions");
/* POST MODEL */
models.Post = require("./post/post");
models.PostLike = require("./post/post.like");
models.PostComment = require("./post/post.comment");
models.PostCommentLike = require("./post/post.comment.like");

module.exports = models;
