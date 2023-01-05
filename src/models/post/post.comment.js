const { Schema, model } = require("mongoose");

const postCommentSchema = new Schema(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        comment: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            enum: ["text", "media", "mixed"],
            default: "text",
        },

        media: {
            url: String,
            mediaType: {
                type: String,
                enum: ["image", "gif"],
                default: "image",
            },
        },

        likesCount: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["active", "deleted", "reported", "archived"],
            default: "active",
        },
    },
    { timestamps: true }
);

const PostComment = model("PostComment", postCommentSchema);

module.exports = PostComment;
