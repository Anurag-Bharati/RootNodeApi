const SpecificRoutes = {};
const BaseRoutes = {};

const ROOT = process.env.API_URL || "/api/v0";

const POST = "/post";
const AUTH = "/auth";
const USER = "/user";
const CONN = "/conn";
const STRY = "/story";
const EVNT = "/event";

const WHOAMI = "/whoami";
const OPS_LIKE = "/likeunlike";
const CMNT = "/comment";

const ID_VAR = "id";
const ID_PARAM = `/:${ID_VAR}`;

BaseRoutes.POST_LIKE = `${ID_PARAM}${OPS_LIKE}`;
BaseRoutes.POST_CMNT = `${ID_PARAM}${CMNT}`;
BaseRoutes.CMT_WITH_ID = `${CMNT}${ID_PARAM}`;
BaseRoutes.CMT_WITH_ID = `${CMNT}${ID_PARAM}`;
BaseRoutes.CMNT_LIKE = `${CMNT}${ID_PARAM}${OPS_LIKE}`;

/*  AUTH  */

SpecificRoutes.LOGIN = {
    PATH: `${ROOT}${AUTH}/login`,
    METHOD: "POST",
    PROTECTED: false,
};
SpecificRoutes.REGISTER = {
    PATH: `${ROOT}${AUTH}/register`,
    METHOD: "POST",
    PROTECTED: false,
};
SpecificRoutes.REFRESH = {
    PATH: `${ROOT}${AUTH}/refresh`,
    METHOD: "GET",
    PROTECTED: true,
};
SpecificRoutes.LOGOUT = {
    PATH: `${ROOT}${AUTH}/logout`,
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

// TODO

/* EVENT */

// TODO

module.exports = SpecificRoutes;
