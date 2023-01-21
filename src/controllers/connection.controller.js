const { isValidObjectId } = require("mongoose");
const { Connection, User } = require("../models/models.wrapper");
const { IllegalArgumentException } = require("../throwable/exception.rootnode");

/* constraints start*/
const connPerPage = 5;
/* constraints end*/

const getAllConnections = async (req, res, next) => {
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    const rootnode = req.user;
    try {
        const connsPromise = Connection.find({
            rootnode: rootnode._id,
            status: "accepted",
        })
            .sort("-createdAt")
            .limit(connPerPage)
            .skip((page - 1) * connPerPage)
            .exec();
        const countPromise = Connection.countDocuments({
            rootnode: rootnode._id,
            status: "accepted",
        });
        const [conns, count] = await Promise.all([connsPromise, countPromise]);
        res.json({
            success: true,
            data: conns,
            totalPages: Math.ceil(count / connPerPage),
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
        const validId = isValidObjectId(id);
        if (!validId) throw new IllegalArgumentException("Invalid user id");

        const [user, nodeToConn] = await Promise.all([
            User.findById(rootnode._id),
            User.findById(id),
        ]);

        const isConnected = await Connection.findOne({
            rootnode: rootnode._id,
            node: nodeToConn,
        });

        if (isConnected) {
            if (user.connectionCount > 0) user.connectionCount--;
            await Promise.all([user.save(), isConnected.remove()]);
            return res.json({
                success: true,
                message: "Node unlinked successfully",
                data: { hasLink: false },
            });
        }
        user.connectionCount++;
        const newConnPromise = Connection.create({
            rootnode: rootnode._id,
            node: nodeToConn,
        });
        const [newConn, updatedRoot] = await Promise.all([
            newConnPromise,
            user.save(),
        ]);
        res.json({
            success: true,
            message: "Nodes linked successfully",
            data: {
                newNode: newConn,
                hasLink: true,
                linkStatus: newConn.status,
                connCount: updatedRoot.connectionCount,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllConnections, userConnectionToggler };
