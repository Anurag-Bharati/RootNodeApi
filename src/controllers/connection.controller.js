const { isValidObjectId } = require("mongoose");
const ConnGen = require("../generator/conn.gen");
const { Connection, User } = require("../models/models.wrapper");
const {
    IllegalArgumentException,
    IllegalOperationException,
    ResourceNotFoundException,
    EntityNotFoundException,
} = require("../throwable/exception.rootnode");
const { Sort } = require("../utils/algorithms");
const EntityFieldsFilter = require("../utils/entity.filter");
const ConsoleLog = require("../utils/log.console");
const HyperLinks = require("../utils/_link.hyper");

/* constraints start*/
const connPerPage = 5;
const limitConstraint = 3;
const recomConstraint = 10;
const connStatusEnum = ["accepted", "rejected", "pending"];
/* constraints end*/

/* Runtime store */
const userConnRecom = new Map();
const userConnRand = new Map();
/* runtime end */

const getAllConnections = async (req, res, next) => {
    let { page } = req.params;
    page = page > 0 ? page : 1;
    const rootnode = req.user;
    try {
        const connsPromise = Connection.find({
            $or: [{ rootnode: rootnode._id }, { node: rootnode._id }],
            status: "accepted",
        })
            .populate("rootnode node", EntityFieldsFilter.USER)
            .sort("-createdAt")
            .limit(connPerPage)
            .skip((page - 1) * connPerPage)
            .exec();
        const countPromise = Connection.countDocuments({
            $or: [{ rootnode: rootnode._id }, { node: rootnode._id }],
            status: "accepted",
        });
        const [conns, count] = await Promise.all([connsPromise, countPromise]);
        const connsWithoutMe = conns.map((conn) =>
            conn.rootnode.equals(rootnode._id)
                ? { user: conn.node, date: conn.createdAt }
                : { user: conn.rootnode, date: conn.createdAt }
        );
        res.json({
            success: true,
            data: connsWithoutMe,
            totalPages: Math.ceil(count / connPerPage),
            currentPage: Number(page),
            _links: { self: HyperLinks.connLinks },
        });
    } catch (err) {
        next(err);
    }
};

const getMyOldAndRecentConns = async (req, res, next) => {
    const user = req.user;
    try {
        let [old, recent, count] = await ConnGen.generateConnOverview(
            user._id,
            { limit: limitConstraint }
        );
        old = old.map((conn) =>
            conn.rootnode.equals(user._id)
                ? { user: conn.node, date: conn.createdAt }
                : { user: conn.rootnode, date: conn.createdAt }
        );
        recent = recent.map((conn) =>
            conn.rootnode.equals(user._id)
                ? { user: conn.node, date: conn.createdAt }
                : { user: conn.rootnode, date: conn.createdAt }
        );
        res.json({
            success: true,
            message: "Successfully generated old and recent conns",
            data: {
                old: old,
                recent: recent,
                limit: limitConstraint,
                count: count > 6 ? count - limitConstraint * 2 : 0,
            },
            _links: { self: HyperLinks.connLinks },
        });
    } catch (err) {
        next(err);
    }
};

const getRecommendedConns = async (req, res, next) => {
    let { page, refresh } = req.params;
    refresh = refresh == 1 ? true : false;
    page = page > 0 ? page : 1;
    const user = req.user;
    const uidStr = req.user._id.toString();
    let recom = [];
    try {
        if (refresh === true) userConnRecom.delete(uidStr);
        if (!userConnRecom.has(uidStr)) {
            ConsoleLog.genNewX(
                "ConnRecom",
                "connection recommendation",
                user.username
            );
            await ConnGen.generateRecommendedConns(user._id, recom, {
                limit: recomConstraint,
            });
            Sort.shuffle(recom);
            userConnRecom.set(uidStr, recom);
        } else {
            ConsoleLog.usingOldX(
                "ConnRecom",
                "connection recommendation",
                user.username
            );
            recom = userConnRecom.get(uidStr);
        }

        const paginatedRecom = recom.slice(
            (page - 1) * connPerPage,
            page * connPerPage
        );

        const count = recom.length;

        res.json({
            success: true,
            data: paginatedRecom,
            totalPages: Math.ceil(count / connPerPage),
            currentPage: Number(page),
            _links: { self: HyperLinks.connLinks },
        });
    } catch (err) {
        next(err);
    }
};

const getRandomConns = async (req, res, next) => {
    let { page, refresh } = req.params;
    refresh = refresh == 1 ? true : false;
    page = page > 0 ? page : 1;
    const user = req.user;
    const uidStr = req.user._id.toString();
    let randCon = [];
    try {
        if (refresh === true) userConnRand.delete(uidStr);
        if (!userConnRand.has(uidStr)) {
            ConsoleLog.genNewX(
                "ConnRandom",
                "random connection",
                user.username
            );
            await ConnGen.generateRandomConns(user._id, randCon, {
                limit: recomConstraint,
            });
            Sort.shuffle(randCon);
            userConnRand.set(uidStr, randCon);
        } else {
            ConsoleLog.usingOldX(
                "ConnRandom",
                "random connection",
                user.username
            );
            randCon = userConnRand.get(uidStr);
        }
        const paginatedRecom = randCon.slice(
            (page - 1) * connPerPage,
            page * connPerPage
        );

        const count = randCon.length;

        res.json({
            success: true,
            data: paginatedRecom,
            totalPages: Math.ceil(count / connPerPage),
            currentPage: Number(page),
            _links: { self: HyperLinks.connLinks },
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
            message: "Node link request sent successfully",
            data: { conn: newConn, requested: true },
            _links: { self: HyperLinks.connOpsLinks(id) },
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
                _links: { self: HyperLinks.connOpsLinks(id) },
            });
        const hasLink = hasConn.status == "accepted" ? true : false;
        console.log(hasConn.status);
        return res.json({
            success: true,
            data: {
                hasLink: hasLink,
                status: hasConn.status,
            },
            _links: { self: HyperLinks.connOpsLinks(id) },
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
                _links: { self: HyperLinks.connOpsLinks(id) },
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
            _links: { self: HyperLinks.connOpsLinks(id) },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllConnections,
    getMyOldAndRecentConns,
    getRecommendedConns,
    getRandomConns,
    hasConnection,
    userConnectionToggler,
    updateConnectionById,
};
