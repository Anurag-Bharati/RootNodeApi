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
const OPS_LIKE = "/like-unlike";
const CMNT = "/comment";
const SEENBY = "/seen-by";
const MY = "/my";
const OPS_JOIN = "/join-leave";
const OPS_INTERESTED = "/interested";
const FEED = "/feed";
const OLD_RECENT_CONNS = "/old-recent";
const RECOM = "/recom";
const RANDOM = "/random";
const RECENT_MSG = "/msg/recent";

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
Routes.RECOM = RECOM;
Routes.RANDOM = RANDOM;
Routes.OLD_RECENT_CONNS = OLD_RECENT_CONNS;

Routes.ID_LIKE = ID_PARAM + OPS_LIKE;
Routes.POST_CMNT = ID_PARAM + CMNT;
Routes.CMT_WITH_ID = CMNT + ID_PARAM;
Routes.CMNT_LIKE = CMNT + ID_PARAM + OPS_LIKE;
Routes.RECENT_MSG = RECENT_MSG;

Routes.MY = MY;
Routes.JOIN_LEAVE_EVENT = ID_PARAM + OPS_JOIN;
Routes.TOGGLE_EVENT_INTERESTED = ID_PARAM + OPS_INTERESTED;

Routes.SEENBY = ID_PARAM + SEENBY;

/*  AUTH  */
SpecificRoutes.LOGIN = {
    path: `${ROOT}${AUTH}${LOGIN}`,
    method: "POST",
    protected: false,
};
SpecificRoutes.REGISTER = {
    path: `${ROOT}${AUTH}${REGISTER}`,
    method: "POST",
    protected: false,
};
SpecificRoutes.REFRESH = {
    path: `${ROOT}${AUTH}${REFRESH}`,
    method: "GET",
    protected: true,
};
SpecificRoutes.LOGOUT = {
    path: `${ROOT}${AUTH}${LOGOUT}`,
    method: "POST",
    protected: false,
};

/* USER  */

SpecificRoutes.GET_ALL_USER = {
    path: `${ROOT}${USER}`,
    method: "GET",
    protected: false,
};
SpecificRoutes.WHOAMI = {
    path: `${ROOT}${USER}${WHOAMI}`,
    method: "GET",
    protected: false,
};
SpecificRoutes.CHECK_USERNAME_UNIQUE = {
    path: `${ROOT}${USER}${ISUNIQUE}`,
    method: "GET",
    protected: false,
    params: ["username"],
};
SpecificRoutes.GET_USER = {
    path: `${ROOT}${USER}`,
    method: "GET",
    protected: true,
};
SpecificRoutes.UPDATE_USER = {
    path: `${ROOT}${USER}`,
    method: "PUT",
    protected: true,
};

/*  POST  */

SpecificRoutes.GET_PUBLIC_POST = {
    path: `${ROOT}${POST}`,
    method: "GET",
    protected: false,
};
SpecificRoutes.GET_POST_FEED = {
    path: `${ROOT}${POST}${FEED}`,
    method: "GET",
    protected: true,
};
SpecificRoutes.CREATE_POST = {
    path: `${ROOT}${POST}`,
    method: "POST",
    protected: true,
};
SpecificRoutes.DELETE_ALL_POST = {
    path: `${ROOT}${POST}`,
    method: "DELETE",
    protected: true,
};

/* ==================================== */

SpecificRoutes.GET_POST = (id) => {
    return {
        path: `${ROOT}${POST}/${id}`,
        method: "GET",
        protected: true,
    };
};
SpecificRoutes.UPDATE_POST = (id) => {
    return {
        path: `${ROOT}${POST}/${id}`,
        method: "PUT",
        protected: true,
    };
};
SpecificRoutes.DELETE_POST = (id) => {
    return {
        path: `${ROOT}${POST}/${id}`,
        method: "DELETE",
        protected: true,
    };
};

/* ==================================== */

SpecificRoutes.TOGGLE_POST_LIKE = (id) => {
    return {
        path: `${ROOT}${POST}/${id}${OPS_LIKE}`,
        method: "POST",
        protected: true,
    };
};
SpecificRoutes.GET_POST_LIKERS = (id) => {
    return {
        path: `${ROOT}${POST}/${id}${OPS_LIKE}`,
        method: "GET",
        protected: true,
    };
};
SpecificRoutes.GET_POST_COMMENTS = (id) => {
    return {
        path: `${ROOT}${POST}/${id}${CMNT}`,
        method: "GET",
        protected: true,
    };
};
SpecificRoutes.CREATE_CMNT = (id) => {
    return {
        path: `${ROOT}${POST}/${id}${CMNT}`,
        method: "POST",
        protected: true,
    };
};

/* ==================================== */

SpecificRoutes.GET_COMMENT = (id) => {
    return {
        path: `${ROOT}${POST}${CMNT}/${id}`,
        method: "GET",
        protected: true,
    };
};
SpecificRoutes.UPDATE_CMNT = (id) => {
    return {
        path: `${ROOT}${POST}${CMNT}/${id}`,
        method: "PUT",
        protected: true,
    };
};
SpecificRoutes.DELETE_CMNT = (id) => {
    return {
        path: `${ROOT}${POST}${CMNT}/${id}`,
        method: "DELETE",
        protected: true,
    };
};

/* ==================================== */

SpecificRoutes.TOGGLE_CMNT_LIKE = (id) => {
    return {
        path: `${ROOT}${POST}${CMNT}/${id}${OPS_LIKE}`,
        method: "POST",
        protected: true,
    };
};
SpecificRoutes.GET_CMNT_LIKERS = (id) => {
    return {
        path: `${ROOT}${POST}${CMNT}/${id}${OPS_LIKE}`,
        method: "GET",
        protected: true,
    };
};

/* CONN */

SpecificRoutes.GET_MY_CONN = {
    path: `${ROOT}${CONN}`,
    method: "GET",
    protected: true,
};
SpecificRoutes.OLD_RECENT_CONNS = {
    path: `${ROOT}${CONN}${OLD_RECENT_CONNS}`,
    method: "GET",
    protected: true,
};
SpecificRoutes.RECOM = {
    path: `${ROOT}${CONN}${RECOM}`,
    method: "GET",
    protected: true,
};
SpecificRoutes.RANDOM = {
    path: `${ROOT}${CONN}${RANDOM}`,
    method: "GET",
    protected: true,
};
SpecificRoutes.CHECK_IF_IM_CONN = (id) => {
    return {
        path: `${ROOT}${CONN}/${id}`,
        method: "GET",
        protected: true,
    };
};
SpecificRoutes.TOGGLE_CONNECTION_REQ = (id) => {
    return {
        path: `${ROOT}${CONN}/${id}`,
        method: "POST",
        protected: true,
    };
};
SpecificRoutes.UPDATE_CONN_STATUS = (id) => {
    return {
        path: `${ROOT}${CONN}/${id}`,
        method: "PUT",
        protected: true,
    };
};

/* STORY */

SpecificRoutes.GET_PUBLIC_STORIES = {
    path: `${ROOT}${STRY}`,
    method: "GET",
    protected: false,
};
SpecificRoutes.GET_STORY_FEED = {
    path: `${ROOT}${STRY}${FEED}`,
    method: "GET",
    protected: true,
};
SpecificRoutes.CREATE_STORY = {
    path: `${ROOT}${STRY}`,
    method: "POST",
    protected: true,
};
SpecificRoutes.DELETE_ALL_STORIES = {
    path: `${ROOT}${STRY}`,
    method: "DELETE",
    protected: true,
};
SpecificRoutes.GET_STORY = (id) => {
    return {
        path: `${ROOT}${STRY}/${id}`,
        method: "GET",
        protected: true,
    };
};
SpecificRoutes.UPDATE_STORY = (id) => {
    return {
        path: `${ROOT}${STRY}/${id}`,
        method: "PUT",
        protected: true,
    };
};
SpecificRoutes.DELETE_STORY = (id) => {
    return {
        path: `${ROOT}${STRY}/${id}`,
        method: "DELETE",
        protected: true,
    };
};
SpecificRoutes.GET_STORY_LIKERS = (id) => {
    return {
        path: `${ROOT}${STRY}/${id}${OPS_LIKE}`,
        method: "GET",
        protected: true,
    };
};
SpecificRoutes.TOGGLE_STORY_LIKE = (id) => {
    return {
        path: `${ROOT}${STRY}/${id}${OPS_LIKE}`,
        method: "POST",
        protected: true,
    };
};
SpecificRoutes.GET_STORY_WATCHERS = (id) => {
    return {
        path: `${ROOT}${STRY}/${id}${SEENBY}`,
        method: "GET",
        protected: true,
    };
};

/* EVENT */
SpecificRoutes.GET_PUBLIC_EVENTS = {
    path: `${ROOT}${EVNT}`,
    method: "GET",
    protected: true,
};
SpecificRoutes.CREATE_EVENT = {
    path: `${ROOT}${EVNT}`,
    method: "POST",
    protected: true,
};
SpecificRoutes.DELETE_ALL_EVENTS = {
    path: `${ROOT}${EVNT}`,
    method: "DELETE",
    protected: true,
};
SpecificRoutes.GET_MY_EVENTS = {
    path: `${ROOT}${EVNT}${MY}`,
    method: "GET",
    protected: true,
};
SpecificRoutes.GET_EVENT = (id) => {
    return {
        path: `${ROOT}${EVNT}/${id}`,
        method: "GET",
        protected: true,
    };
};
SpecificRoutes.UPDATE_EVENT = (id) => {
    return {
        path: `${ROOT}${EVNT}/${id}`,
        method: "PUT",
        protected: true,
    };
};
SpecificRoutes.DELETE_EVENT = (id) => {
    return {
        path: `${ROOT}${EVNT}/${id}`,
        method: "DELETE",
        protected: true,
    };
};
SpecificRoutes.GET_EVENT_CANDIDATES = (id) => {
    return {
        path: `${ROOT}${EVNT}/${id}${OPS_JOIN}`,
        method: "GET",
        protected: true,
    };
};
SpecificRoutes.JOIN_LEAVE_EVENT = (id) => {
    return {
        path: `${ROOT}${EVNT}/${id}${OPS_JOIN}`,
        method: "POST",
        protected: true,
    };
};
SpecificRoutes.GET_EVENT_INTERESTED = (id) => {
    return {
        path: `${ROOT}${EVNT}/${id}${OPS_INTERESTED}`,
        method: "GET",
        protected: true,
    };
};
SpecificRoutes.TOGGLE_EVENT_INTERESTED = (id) => {
    return {
        path: `${ROOT}${EVNT}/${id}${OPS_INTERESTED}`,
        method: "POST",
        protected: true,
    };
};

module.exports = { BaseRoutes, Routes, SpecificRoutes };
