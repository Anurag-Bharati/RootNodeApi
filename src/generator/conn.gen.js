const { Connection } = require("../models/models.wrapper");
const EntityFieldsFilter = require("../utils/entity.filter");
const ConnGen = {};

/* Conn */
const generateConnOverview = async (uid, constraints) => {
    let { limit } = constraints;
    limit = limit > 0 ? limit : 3;
    return await Promise.all([
        Connection.find({
            $or: [{ rootnode: uid }, { node: uid }],
            status: "accepted",
        })
            .sort({ createdAt: 1 })
            .limit(limit)
            .populate(["rootnode", "node"], EntityFieldsFilter.USER),
        Connection.find({
            $or: [{ rootnode: uid }, { node: uid }],
            status: "accepted",
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate(["rootnode", "node"], EntityFieldsFilter.USER),
        ,
    ]);
};

ConnGen.generateConnOverview = generateConnOverview;

module.exports = ConnGen;
