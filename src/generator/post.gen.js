const { Post, User, PostLike } = require("../models/models.wrapper");
const EntityFieldsFilter = require("../utils/entity.filter");
require("mongoose");
const PostGen = {};
/* Feed */
const generateFeed = async function (uid, conns, feed) {
    const posts = await Post.find({
        $or: [{ visibility: "public" }, { visibility: "mutual" }],
        owner: { $in: conns },
    })
        .sort("-createdAt")
        .populate("owner", EntityFieldsFilter.USER);

    feed.push(...posts);
};

const generateMeta = async (uid, posts, meta) => {
    for (let i in posts) {
        let liked = await PostLike.exists({ post: posts[i]._id, user: uid });
        meta.isLiked.push(liked ? true : false);
    }
};

PostGen.generateFeed = generateFeed;
PostGen.generateMeta = generateMeta;

module.exports = PostGen;
