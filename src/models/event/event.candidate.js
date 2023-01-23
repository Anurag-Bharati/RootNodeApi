const { Schema, model } = require("mongoose");

const eventCandidateSchema = Schema(
    {
        event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
        candidate: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: {
            type: String,
            enum: ["audience", "speaker", "guest", "volunteer", "management"],
            default: "audience",
        },
    },
    { timestamps: true }
);

const EventCandidate = model("EventCandidate", eventCandidateSchema);
module.exports = EventCandidate;
