const models = {};

/* USER MODEL */
models.User = require("./user/user");
models.Profile = require("./user/user.profile");
models.AuthToken = require("./user/user.authtoken");
/* POST MODEL */
models.Post = require("./post/post");
models.PostLike = require("./post/post.like");
models.PostComment = require("./post/post.comment");
models.PostCommentLike = require("./post/post.comment.like");

models.Connection = require("./user/user.connection");

module.exports = models;
