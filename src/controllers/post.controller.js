const { Post } = require("../models/models.wrapper");

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
const createPost = (req, res, next) => {};
const updatePostById = (req, res, next) => {};
const deletePostById = (req, res, next) => {};

module.exports = {
    getAllPost,
    getPostById,
    createPost,
    updatePostById,
    deletePostById,
};
