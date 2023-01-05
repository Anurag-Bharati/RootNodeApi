const { Schema, model } = require("mongoose");

const postCommentLikeSchema = new Schema(
    {
        comment: {
            type: Schema.Types.ObjectId,
            ref: "PostComment",
            required: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const PostCommentLike = model("PostCommentLike", postCommentLikeSchema);

module.exports = PostCommentLike;
