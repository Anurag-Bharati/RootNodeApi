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
/* CONN MODEL */
models.Connection = require("./user/user.connection");
/* STORY MODEL */
models.Story = require("./story/story");
models.StoryLike = require("./story/story.like");
/* EVENT MODEL */
models.Event = require("./event/event");
models.EventInterested = require("./event/event.interested");
models.EventCandidate = require("./event/event.candidate");

module.exports = models;
