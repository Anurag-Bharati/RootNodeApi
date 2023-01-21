const { Story, StoryLike } = require("../models/models.wrapper");

const getAllPublicStories = (req, res, next) => {};
const createStory = (req, res, next) => {};
const deleteAllStories = (req, res, next) => {};

const getStoryById = (req, res, next) => {};
const updateStoryById = (req, res, next) => {};
const deleteStoryById = (req, res, next) => {};

const getStoryLiker = (req, res, next) => {};
const likeUnlikeStory = (req, res, next) => {};

const getStoryWatcher = (req, res, next) => {};

module.exports = {
    getAllPublicStories,
    createStory,
    deleteAllStories,
    getStoryById,
    updateStoryById,
    deleteStoryById,
    getStoryLiker,
    likeUnlikeStory,
    getStoryWatcher,
};
