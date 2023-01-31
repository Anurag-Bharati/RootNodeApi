const { Connection, User } = require("../models/models.wrapper");
const EntityFieldsFilter = require("../utils/entity.filter");
const ConnGen = {};

/* Conn */
const generateConnOverview = async (uid, constraints) => {
    let { limit } = constraints;
    limit = limit > 0 ? limit : 3;
    const count = await Connection.find({
        $or: [{ rootnode: uid }, { node: uid }],
        status: "accepted",
    }).countDocuments();

    if (count == 0) return [[], [], 0];
    const [old, recent] = await Promise.all([
        Connection.find({
            $or: [{ rootnode: uid }, { node: uid }],
            status: "accepted",
        })
            .sort("-createdAt")
            .limit(limit)
            .populate("rootnode node", EntityFieldsFilter.USER),
        Connection.find({
            $or: [{ rootnode: uid }, { node: uid }],
            status: "accepted",
        })
            .sort("createdAt")
            .limit(limit)
            .populate("rootnode node", EntityFieldsFilter.USER),
        ,
    ]);
    return [old, recent, count];
};

const generateRecommendedConns = async (uid, recom, constraints) => {
    let { limit } = constraints;
    limit = limit > 0 ? limit : 10;
    const myConns = await Connection.find({
        $or: [{ rootnode: uid }, { node: uid }],
        status: "accepted",
    });
    connsWithOutMe = myConns.map((conn) =>
        conn.rootnode.equals(uid) ? conn.node : conn.rootnode
    );
    await Promise.all(
        connsWithOutMe.map(async (user) => {
            const itsConns = await Connection.find({
                $or: [{ rootnode: user }, { node: user }],
                status: "accepted",
            })
                .limit(limit)
                .populate("rootnode node", EntityFieldsFilter.USER);
            connsWithOutHim = itsConns.map((conn) => {
                const x = conn.rootnode.equals(user)
                    ? conn.node
                    : conn.rootnode;
                return x.equals(uid) ? null : x;
            });

            connsWithOutHim.forEach((conn) => {
                if (conn) recom.push(conn);
            });
        })
    );
};

const generateRandomConns = async (uid, randcom, constraints) => {
    let { limit } = constraints;
    limit = limit > 0 ? limit : 10;
    const all = await User.find().select(EntityFieldsFilter.USER);
    await Promise.all(
        all.map(async (user) => {
            hasConn = await Connection.exists({
                $or: [
                    { $and: [{ rootnode: uid }, { node: user }] },
                    { $and: [{ node: uid }, { rootnode: user }] },
                ],
            });
            if (!hasConn) {
                if (!user._id.equals(uid)) randcom.push(user);
            }
        })
    );
};

ConnGen.generateConnOverview = generateConnOverview;
ConnGen.generateRecommendedConns = generateRecommendedConns;
ConnGen.generateRandomConns = generateRandomConns;

module.exports = ConnGen;
