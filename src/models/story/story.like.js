const { Schema, model } = require("mongoose");

const storyLikeSchema = new Schema(
    {
        story: {
            type: Schema.Types.ObjectId,
            ref: "Story",
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

const StoryLike = model("StoryLike", storyLikeSchema);

module.exports = StoryLike;
