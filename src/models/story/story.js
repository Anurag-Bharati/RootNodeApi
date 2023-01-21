const { Schema, model } = require("mongoose");

const storySchema = new Schema(
    {
        type: {
            type: String,
            enum: ["text", "media", "mixed"],
            default: "text",
        },

        owner: {
            type: Schema.ObjectId,
            ref: "User",
            required: true,
        },

        heading: {
            type: String,
            maxlength: 128,
            trim: true,
        },

        media: {
            type: {
                url: String,
                type: {
                    type: String,
                    enum: ["image", "video"],
                    default: "image",
                },
            },
        },

        likeCount: {
            type: Number,
            default: 0,
        },

        watchCount: {
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

        likeable: {
            type: Boolean,
            default: true,
        },

        seenBy: [{ type: Schema.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

const Story = model("Story", storySchema);

module.exports = Story;
