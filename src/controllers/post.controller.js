const {
    Post,
    User,
    PostLike,
    PostComment,
    PostCommentLike,
} = require("../models/models.wrapper");
const {
    IllegalArgumentException,
    ResourceNotFoundException,
    InvalidMediaTypeException,
    IllegalPostTypeExecption,
} = require("../throwable/exception.rootnode");

const { isValidObjectId } = require("mongoose");

/* constraints start*/
const postPerPage = 5;
const commentsPerPage = 5;
const likerPerPage = 10;
/* constraints end*/

const getAllPost = async (req, res, next) => {
    let page = req.query.page || 1;
    // check #1
    page = page > 0 ? page : 1;
    try {
        const x = await Promise.all([
            // execute query with page and limit values
            Post.find()
                .sort("-createdAt")
                .limit(postPerPage)
                .skip((page - 1) * postPerPage)
                .exec(),
            // get total documents in the Posts collection
            Post.countDocuments(),
        ]);
        res.json({
            posts: x[0],
            totalPages: Math.ceil(x[1] / postPerPage),
            currentPage: Number(page),
        });
    } catch (_) {
        next(_);
    }
};

const getPostById = async (req, res, next) => {
    const pid = req.params.id;
    if (!pid)
        return next(new IllegalArgumentException("Missing parameter post id"));
    if (!isValidObjectId(pid))
        return next(new IllegalArgumentException("Invalid Post Id"));
    const post = await Post.findById(pid);
    if (!post) return next(new ResourceNotFoundException("Post not found"));
    res.status(200).json({
        success: true,
        post: post,
    });
};
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

    if (isMarkdown === "true" && mediaFiles && mediaFiles.length > 0) {
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
    if (isMarkdown === "true") type = "markdown";
    else if (mediaFiles && mediaFiles.length > 0 && caption) type = "mixed";
    else if (mediaFiles && mediaFiles.length > 0 && !caption) type = "media";
    else type = "text";

    // Independent Operations: Post Creation and Find User
    const post = Post.create({
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

    const user = User.findById(req.user._id).select("_id postsCount");

    // concurrency
    const x = await Promise.all([post, user]);

    // increase user post count
    x[1].postsCount++;
    await x[1].save();

    // send feedback
    res.status(201).json({
        success: true,
        message: "Post created successfully!",
        post: x[0],
    });
};

const likeUnlikePost = async (req, res, next) => {
    if (!req.params.pid) {
        return next(new IllegalArgumentException("Invalid/Missing Post Id"));
    }
    const post = await Post.findById(req.params.pid).select([
        "_id",
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
        post.likesCount--;

        // concurrency
        await Promise.all([
            PostLike.findOneAndDelete({ post: post._id, user: req.user._id }),
            post.save(),
        ]);

        res.status(200).json({
            success: true,
            reply: "Post unliked successfully!",
            liked: false,
        });
    } else {
        post.likesCount++;
        await Promise.all([
            PostLike.create({ post: post._id, user: req.user._id }),
            post.save(),
        ]);
        res.status(200).json({
            success: true,
            reply: "Post liked successfully!",
            liked: true,
        });
    }
};

const getPostLiker = async (req, res, next) => {
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;

    const pid = req.params.pid;
    if (!pid) {
        return next(new IllegalArgumentException("Invalid/Missing Post Id"));
    }
    // check if post exists
    const post = await Post.exists({ _id: req.params.pid });
    if (!post) {
        return next(new ResourceNotFoundException("Post not found"));
    }
    const liker = PostLike.find({ post: pid })
        .populate("user", ["username", "showOnlineStatus", "avatar"])
        .sort("-createdAt")
        .limit(likerPerPage)
        .skip((page - 1) * likerPerPage)
        .exec();

    const count = PostLike.find({ post: pid }).countDocuments();

    res.status(200).json({
        success: true,
        liker: await liker,
        totalPages: Math.ceil((await count) / likerPerPage),
        currentPage: Number(page),
    });
};
const getPostCommentLiker = async (req, res, next) => {
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;

    const cid = req.params.cid;
    if (!cid) {
        return next(new IllegalArgumentException("Invalid/Missing Comment Id"));
    }
    // check if post exists
    const comment = await PostComment.exists({ _id: cid });
    if (!comment) {
        return next(new ResourceNotFoundException("Comment not found"));
    }
    const liker = PostCommentLike.find({ comment: cid })
        .populate("user", ["username", "showOnlineStatus", "avatar"])
        .sort("-createdAt")
        .limit(likerPerPage)
        .skip((page - 1) * likerPerPage)
        .exec();

    const count = PostCommentLike.find({ comment: cid }).countDocuments();

    res.status(200).json({
        success: true,
        liker: await liker,
        totalPages: Math.ceil((await count) / likerPerPage),
        currentPage: Number(page),
    });
};

const addComment = async (req, res, next) => {
    if (!req.params.pid) {
        return next(new IllegalArgumentException("Invalid/Missing Post Id"));
    }
    if (!req.body.comment) {
        return next(new IllegalArgumentException("Missing comment parameter"));
    }
    const post = await Post.findById(req.params.pid).select([
        "_id",
        "commentsCount",
    ]);

    if (!post) {
        return next(new ResourceNotFoundException("Post not found"));
    }

    post.commentsCount++;

    const x = await Promise.all([
        PostComment.create({
            post: post._id,
            user: req.user._id,
            comment: req.body.comment,
        }),
        post.save(),
    ]);

    res.status(200).json({
        success: true,
        reply: "Comment posted!",
        comment: x[0],
    });
};

const getComments = async (req, res, next) => {
    if (!req.params.pid) {
        return next(new IllegalArgumentException("Invalid/Missing Post Id"));
    }
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;

    try {
        const comments = PostComment.find()
            .sort("-createdAt")
            .limit(commentsPerPage)
            .skip((page - 1) * commentsPerPage)
            .exec();

        const count = PostComment.countDocuments();

        res.json({
            success: true,
            comments: await comments,
            totalPages: Math.ceil((await count) / commentsPerPage),
            currentPage: Number(page),
        });
    } catch (_) {
        next(_);
    }
};

const likeUnlikeComment = async (req, res, next) => {
    if (!req.params.cid) {
        return next(new IllegalArgumentException("Invalid/Missing Comment Id"));
    }
    const comment = await PostComment.findById(req.params.cid).select([
        "_id",
        "likesCount",
    ]);
    if (!comment) {
        return next(new ResourceNotFoundException("Comment not found"));
    }
    const isLiked = await PostCommentLike.findOne({
        comment: comment._id,
        user: req.user._id,
    });
    if (isLiked) {
        comment.likesCount--;
        await Promise.all([
            PostCommentLike.findOneAndDelete({
                comment: comment._id,
                user: req.user._id,
            }),
            comment.save(),
        ]);
        res.status(200).json({
            success: true,
            reply: "Comment unliked successfully!",
            liked: false,
        });
    } else {
        comment.likesCount++;

        await Promise.all([
            PostCommentLike.create({
                comment: comment._id,
                user: req.user._id,
            }),
            comment.save(),
        ]);

        res.status(200).json({
            success: true,
            reply: "Comment liked successfully!",
            liked: true,
        });
    }
};

const updatePostById = (req, res, next) => {};
const deletePostById = (req, res, next) => {};
const deleteAllPost = async (req, res, next) => {
    const dp = await Promise.all([
        PostLike.find(),
        PostCommentLike.find(),
        PostComment.find(),
        Post.find(),
    ]);
    dp[0].forEach(async (pl) => pl.remove());
    dp[1].forEach(async (cl) => cl.remove());
    dp[2].forEach(async (c) => c.remove());
    dp[3].forEach(async (p) => p.remove());
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
    getPostLiker,
    getComments,
    addComment,
    likeUnlikeComment,
    getPostCommentLiker,
};
