const { isValidObjectId } = require("mongoose");
const { User, Story, StoryLike } = require("../models/models.wrapper");

const {
    IllegalArgumentException,
    ResourceNotFoundException,
} = require("../throwable/exception.rootnode");

/* constraints start*/
const storyPerPage = 5;
const likerPerPage = 10;
const watcherPerPage = 10;
/* constraints end*/

const getAllPublicStories = async (req, res, next) => {
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    try {
        const [publicStories, totalPages] = await Promise.all([
            Story.find({ visibility: "public" })
                .sort("-createdAt")
                .limit(storyPerPage)
                .skip((page - 1) * storyPerPage)
                .exec(),
            Story.countDocuments({ visibility: "public" }),
        ]);
        res.json({
            success: true,
            data: publicStories,
            totalPages: Math.ceil(totalPages / storyPerPage),
            currentPage: Number(page),
        });
    } catch (err) {
        next(err);
    }
};
const createStory = async (req, res, next) => {
    const { heading, visibility, likeable } = req.body;
    const media = req.file;
    const hasMedia = media !== null;
    const uid = req.user._id;
    let cleanedMedia = null;
    try {
        if (!heading && !hasMedia)
            throw new IllegalArgumentException("Invalid Story parameters");

        let type;
        if (hasMedia && heading) type = "mixed";
        else if (hasMedia && !heading) type = "media";
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
            heading: heading,
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
    try {
        if (!id) throw new IllegalArgumentException("Missing story id");
        if (!isValidObjectId(id))
            throw new IllegalArgumentException("Invalid story id");
        const story = await Story.findById(id);
        if (!story) throw new ResourceNotFoundException("Story not found");
        res.json({
            success: true,
            data: story,
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
        res.json({ success: true, data: updatedStory });
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
        });
    } catch (err) {
        next(err);
    }
};

const addStoryWatcher = async (req, res, next) => {
    const id = req.params.id;
    const uid = req.user._id;
    try {
        if (!id) throw new IllegalArgumentException("Missing story id");
        if (!isValidObjectId(id))
            throw new IllegalArgumentException("Invalid story id");

        const story = await Story.findById({ _id: id });
        if (!story) throw new ResourceNotFoundException("Story not found");

        if (!story.seenBy.includes(uid)) {
            story.seenBy.push(uid);
        }

        story.watchCount++;
        await story.save();
        console.log(story.seenBy);
        res.json({
            success: true,
            message: "Story watched!",
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllPublicStories,
    createStory,
    deleteAllStories,
    getStoryById,
    updateStoryById,
    deleteStoryById,
    getStoryLiker,
    likeUnlikeStory,
    getStoryWatcher,
    addStoryWatcher,
};
