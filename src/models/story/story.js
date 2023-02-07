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

        quote: {
            type: String,
            maxlength: 5000,
            trim: true,
        },
        color: { type: Number, default: 0xff00bcd4 },
        media: {
            url: String,
            type: {
                type: String,
                enum: ["image", "video"],
            },
        },

        likesCount: {
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
            enum: ["public", "private", "mutual"],
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
