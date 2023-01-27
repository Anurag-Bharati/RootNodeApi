const { Post, User, PostLike } = require("../models/models.wrapper");
const EntityFieldsFilter = require("../utils/entity.filter");
const { ObjectId } = require("mongoose");
const PostGen = {};
/* Feed */
const generateFeed = async (uid, conns, feed) => {
    await Promise.all(
        conns.map(async (id) => {
            let postUser = await User.findById(id);
            let posts = postUser
                ? await Post.find({
                      $or: [
                          { visibility: "public" },
                          { visibility: "follower" },
                      ],
                      owner: id,
                  })
                      .sort("-createdAt")
                      .populate("owner", EntityFieldsFilter.USER)
                : {};

            posts.forEach((post) => feed.push(post));
        })
    );
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
