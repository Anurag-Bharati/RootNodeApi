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
        if (!nodeToConn) throw new EntityNotFoundException("Node not found");
        const isConnected = await Connection.findOne({
            rootnode: rootnode._id,
            node: nodeToConn,
        });

        if (isConnected) {
            if (user.nodesCount > 0) user.nodesCount--;
            if (nodeToConn.nodesCount > 0) nodeToConn.nodesCount--;
            await Promise.all([
                user.save(),
                isConnected.remove(),
                nodeToConn.save(),
            ]);
            return res.json({
                success: true,
                message: "Node unlinked successfully",
                data: { hasLink: false },
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
            data: {
                newNode: newConn,
                hasLink: false,
                linkStatus: newConn.status,
                connCount: updatedRoot.nodesCount,
            },
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
                    status: "Disconnected",
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
    const rootnode = req.user;
    const operation = req.body.operation;
    let hasLink = false;
    try {
        if (!operation) throw new IllegalArgumentException("Missing operation");
        if (!id) throw new IllegalArgumentException("Missing connection id");
        const validId = isValidObjectId(id);
        if (!validId)
            throw new IllegalArgumentException("Invalid connection id");

        const [user, connection] = await Promise.all([
            User.findById(rootnode._id),
            Connection.findById(id),
        ]);

        if (!connection)
            throw new ResourceNotFoundException(
                "Connection has not been established yet!"
            );
        const nodeToConn = await User.findById(connection.node);
        if (!nodeToConn)
            throw new ResourceNotFoundException("Conn Node not found");
        if (!connStatusEnum.includes(operation))
            throw new IllegalOperationException("Invalid operation parameter");
        if (operation === "accepted") {
            user.nodesCount++;
            nodeToConn.nodesCount++;
            hasLink = true;
        }
        connection.status = operation;
        await Promise.all([user.save(), nodeToConn.save(), connection.save()]);
        res.json({
            success: true,
            message: "Connection request accepted!",
            data: {
                hasLink: hasLink,
                newNode: connection,
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
