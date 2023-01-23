const { isValidObjectId } = require("mongoose");
const {
    User,
    Event,
    EventInterested,
    EventCandidate,
} = require("../models/models.wrapper");

/* constraints start*/
const candidatePerPage = 10;
const intrestedPerPage = 10;
/* constraints end*/

const getAllPublicEvents = async (req, res, next) => {};
const getEventById = async (req, res, next) => {};
const getAllMyEvents = async (req, res, next) => {};

const addEvent = async (req, res, next) => {};
const updateEventById = async (req, res, next) => {};
const deleteEventById = async (req, res, next) => {};

const joinLeaveEvent = async (req, res, next) => {};
const interesedEventToggle = async (req, res, next) => {};

const getEventCandidates = async (req, res, next) => {};
const getEventInterested = async (req, res, next) => {};

module.exports = {
    getAllPublicEvents,
    getEventById,
    getAllMyEvents,
    addEvent,
    updateEventById,
    deleteEventById,
    joinLeaveEvent,
    interesedEventToggle,
    getEventCandidates,
    getEventInterested,
};
