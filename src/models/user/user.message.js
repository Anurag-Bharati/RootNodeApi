const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
    {
        from: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        to: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        text: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const Message = model("Message", messageSchema);
module.exports = Message;
