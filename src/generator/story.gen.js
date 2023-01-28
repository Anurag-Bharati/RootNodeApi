const { Story, User, StoryLike } = require("../models/models.wrapper");
const EntityFieldsFilter = require("../utils/entity.filter");
const StoryGen = {};

const generateStoryFeed = async (uid, conns, feed) => {
    await Promise.all(
        conns.map(async (id) => {
            let storyUser = await User.findById(id);
            let stories = storyUser
                ? await Story.find({
                      $or: [{ visibility: "public" }, { visibility: "mutual" }],

                      $nor: [{ seenBy: uid }],
                      owner: id,
                  })
                      .sort("-createdAt")
                      .populate("owner", EntityFieldsFilter.USER)
                : {};
            stories.forEach((element) => {
                feed.push(element);
            });
        })
    );
};

const generateMeta = async (uid, stories, meta) => {
    for (let i in stories) {
        let liked = await StoryLike.exists({
            story: stories[i]._id,
            user: uid,
        });
        meta.isLiked.push(liked ? true : false);
    }
};
StoryGen.generateStoryFeed = generateStoryFeed;
StoryGen.generateMeta = generateMeta;
module.exports = StoryGen;
