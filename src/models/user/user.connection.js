const { Schema, model } = require("mongoose");

const connectionSchema = new Schema(
    {
        //user
        rootnode: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // follower
        node: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Connection = model("Connection", connectionSchema);
module.exports = Connection;
