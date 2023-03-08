const { isValidObjectId } = require("mongoose");
const StoryGen = require("../generator/story.gen");
const {
    User,
    Story,
    StoryLike,
    Connection,
} = require("../models/models.wrapper");

const {
    IllegalArgumentException,
    ResourceNotFoundException,
} = require("../throwable/exception.rootnode");
const { Sort } = require("../utils/algorithms");
const EntityFieldsFilter = require("../utils/entity.filter");
const ConsoleLog = require("../utils/log.console");
const HyperLinks = require("../utils/_link.hyper");

/* constraints start*/
const storyPerPage = 10;
const likerPerPage = 10;
const watcherPerPage = 10;
/* constraints end*/

/* runtime store */
const userStoryFeed = new Map();
/* runtime end */

const getAllPublicStories = async (req, res, next) => {
    let { refresh, page } = req.query;
    page = req.query.page || 1;
    page = page > 0 ? page : 1;
    page = refresh == 1 ? 1 : page;
    try {
        const [publicStories, totalPages] = await Promise.all([
            Story.find({ visibility: "public" })
                .populate("owner", EntityFieldsFilter.USER)
                .sort("-createdAt")
                .limit(storyPerPage)
                .skip((page - 1) * storyPerPage)
                .exec(),
            Story.countDocuments({ visibility: "public" }),
        ]);
        const watched = publicStories.filter((story) =>
            story.seenBy.includes(req.user?._id)
        );
        const notWatched = publicStories.filter(
            (story) => !story.seenBy.includes(req.user?._id)
        );
        const sorted = [...notWatched, ...watched];
        res.json({
            success: true,
            data: sorted,
            totalPages: Math.ceil(totalPages / storyPerPage),
            currentPage: Number(page),
            _links: {
                post: HyperLinks.postLinks,
                self: HyperLinks.storyLinks,
                event: HyperLinks.eventLinks,
            },
        });
    } catch (err) {
        next(err);
    }
};

const getStoryByUser = async (req, res, next) => {
    const id = req.params.id;
    let { refresh, page } = req.query;
    page = req.query.page || 1;
    page = page > 0 ? page : 1;
    page = refresh == 1 ? 1 : page;
    try {
        const [publicStories, totalPages] = await Promise.all([
            Story.find({ visibility: "public", owner: id })
                .populate("owner", EntityFieldsFilter.USER)
                .sort("-createdAt")
                .limit(storyPerPage)
                .skip((page - 1) * storyPerPage)
                .exec(),
            Story.countDocuments({ visibility: "public" }),
        ]);
        const watched = publicStories.filter((story) =>
            story.seenBy.includes(req.user._id)
        );
        const notWatched = publicStories.filter(
            (story) => !story.seenBy.includes(req.user._id)
        );
        const sorted = [...notWatched, ...watched];
        res.json({
            success: true,
            data: sorted,
            totalPages: Math.ceil(totalPages / storyPerPage),
            currentPage: Number(page),
            _links: {
                post: HyperLinks.postLinks,
                self: HyperLinks.storyLinks,
                event: HyperLinks.eventLinks,
            },
        });
    } catch (err) {
        next(err);
    }
};

const getMyStoryFeed = async (req, res, next) => {
    let { page, refresh } = req.query;
    const user = req.user;
    const uidStr = user._id.toString();
    page = page > 0 ? page : 1;
    refresh = refresh == 1 ? true : false;

    let storyFeed = [];
    const conns = [];
    const meta = {
        isLiked: [],
    };
    try {
        if (refresh === true) userStoryFeed.delete(uidStr);
        if (!userStoryFeed.has(uidStr)) {
            ConsoleLog.genNewX("StoryFeed", "feed", user.username);
            const [myConns, theirConns] = await Promise.all([
                Connection.find({ rootnode: user._id, status: "accepted" }),
                Connection.find({ node: user._id, status: "accepted" }),
            ]);

            myConns.map((conn) => conns.push(conn.node));
            theirConns.map((conn) => conns.push(conn.rootnode));

            await StoryGen.generateStoryFeed(user._id, conns, storyFeed);
            storyFeed.sort(Sort.dynamicSort("-createdAt"));

            userStoryFeed.set(uidStr, storyFeed);
        } else {
            ConsoleLog.usingOldX("StoryFeed", "feed", user.username);

            storyFeed = userStoryFeed.get(uidStr);
        }
        const paginatedFeed = storyFeed.slice(
            (page - 1) * storyPerPage,
            page * storyPerPage
        );
        await StoryGen.generateMeta(user._id, paginatedFeed, meta);

        const count = storyFeed.length;

        res.json({
            success: true,
            data: paginatedFeed,
            totalPages: Math.ceil(count / storyPerPage),
            currentPage: Number(page),
            _links: {
                post: HyperLinks.postLinks,
                self: HyperLinks.storyLinks,
                event: HyperLinks.eventLinks,
            },
        });
    } catch (err) {
        next(err);
    }
};

const createStory = async (req, res, next) => {
    const { quote, visibility, likeable, color } = req.body;
    const media = req.file;
    const hasMedia = media !== null && media !== undefined;
    const uid = req.user._id;
    let cleanedMedia = null;
    try {
        if (!quote && !hasMedia)
            throw new IllegalArgumentException("Invalid Story parameters");

        let type;
        if (hasMedia && quote) type = "mixed";
        else if (hasMedia && !quote) type = "media";
        else type = "text";

        if (hasMedia) {
            cleanedMedia = {
                url: media.path,
                type: media.mimetype.split("/")[0],
            };
        }

        const storyPromise = Story.create({
            type: type,
            owner: uid,
            quote: quote,
            color: color,
            media: cleanedMedia,
            visibility: visibility,
            likeable: likeable,
        });

        const userPromise = User.findById(uid).select("_id storiesCount");

        const [story, user] = await Promise.all([storyPromise, userPromise]);
        // increase user stories count
        user.storiesCount++;
        await user.save();
        res.status(201).json({
            success: true,
            message: "Story created successfully!",
            data: story,
            _links: { self: HyperLinks.storyOpsLinks(story._id) },
        });
    } catch (err) {
        next(err);
    }
};
const deleteAllStories = async (req, res, next) => {
    const [likes, stories] = await Promise.all([
        StoryLike.find(),
        Story.find(),
    ]);

    likes.forEach(async (sl) => sl.remove());
    stories.forEach(async (s) => s.remove());

    res.json({ success: true, message: "All stories cleared!" });
};

const getStoryById = async (req, res, next) => {
    const id = req.params.id;
    const uid = req.user._id;
    try {
        if (!id) throw new IllegalArgumentException("Missing story id");
        if (!isValidObjectId(id))
            throw new IllegalArgumentException("Invalid story id");
        const story = await Story.findById(id);
        if (!story) throw new ResourceNotFoundException("Story not found");
        if (story.seenBy.includes(uid))
            return res.json({
                success: true,
                message: "Story already watched!",
                data: story,
            });

        story.seenBy.push(uid);
        story.watchCount++;
        await story.save();
        res.json({
            success: true,
            message: "Story watched!",
            data: story,
            _links: { self: HyperLinks.storyOpsLinks(id) },
        });
    } catch (err) {
        next(err);
    }
};

const storyWatched = async (req, res, next) => {
    const id = req.params.id;
    const uid = req.user._id;
    try {
        if (!id) throw new IllegalArgumentException("Missing story id");
        if (!isValidObjectId(id))
            throw new IllegalArgumentException("Invalid story id");
        const story = await Story.findById(id);
        if (!story) throw new ResourceNotFoundException("Story not found");
        if (story.seenBy.includes(uid))
            return res.json({
                success: true,
                message: "Story already watched!",
            });

        story.seenBy.push(uid);
        story.watchCount++;
        await story.save();
        res.json({
            success: true,
            message: "Story watched!",
        });
    } catch (err) {
        next(err);
    }
};
const updateStoryById = async (req, res, next) => {
    const id = req.params.id;
    const media = req.files;
    try {
        if (!id) throw new IllegalArgumentException("Missing stpry id");
        const validId = isValidObjectId(id);
        if (!validId) throw new IllegalArgumentException("Invalid Post Id");
        const story = await Story.findById(id);
        // TODO Check owner
        const hasMedia = media?.length > 0;
        if (!story) throw new ResourceNotFoundException("Post not found");

        if (hasMedia) {
            const cleanedMedia = {
                url: media[0].path,
                type: media[0].mimetype.split("/")[0],
            };
            // Add field to body
            req.body.media = cleanedMedia;
        }

        const updatedStory = await Story.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        res.json({
            success: true,
            data: updatedStory,
            _links: { self: HyperLinks.storyOpsLinks(id) },
        });
    } catch (err) {
        next(err);
    }
};
const deleteStoryById = async (req, res, next) => {
    const id = req.params.id;
    try {
        if (!id) throw new IllegalArgumentException("Missing story id");
        const validId = isValidObjectId(id);
        if (!validId) throw new IllegalArgumentException("Invalid story id");
        // TODO Check owner
        const result = await Story.findByIdAndDelete(id);
        if (!result) throw new ResourceNotFoundException("Story not found");
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

const getStoryLiker = async (req, res, next) => {
    const id = req.params.id;
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    try {
        if (!id) throw new IllegalArgumentException("Missing story id");
        if (!isValidObjectId(id))
            throw new IllegalArgumentException("Invalid story id");

        const story = await Story.exists({ _id: id });
        if (!story) throw new ResourceNotFoundException("Story not found");

        const likerPromise = StoryLike.find({ story: id })
            .select("user createdAt")
            .populate("user", ["username", "showOnlineStatus", "avatar"])
            .sort("-createdAt")
            .limit(likerPerPage)
            .skip((page - 1) * likerPerPage)
            .exec();

        const countPromise = StoryLike.find({ story: id }).countDocuments();
        const [likers, count] = await Promise.all([likerPromise, countPromise]);

        res.json({
            success: true,
            data: likers,
            totalPages: Math.ceil(count / likerPerPage),
            currentPage: Number(page),
            _links: { self: HyperLinks.storyOpsLinks(id) },
        });
    } catch (err) {
        next(err);
    }
};
const likeUnlikeStory = async (req, res, next) => {
    const id = req.params.id;
    const uid = req.user._id;
    try {
        if (!id) throw new IllegalArgumentException("Missing story id");
        const story = await Story.findById(id).select(["_id", "likesCount"]);
        if (!story) throw new ResourceNotFoundException("Story not found");
        const isLiked = await StoryLike.findOne({ story: id, user: uid });
        if (isLiked) {
            story.likesCount--;
            // concurrency
            await Promise.all([isLiked.remove(), story.save()]);

            res.json({
                success: true,
                reply: "Story unliked successfully!",
                data: { liked: false },
            });
        } else {
            story.likesCount++;
            await Promise.all([
                StoryLike.create({ story: story._id, user: uid }),
                story.save(),
            ]);
            res.json({
                success: true,
                message: "Story liked successfully!",
                data: { liked: true },
                _links: { self: HyperLinks.storyOpsLinks(id) },
            });
        }
    } catch (err) {
        next(err);
    }
};

const getStoryWatcher = async (req, res, next) => {
    const id = req.params.id;
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    try {
        if (!id) throw new IllegalArgumentException("Missing story id");
        if (!isValidObjectId(id))
            throw new IllegalArgumentException("Invalid story id");

        const story = await Story.findById({ _id: id }).populate("seenBy", [
            "username",
            "showOnlineStatus",
            "avatar",
            "createdAt",
        ]);

        if (!story) throw new ResourceNotFoundException("Story not found");

        const seenBy = story.seenBy.slice(
            (page - 1) * watcherPerPage,
            page * watcherPerPage
        );

        const count = story.seenBy.length;

        res.json({
            success: true,
            data: seenBy,
            totalPages: Math.ceil(count / watcherPerPage),
            currentPage: Number(page),
            _links: { self: HyperLinks.storyOpsLinks(id) },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllPublicStories,
    getMyStoryFeed,
    getStoryByUser,
    createStory,
    deleteAllStories,
    getStoryById,
    updateStoryById,
    deleteStoryById,
    getStoryLiker,
    likeUnlikeStory,
    getStoryWatcher,
    storyWatched,
};
