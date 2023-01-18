const { Connection, User } = require("../models/models.wrapper");
const { IllegalArgumentException } = require("../throwable/exception.rootnode");

/* constraints start*/
const connPerPage = 5;
const commentsPerPage = 5;
const likerPerPage = 10;
/* constraints end*/

const getAllConnections = async (req, res, next) => {
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    const rootnode = req.user;
    try {
        const x = await Promise.all([
            Connection.find({
                rootnode: rootnode._id,
                status: "accepted",
            })
                .sort("-createdAt")
                .limit(connPerPage)
                .skip((page - 1) * connPerPage)
                .exec(),
            Connection.countDocuments({
                rootnode: rootnode._id,
                status: "accepted",
            }),
        ]);
        res.json({
            success: true,
            connections: x[0],
            totalPages: Math.ceil(x[1] / connPerPage),
            currentPage: Number(page),
        });
    } catch (err) {
        next(err);
    }
};

const userConnectionToggler = async (req, res, next) => {
    const id = req.params.id;
    const rootnode = req.user;
    try {
        if (!id) throw new IllegalArgumentException("Missing user id");
        const nodeToConn = await User.findById(id);
        const isConnected = await Connection.findOne({
            rootnode: rootnode._id,
            node: nodeToConn,
        });
        if (isConnected) {
            await isConnected.remove();
            return res.json({
                success: true,
                hasLink: false,
                reply: "Node unlinked successfully",
            });
        }
        const newConn = await Connection.create({
            rootnode: rootnode._id,
            node: nodeToConn,
        });
        res.json({
            success: true,
            hasLink: true,
            linkStatus: newConn.status,
            reply: "Nodes linked successfully",
            data: newConn,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllConnections, userConnectionToggler };
