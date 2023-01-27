const SpecificRoutes = {};
const BaseRoutes = {};
const Routes = {};

const ROOT = process.env.API_URL || "/api/v0";

const BASE = "/";
const POST = "/post";
const AUTH = "/auth";
const USER = "/user";
const CONN = "/conn";
const STRY = "/story";
const EVNT = "/event";
const WILDCARD = "*";

const LOGIN = "/login";
const REGISTER = "/register";
const REFRESH = "/refresh";
const LOGOUT = "/logout";

const WHOAMI = "/whoami";
const ISUNIQUE = "/unique";
const OPS_LIKE = "/likeunlike";
const CMNT = "/comment";
const SEENBY = "/seenBy";
const MY = "/my";
const OPS_JOIN = "/joinleave";
const OPS_INTERESTED = "/interested";
const FEED = "/feed";

const ID_VAR = "id";
const ID_PARAM = `/:${ID_VAR}`;

/* BASE ROUTES ENUM  */
BaseRoutes.POST = ROOT + POST;
BaseRoutes.AUTH = ROOT + AUTH;
BaseRoutes.USER = ROOT + USER;
BaseRoutes.CONN = ROOT + CONN;
BaseRoutes.STRY = ROOT + STRY;
BaseRoutes.EVNT = ROOT + EVNT;
BaseRoutes.WILDCARD = WILDCARD;

/* ROUTES ENUM for ROUTER  */
Routes.BASE = BASE;

Routes.LOGIN = LOGIN;
Routes.REGISTER = REGISTER;
Routes.REFRESH = REFRESH;
Routes.LOGOUT = LOGOUT;

Routes.WHOAMI = WHOAMI;
Routes.ISUNIQUE = ISUNIQUE;
Routes.ID_PARAM = ID_PARAM;
Routes.FEED = FEED;

Routes.ID_LIKE = ID_PARAM + OPS_LIKE;
Routes.POST_CMNT = ID_PARAM + CMNT;
Routes.CMT_WITH_ID = CMNT + ID_PARAM;
Routes.CMNT_LIKE = CMNT + ID_PARAM + OPS_LIKE;

Routes.MY = MY;
Routes.JOIN_LEAVE_EVENT = ID_PARAM + OPS_JOIN;
Routes.TOGGLE_EVENT_INTERESTED = ID_PARAM + OPS_INTERESTED;

Routes.SEENBY = ID_PARAM + SEENBY;

/*  AUTH  */
SpecificRoutes.LOGIN = {
    PATH: `${ROOT}${AUTH}${LOGIN}`,
    METHOD: "POST",
    PROTECTED: false,
};
SpecificRoutes.REGISTER = {
    PATH: `${ROOT}${AUTH}${REGISTER}`,
    METHOD: "POST",
    PROTECTED: false,
};
SpecificRoutes.REFRESH = {
    PATH: `${ROOT}${AUTH}${REFRESH}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.LOGOUT = {
    PATH: `${ROOT}${AUTH}${LOGOUT}`,
    METHOD: "POST",
    PROTECTED: false,
};

/* USER  */

SpecificRoutes.GET_ALL_USER = {
    PATH: `${ROOT}${USER}`,
    METHOD: "GET",
    PROTECTED: false,
};
SpecificRoutes.WHOAMI = {
    PATH: `${ROOT}${USER}${WHOAMI}`,
    METHOD: "GET",
    PROTECTED: false,
};
SpecificRoutes.GET_USER = {
    PATH: `${ROOT}${USER}${ID_PARAM}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.UPDATE_USER = {
    PATH: `${ROOT}${USER}${ID_PARAM}`,
    METHOD: "PUT",
    PROTECTED: true,
};

/*  POST  */

SpecificRoutes.GET_PUBLIC_POST = {
    PATH: `${ROOT}${POST}`,
    METHOD: "GET",
    PROTECTED: false,
};
SpecificRoutes.CREATE_POST = {
    PATH: `${ROOT}${POST}`,
    METHOD: "POST",
    PROTECTED: true,
};
SpecificRoutes.DELETE_ALL_POST = {
    PATH: `${ROOT}${POST}`,
    METHOD: "DELETE",
    PROTECTED: true,
};

/* ==================================== */

SpecificRoutes.GET_POST = {
    PATH: `${ROOT}${POST}${ID_PARAM}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.UPDATE_POST = {
    PATH: `${ROOT}${POST}${ID_PARAM}`,
    METHOD: "PUT",
    PROTECTED: true,
};
SpecificRoutes.DELETE_POST = {
    PATH: `${ROOT}${POST}${ID_PARAM}`,
    METHOD: "DELETE",
    PROTECTED: true,
};

/* ==================================== */

SpecificRoutes.TOGGLE_POST_LIKE = {
    PATH: `${ROOT}${POST}${ID_PARAM}${OPS_LIKE}`,
    METHOD: "POST",
    PROTECTED: true,
};
SpecificRoutes.GET_POST_LIKERS = {
    PATH: `${ROOT}${POST}${ID_PARAM}${OPS_LIKE}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.GET_POST_COMMENTS = {
    PATH: `${ROOT}${POST}${ID_PARAM}${CMNT}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.CREATE_CMNT = {
    PATH: `${ROOT}${POST}${ID_PARAM}${CMNT}`,
    METHOD: "POST",
    PROTECTED: true,
};

/* ==================================== */

SpecificRoutes.GET_COMMENT = {
    PATH: `${ROOT}${POST}${CMNT}${ID_PARAM}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.UPDATE_CMNT = {
    PATH: `${ROOT}${POST}${CMNT}${ID_PARAM}`,
    METHOD: "PUT",
    PROTECTED: true,
};
SpecificRoutes.DELETE_CMNT = {
    PATH: `${ROOT}${POST}${CMNT}${ID_PARAM}`,
    METHOD: "DELETE",
    PROTECTED: true,
};

/* ==================================== */

SpecificRoutes.TOGGLE_CMNT_LIKE = {
    PATH: `${ROOT}${POST}${CMNT}${ID_PARAM}${OPS_LIKE}`,
    METHOD: "POST",
    PROTECTED: true,
};
SpecificRoutes.GET_CMNT_LIKERS = {
    PATH: `${ROOT}${POST}${CMNT}${ID_PARAM}${OPS_LIKE}`,
    METHOD: "GET",
    PROTECTED: true,
};

/* CONN */

SpecificRoutes.GET_MY_CONN = {
    PATH: `${ROOT}${CONN}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.CHECK_IF_IM_CONN = {
    PATH: `${ROOT}${CONN}${ID_PARAM}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.SEND_CONN_REQ = {
    PATH: `${ROOT}${CONN}${ID_PARAM}`,
    METHOD: "POST",
    PROTECTED: true,
};
SpecificRoutes.UPDATE_CONN_STATUS = {
    PATH: `${ROOT}${CONN}${ID_PARAM}`,
    METHOD: "PUT",
    PROTECTED: true,
};

/* STORY */

SpecificRoutes.GET_PUBLIC_STORIES = {
    PATH: `${ROOT}${STRY}`,
    METHOD: "GET",
    PROTECTED: false,
};
SpecificRoutes.CREATE_STORY = {
    PATH: `${ROOT}${STRY}`,
    METHOD: "POST",
    PROTECTED: true,
};
SpecificRoutes.DELETE_ALL_STORIES = {
    PATH: `${ROOT}${STRY}`,
    METHOD: "DELETE",
    PROTECTED: true,
};
SpecificRoutes.GET_STORY = {
    PATH: `${ROOT}${STRY}${ID_PARAM}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.UPDATE_STORY = {
    PATH: `${ROOT}${STRY}${ID_PARAM}`,
    METHOD: "PUT",
    PROTECTED: true,
};
SpecificRoutes.DELETE_STORY = {
    PATH: `${ROOT}${STRY}${ID_PARAM}`,
    METHOD: "DELETE",
    PROTECTED: true,
};
SpecificRoutes.GET_STORY_LIKERS = {
    PATH: `${ROOT}${STRY}${ID_PARAM}${OPS_LIKE}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.TOGGLE_STORY_LIKE = {
    PATH: `${ROOT}${STRY}${ID_PARAM}${OPS_LIKE}`,
    METHOD: "POST",
    PROTECTED: true,
};
SpecificRoutes.GET_STORY_WATCHERS = {
    PATH: `${ROOT}${STRY}${ID_PARAM}${SEENBY}`,
    METHOD: "GET",
    PROTECTED: true,
};

/* EVENT */
SpecificRoutes.GET_PUBLIC_EVENTS = {
    PATH: `${ROOT}${EVNT}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.CREATE_EVENT = {
    PATH: `${ROOT}${EVNT}`,
    METHOD: "POST",
    PROTECTED: true,
};
SpecificRoutes.DELETE_ALL_EVENTS = {
    PATH: `${ROOT}${EVNT}`,
    METHOD: "DELETE",
    PROTECTED: true,
};
SpecificRoutes.GET_MY_EVENTS = {
    PATH: `${ROOT}${EVNT}${MY}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.GET_EVENT = {
    PATH: `${ROOT}${EVNT}${ID_PARAM}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.UPDATE_EVENT = {
    PATH: `${ROOT}${EVNT}${ID_PARAM}`,
    METHOD: "PUT",
    PROTECTED: true,
};
SpecificRoutes.DELETE_EVENT = {
    PATH: `${ROOT}${EVNT}${ID_PARAM}`,
    METHOD: "DELETE",
    PROTECTED: true,
};
SpecificRoutes.GET_EVENT_CANDIDATES = {
    PATH: `${ROOT}${EVNT}${ID_PARAM}${OPS_JOIN}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.JOIN_LEAVE_EVENT = {
    PATH: `${ROOT}${EVNT}${ID_PARAM}${OPS_JOIN}`,
    METHOD: "POST",
    PROTECTED: true,
};
SpecificRoutes.GET_EVENT_INTERESTED = {
    PATH: `${ROOT}${EVNT}${ID_PARAM}${OPS_INTERESTED}`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.TOGGLE_EVENT_INTERESTED = {
    PATH: `${ROOT}${EVNT}${ID_PARAM}${OPS_INTERESTED}`,
    METHOD: "POST",
    PROTECTED: true,
};

module.exports = { BaseRoutes, Routes, SpecificRoutes };
