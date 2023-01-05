const { Schema, model } = require("mongoose");

const authTokenSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        issuedAt: {
            type: Number,
            required: true,
        },
        expiresAt: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const AuthToken = model("AuthToken", authTokenSchema);

module.exports = AuthToken;
