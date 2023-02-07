const { Schema, model } = require("mongoose");

const eventInterestedSchema = Schema(
    {
        event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
        interested: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const EventInterested = model("EventInterested", eventInterestedSchema);
module.exports = EventInterested;
