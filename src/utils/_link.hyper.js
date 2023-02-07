const { SpecificRoutes } = require("../config/constant");

const HyperLinks = {};

const authLinks = {
    register: SpecificRoutes.REGISTER,
    login: SpecificRoutes.LOGIN,
    renewAccessToken: SpecificRoutes.REFRESH,
    logout: SpecificRoutes.LOGOUT,
};

const userLinks = {
    allUser: SpecificRoutes.GET_ALL_USER,
    whoAmI: SpecificRoutes.WHOAMI,
    logout: SpecificRoutes.LOGOUT,
};

const userOpsLink = {
    getUser: SpecificRoutes.GET_USER,
    updateUser: SpecificRoutes.UPDATE_USER,
    renewAccessToken: SpecificRoutes.REFRESH,
    checkUsernameUnique: SpecificRoutes.CHECK_USERNAME_UNIQUE,
};

const postLinks = {
    publicPosts: SpecificRoutes.GET_PUBLIC_POST,
    addPost: SpecificRoutes.CREATE_POST,
    myFeed: SpecificRoutes.GET_POST_FEED,
};

const postOpsLinks = (id) => {
    return {
        likeUnlike: SpecificRoutes.TOGGLE_POST_LIKE(id),
        addComment: SpecificRoutes.CREATE_CMNT(id),
        viewComments: SpecificRoutes.GET_POST_COMMENTS(id),
        viewPostLikes: SpecificRoutes.GET_POST_LIKERS(id),
        updatePost: SpecificRoutes.UPDATE_POST(id),
        deletePost: SpecificRoutes.DELETE_POST(id),
    };
};

const commentOpsLinks = (id) => {
    return {
        viewCommentLikes: SpecificRoutes.GET_CMNT_LIKERS(id),
        likeUnlike: SpecificRoutes.TOGGLE_CMNT_LIKE(id),
        updateComment: SpecificRoutes.UPDATE_CMNT(id),
        deleteComment: SpecificRoutes.DELETE_CMNT(id),
    };
};

const connLinks = {
    myConnections: SpecificRoutes.GET_MY_CONN,
    connOverview: SpecificRoutes.OLD_RECENT_CONNS,
    recommended: SpecificRoutes.RECOM,
    random: SpecificRoutes.RANDOM,
};
const connOpsLinks = (id) => {
    return {
        checkConnection: SpecificRoutes.CHECK_IF_IM_CONN(id),
        toggleConnection: SpecificRoutes.TOGGLE_CONNECTION_REQ(id),
        updateConnectionStatus: SpecificRoutes.UPDATE_CONN_STATUS(id),
    };
};

const storyLinks = {
    publicStories: SpecificRoutes.GET_PUBLIC_STORIES,
    myFeed: SpecificRoutes.GET_STORY_FEED,
    addStory: SpecificRoutes.CREATE_STORY,
};

const storyOpsLinks = (id) => {
    return {
        likeUnlike: SpecificRoutes.TOGGLE_STORY_LIKE(id),
        viewLikes: SpecificRoutes.GET_STORY_LIKERS(id),
        viewWatcher: SpecificRoutes.GET_STORY_WATCHERS(id),
        updateStory: SpecificRoutes.UPDATE_STORY(id),
        deleteStory: SpecificRoutes.DELETE_STORY(id),
    };
};

const eventLinks = {
    publicEvents: SpecificRoutes.GET_PUBLIC_EVENTS,
    addEvent: SpecificRoutes.CREATE_EVENT,
    myEvents: SpecificRoutes.GET_MY_EVENTS,
};

const eventOpsLinks = (id) => {
    return {
        viewInterested: SpecificRoutes.GET_EVENT_INTERESTED(id),
        viewAttendees: SpecificRoutes.GET_EVENT_CANDIDATES(id),
        joinLeaveEvent: SpecificRoutes.JOIN_LEAVE_EVENT(id),
        toggleInterest: SpecificRoutes.TOGGLE_EVENT_INTERESTED(id),
        updateEvent: SpecificRoutes.UPDATE_EVENT(id),
        deleteEvent: SpecificRoutes.DELETE_EVENT(id),
    };
};

HyperLinks.authLinks = authLinks;
HyperLinks.userLinks = userLinks;
HyperLinks.userOpsLink = userOpsLink;
HyperLinks.postLinks = postLinks;
HyperLinks.postOpsLinks = postOpsLinks;
HyperLinks.commentOpsLinks = commentOpsLinks;
HyperLinks.connLinks = connLinks;
HyperLinks.connOpsLinks = connOpsLinks;
HyperLinks.storyLinks = storyLinks;
HyperLinks.storyOpsLinks = storyOpsLinks;
HyperLinks.eventLinks = eventLinks;
HyperLinks.eventOpsLinks = eventOpsLinks;
module.exports = HyperLinks;
