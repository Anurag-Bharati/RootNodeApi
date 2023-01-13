const { Schema, model } = require("mongoose");

const mediaLimit = (val) => {
    return val.length <= 10;
};

const postSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["text", "media", "mixed", "markdown"],
            default: "text",
        },

        owner: {
            type: Schema.ObjectId,
            ref: "User",
            required: true,
        },

        caption: {
            type: String,
            maxlength: 512,
            trim: true,
        },

        isMarkdown: {
            type: Boolean,
            default: false,
        },

        mediaFiles: {
            type: [
                {
                    url: String,
                    type: {
                        type: String,
                        enum: ["image", "video"],
                        default: "image",
                    },
                },
            ],
            validate: [mediaLimit, "{PATH} exceeds the limit of 10"],
        },

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

        status: {
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
