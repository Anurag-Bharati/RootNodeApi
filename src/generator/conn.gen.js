const { Connection, User } = require("../models/models.wrapper");
const EntityFieldsFilter = require("../utils/entity.filter");
const ConnGen = {};

/* Conn */
const generateConnOverview = async (uid, constraints) => {
    let { limit } = constraints;
    limit = limit > 0 ? limit : 3;
    const count = await Connection.find({
        rootnode: uid,
    }).countDocuments();
    if (count == 0) return [[], [], 0];
    const [old, recent] = await Promise.all([
        Connection.find({
            rootnode: uid,
        })
            .sort("createdAt")
            .limit(limit)
            .populate("node", EntityFieldsFilter.USER),
        Connection.find({
            rootnode: uid,
        })
            .sort("-createdAt")
            .limit(limit)
            .populate("node", EntityFieldsFilter.USER),
        ,
    ]);
    return [old, recent.reverse(), count];
};

const generateRecommendedConns = async (uid, recom, constraints) => {
    let { limit } = constraints;
    limit = limit > 0 ? limit : 10;
    const myConns = await Connection.find({
        rootnode: uid,
    });
    connsWithOutMe = myConns.map((conn) => conn.node);
    await Promise.all(
        connsWithOutMe.map(async (user) => {
            const itsConns = await Connection.find({
                rootnode: user,
            })
                .limit(limit)
                .populate("rootnode node", EntityFieldsFilter.USER);
            connsWithOutHim = itsConns.map((conn) => conn.node);

            connsWithOutHim.forEach((conn) => {
                if (conn && !conn._id.equals(uid)) recom.push(conn);
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
                $and: [{ rootnode: uid }, { node: user }],
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
