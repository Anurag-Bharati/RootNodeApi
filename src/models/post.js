const { Schema, model } = require("mongoose");

const postSchema = new Schema(
    {
        postType: {
            type: String,
            enum: ["content", "markdown"],
            default: "content",
        },

        owner: {
            type: Schema.ObjectId,
            ref: "User",
            required: true,
        },

        caption: {
            type: String,
            maxlength: 512,
        },

        mediaFiles: [
            {
                url: String,
                mediaType: {
                    type: String,
                    enum: ["image", "video", "gif"],
                    default: "image",
                },
            },
        ],

        likesCount: {
            type: Number,
            default: 0,
        },

        commentsCount: {
            type: Number,
            default: 0,
        },

        sharesCount: {
            type: Number,
            default: 0,
        },

        postStatus: {
            type: String,
            enum: ["active", "deleted", "reported", "archived"],
            default: "active",
        },

        visibility: {
            type: String,
            enum: ["public", "private", "followers"],
            default: "public",
        },

        commentable: {
            type: Boolean,
            default: true,
        },

        likeable: {
            type: Boolean,
            default: true,
        },

        shareable: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Post = model("Post", postSchema);

module.exports = Post;
