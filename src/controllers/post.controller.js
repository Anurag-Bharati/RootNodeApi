const { Post, User } = require("../models/models.wrapper");
const { IllegalArgumentException } = require("../throwable/exception.rootnode");

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
    const { mediaFiles, caption, visibility } = req.body;
    if (!caption && !mediaFiles)
        next(new IllegalArgumentException("Invalid Post parameters", 400));

    const post = await Post.create({
        postType: "content",
        owner: req.user._id,
        caption: caption,
        mediaFiles: mediaFiles,
        visibility: visibility,
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
const updatePostById = (req, res, next) => {};
const deletePostById = (req, res, next) => {};

module.exports = {
    getAllPost,
    getPostById,
    createPost,
    updatePostById,
    deletePostById,
};
