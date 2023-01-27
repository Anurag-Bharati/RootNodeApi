const { Story, User } = require("../models/models.wrapper");
const EntityFieldsFilter = require("../utils/entity.filter");
const StoryGen = {};
const generateStoryFeed = async (conns, feed) => {
    await Promise.all(
        conns.map(async (id) => {
            let storyUser = await User.findById(id);
            let stories = storyUser
                ? await Story.find({
                      $or: [
                          { visibility: "public" },
                          { visibility: "follower" },
                      ],
                      owner: id,
                  })
                      .sort("-createdAt")
                      .populate("owner", EntityFieldsFilter.OWNER)
                : {};
            stories.forEach((element) => {
                feed.push(element);
            });
        })
    );
};
StoryGen.generateStoryFeed = generateStoryFeed;
module.exports = StoryGen;
