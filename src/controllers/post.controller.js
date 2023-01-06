const { Post, User, PostLike } = require("../models/models.wrapper");
const {
    IllegalArgumentException,
    ResourceNotFoundException,
    InvalidMediaTypeException,
    IllegalPostTypeExecption,
} = require("../throwable/exception.rootnode");

/* constraints start*/
const postPerPage = 2;
/* constraints end*/

const getAllPost = async (req, res, next) => {
    let page = req.query.page || 1;
    // check #1
    page = page > 0 ? page : 1;
    try {
        // execute query with page and limit values
        const posts = await Post.find()
            .limit(postPerPage)
            .skip((page - 1) * postPerPage)
            .exec();
        // get total documents in the Posts collection
        const count = await Post.countDocuments();

        res.json({
            posts,
            totalPages: Math.ceil(count / postPerPage),
            currentPage: Number(page),
        });
    } catch (_) {
        next(_);
    }
};

const getPostById = (req, res, next) => {};
const createPost = async (req, res, next) => {
    const {
        caption,
        visibility,
        isMarkdown,
        commentable,
        likeable,
        shareable,
    } = req.body;
    const mediaFiles = req.files;
    const medias = [];

    if (!caption && !mediaFiles)
        return next(new IllegalArgumentException("Invalid Post parameters"));

    if (isMarkdown == true && mediaFiles && mediaFiles.length > 0) {
        return next(
            new IllegalPostTypeExecption("Markdown cannot contain media files")
        );
    }
    if (mediaFiles && mediaFiles.length > 0) {
        mediaFiles.forEach((media) => {
            if (!media.path)
                return next(
                    new ResourceNotFoundException("Media url not found")
                );
            if (!media.mimetype)
                return next(
                    new InvalidMediaTypeException("Media type not specified")
                );
            medias.push({
                url: media.path,
                type: media.mimetype.split("/")[0],
            });
        });
    }

    let type;
    if (isMarkdown == true) type = "markdown";
    else if (mediaFiles && mediaFiles.length > 0 && caption) type = "mixed";
    else if (mediaFiles && mediaFiles.length > 0 && !caption) type = "media";
    else type = "text";

    const post = await Post.create({
        type: type,
        owner: req.user._id,
        caption: caption,
        mediaFiles: medias,
        visibility: visibility,
        isMarkdown: isMarkdown,
        commentable: commentable,
        likeable: likeable,
        shareable: shareable,
    });

    // increase user post count
    const user = await User.findById(req.user._id).select("_id postsCount");
    user.postsCount++;
    await user.save();

    // send feedback
    res.status(201).json({
        success: true,
        message: "Post created successfully!",
        post: post,
    });
};

const likeUnlikePost = async (req, res, next) => {
    if (!req.params.pid) {
        return next(new IllegalArgumentException("Invalid/Missing Post Id"));
    }
    const post = await Post.findById(req.params.pid).select([
        "_id",
        "owner",
        "likesCount",
    ]);
    if (!post) {
        return next(new ResourceNotFoundException("Post not found"));
    }
    const isLiked = await PostLike.findOne({
        post: post._id,
        user: req.user._id,
    });
    if (isLiked) {
        await PostLike.findOneAndDelete({ post: post._id, user: req.user._id });
        post.likesCount--;
        await post.save();
        res.status(200).json({
            success: true,
            reply: "Post unliked successfully!",
            liked: false,
        });
    } else {
        await PostLike.create({ post: post._id, user: req.user._id });
        post.likesCount++;
        await post.save();
        res.status(200).json({
            success: true,
            reply: "Post liked successfully!",
            liked: true,
        });
    }
};
const updatePostById = (req, res, next) => {};
const deletePostById = (req, res, next) => {};
const deleteAllPost = async (req, res, next) => {
    (await Post.find()).forEach(async (post) => await post.remove());
    res.json({ success: true, reply: "All post cleared!" });
};

module.exports = {
    getAllPost,
    getPostById,
    createPost,
    updatePostById,
    deletePostById,
    deleteAllPost,
    likeUnlikePost,
};
