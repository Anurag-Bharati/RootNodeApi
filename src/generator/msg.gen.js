const Message = require("../models/user/user.message");

async function genRecentMessages(rootnode, msgPerPage, page) {
    const match = {
        $match: {
            $or: [{ to: rootnode._id }, { from: rootnode._id }],
        },
    };
    const lookup = {
        $lookup: {
            from: "users",
            localField: "from",
            foreignField: "_id",
            as: "fromUser",
        },
    };
    const group = {
        $group: {
            _id: {
                $cond: {
                    if: { $eq: ["$to", rootnode._id] },
                    then: "$from",
                    else: "$to",
                },
            },
            message: { $first: "$$ROOT" },
            fromUser: { $first: "$fromUser" },
        },
    };
    const sort = {
        $sort: { "message.createdAt": -1 },
    };
    const skip = {
        $skip: (page - 1) * msgPerPage,
    };
    const limit = {
        $limit: msgPerPage,
    };
    const project = {
        $project: {
            to: "$message.to",
            from: "$message.from",
            text: "$message.text",
            createdAt: "$message.createdAt",
            fromUser: { $arrayElemAt: ["$fromUser", 0] },
        },
    };

    const pipeline = [match, lookup, group, sort, skip, limit, project];
    const recentMessages = await Message.aggregate(pipeline).exec();
    return recentMessages;
}

const MsgGen = {};
MsgGen.genRecentMessages = genRecentMessages;
module.exports = MsgGen;
