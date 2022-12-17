const { Schema, model } = require("mongoose");

const postSchema = new Schema(
    {
        postType: {
            type: String,
            enum: ["content", "event", "markdown"],
            default: "content",
        },

        owner: {
            type: mongoose.Schema.ObjectId,
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

        allowComments: {
            type: Boolean,
            default: true,
        },

        allowLikes: {
            type: Boolean,
            default: true,
        },

        allowShare: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Post = model("Post", postSchema);

module.exports = Post;
