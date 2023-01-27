const { Story, User } = require("../models/models.wrapper");
const EntityFieldsFilter = require("../utils/entity.filter");
const StoryGen = {};
const generateStoryFeed = async (uid, conns, feed) => {
    await Promise.all(
        conns.map(async (id) => {
            let storyUser = await User.findById(id);
            let stories = storyUser
                ? await Story.find({
                      $or: [
                          { visibility: "public" },
                          { visibility: "follower" },
                      ],

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
StoryGen.generateStoryFeed = generateStoryFeed;
module.exports = StoryGen;
