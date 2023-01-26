const { isValidObjectId } = require("mongoose");
const { Connection, User } = require("../models/models.wrapper");
const {
    IllegalArgumentException,
    IllegalOperationException,
    ResourceNotFoundException,
    EntityNotFoundException,
} = require("../throwable/exception.rootnode");

/* constraints start*/
const connPerPage = 5;
const connStatusEnum = ["accepted", "rejected", "pending"];
/* constraints end*/

const getAllConnections = async (req, res, next) => {
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    const rootnode = req.user;
    try {
        const connsPromise = Connection.find({
            $or: [
                { rootnode: rootnode._id, status: "accepted" },
                { node: rootnode._id, status: "accepted" },
            ],
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
        if (!nodeToConn) throw new EntityNotFoundException("Node not found");
        if (user.equals(nodeToConn))
            throw new IllegalOperationException("Cannot connect to self");
        const isConnected = await Connection.findOne({
            $or: [
                { rootnode: rootnode._id, node: nodeToConn },
                { rootnode: nodeToConn, node: rootnode._id },
            ],
        });

        if (isConnected) {
            let msg;
            if (isConnected.status == "pending")
                msg = "Removed link-request successfully";
            else msg = "Node unlinked successfully";
            if (user.nodesCount > 0) user.nodesCount--;
            if (nodeToConn.nodesCount > 0) nodeToConn.nodesCount--;
            await Promise.all([
                isConnected.remove(),
                user.save(),
                nodeToConn.save(),
            ]);

            return res.json({
                success: true,
                message: msg,
                data: { conn: isConnected, requested: false },
            });
        }
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
            message: "Nodes linked request sent successfully",
            data: { conn: newConn, requested: true },
        });
    } catch (err) {
        next(err);
    }
};

const hasConnection = async (req, res, next) => {
    const id = req.params.id;
    const rootnode = req.user;
    try {
        if (!id) throw new IllegalArgumentException("Missing user id");
        const validId = isValidObjectId(id);
        if (!validId) throw new IllegalArgumentException("Invalid user id");

        const hasConn = await Connection.findOne({
            rootnode: rootnode._id,
            node: id,
        });

        if (!hasConn)
            return res.json({
                success: true,
                data: {
                    hasLink: false,
                    status: "disconnected",
                },
            });
        const hasLink = hasConn.status == "accepted" ? true : false;
        console.log(hasConn.status);
        return res.json({
            success: true,
            data: {
                hasLink: hasLink,
                status: hasConn.status,
            },
        });
    } catch (err) {
        next(err);
    }
};

const updateConnectionById = async (req, res, next) => {
    const id = req.params.id;
    const uid = req.user._id;
    const operation = req.body.operation;
    let hasLink = false;
    try {
        if (!operation) throw new IllegalArgumentException("Missing operation");
        if (!id) throw new IllegalArgumentException("Missing connection id");
        const validId = isValidObjectId(id);
        if (!validId)
            throw new IllegalArgumentException("Invalid connection id");

        const connection = await Connection.findById(id);

        if (!connection)
            throw new ResourceNotFoundException(
                "Connection has not been established yet!"
            );
        if (!connection.node.equals(uid))
            throw new IllegalOperationException("Cannot update request");
        const nodeToConn = await User.findById(connection.node);
        if (!nodeToConn)
            throw new ResourceNotFoundException("Conn Node not found");

        if (!connStatusEnum.includes(operation))
            throw new IllegalOperationException("Invalid operation parameter");
        if (connection.status === "accepted" && operation == "accepted") {
            return res.json({
                success: false,
                message: "Connection request already accepted!",
                data: { hasLink: true, linkStatus: connection.status },
            });
        }
        const [rootnode, node] = await Promise.all([
            User.findById(connection.rootnode),
            User.findById(connection.node),
        ]);
        if (operation === "accepted") {
            rootnode.nodesCount++;
            node.nodesCount++;
            hasLink = true;
        } else return res.sendStatus(403);
        connection.status = operation;
        await Promise.all([rootnode.save(), node.save(), connection.save()]);
        res.json({
            success: true,
            message: "Connection request accepted!",
            data: {
                hasLink: hasLink,
                linkStatus: connection.status,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllConnections,
    hasConnection,
    userConnectionToggler,
    updateConnectionById,
};
