const { Post, User } = require("../models/models.wrapper");
const PostGen = {};
/* Feed */
const generateFeed = async (conns, feed, populateFilter) => {
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
                      .populate("owner", populateFilter)
                : {};
            posts.forEach((element) => {
                feed.push(element);
            });
        })
    );
};
PostGen.generateFeed = generateFeed;
module.exports = PostGen;
