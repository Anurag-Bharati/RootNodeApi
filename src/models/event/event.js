const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["virtual", "physical", "unknown"],
            default: "unknown",
        },

        runner: {
            type: Schema.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            maxlength: 128,
            trim: true,
            required: true,
        },
        subtitle: {
            type: String,
            maxlength: 128,
            trim: true,
        },

        location: { type: String, required: true },
        coordinates: { lat: String, lon: String },
        date: { type: Date, required: true },

        cover: String,
        logo: String,

        interested: {
            type: Number,
            default: 0,
        },
        attending: {
            type: Number,
            default: 0,
        },

        limit: { type: Number },
        housefull: { type: Boolean, default: false },
        status: {
            type: String,
            enum: [
                "active",
                "canceled",
                "postpond",
                "inactive",
                "ongoing",
                "housefull",
            ],
            default: "active",
        },

        visibility: {
            type: String,
            enum: ["public", "private", "followers"],
            default: "public",
        },
    },
    { timestamps: true }
);

const Event = model("Event", eventSchema);

module.exports = Event;
