const { isValidObjectId } = require("mongoose");
const {
    Event,
    EventInterested,
    EventCandidate,
} = require("../models/models.wrapper");

const {
    IllegalArgumentException,
    ResourceNotFoundException,
} = require("../throwable/exception.rootnode");
const HyperLinks = require("../utils/_link.hyper");

/* constraints start*/
const eventPerPage = 5;
const candidatePerPage = 10;
const intrestedPerPage = 10;
/* constraints end*/

const getAllPublicEvents = async (req, res, next) => {
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    const filter = { status: "active", visibility: "public", housefull: false };
    try {
        const eventsPromise = Event.find(filter)
            .sort("-intrested -date")
            .limit(eventPerPage)
            .skip((page - 1) * eventPerPage)
            .exec();
        const countPromise = Event.countDocuments(filter);
        const [events, count] = await Promise.all([
            eventsPromise,
            countPromise,
        ]);
        res.json({
            success: true,
            data: events,
            totalPages: Math.ceil(count / eventPerPage),
            currentPage: Number(page),
            _links: {
                post: HyperLinks.postLinks,
                story: HyperLinks.storyLinks,
                self: HyperLinks.eventLinks,
            },
        });
    } catch (err) {
        next(err);
    }
};

const getEventById = async (req, res, next) => {
    const id = req.params.id;
    try {
        if (!id) throw new IllegalArgumentException("Missing event id");
        if (!isValidObjectId(id))
            throw new IllegalArgumentException("Invalid event id");
        const event = await Event.findById(id);
        if (!event) throw new ResourceNotFoundException("Event not found");
        res.json({
            success: true,
            data: event,
            _links: { self: HyperLinks.eventOpsLinks(id) },
        });
    } catch (err) {
        next(err);
    }
};
const getAllMyEvents = async (req, res, next) => {
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    try {
        const eventsPromise = Event.find({ runner: req.user._id })
            .sort("-createdAt")
            .limit(eventPerPage)
            .skip((page - 1) * eventPerPage)
            .exec();
        const countPromise = Event.countDocuments({ runner: req.user._id });
        const [events, count] = await Promise.all([
            eventsPromise,
            countPromise,
        ]);
        res.json({
            success: true,
            data: events,
            totalPages: Math.ceil(count / eventPerPage),
            currentPage: Number(page),
            _links: { self: HyperLinks.eventLinks },
        });
    } catch (err) {
        next(err);
    }
};

const addEvent = async (req, res, next) => {
    const { type, title, subtitle, location, coordinates, date, visibility } =
        req.body;

    const logo = req.file;
    const hasLogo = logo !== null && logo !== undefined;
    const uid = req.user._id;
    let cleanedLogo = null;
    try {
        if ((!title && !location, !date))
            throw new IllegalArgumentException("Missing event parameters");

        // TODO handle cover image
        if (hasLogo) {
            cleanedLogo = media.path;
        }

        const event = await Event.create({
            runner: uid,
            date: date,
            type: type,
            title: title,
            subtitle: subtitle,
            location: location,
            visibility: visibility,
            coordinates: coordinates,
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully!",
            data: event,
            _links: { self: HyperLinks.eventLinks },
        });
    } catch (err) {
        next(err);
    }
};

const updateEventById = async (req, res, next) => {
    const id = req.params.id;
    try {
        if (!id) throw new IllegalArgumentException("Missing event Id");
        const validId = isValidObjectId(id);
        if (!validId) throw new IllegalArgumentException("Invalid event id");
        const event = await Event.findById(id);
        // TODO check owner
        if (!event) throw new ResourceNotFoundException("Event not found");
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        res.json({
            success: true,
            data: updatedEvent,
            _links: {
                self: HyperLinks.eventOpsLinks(id),
            },
        });
    } catch (err) {
        next(err);
    }
};

const deleteAllEvents = async (req, res, next) => {
    const [interested, candidates, event] = await Promise.all([
        EventInterested.find(),
        EventCandidate.find(),
        Event.find(),
    ]);

    interested.forEach(async (i) => i.remove());
    candidates.forEach(async (c) => c.remove());
    event.forEach(async (e) => e.remove());

    res.json({ success: true, message: "All events cleared!" });
};

const deleteEventById = async (req, res, next) => {
    const id = req.params.id;
    try {
        if (!id) throw new IllegalArgumentException("Missing event id");
        const validId = isValidObjectId(id);
        if (!validId) throw new IllegalArgumentException("Invalid event id");
        // TODO check owner
        const result = await Event.findByIdAndDelete(id);
        if (!result) throw new ResourceNotFoundException("Event not found");
        res.json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const joinLeaveEvent = async (req, res, next) => {
    const id = req.params.id;
    const uid = req.user._id;
    try {
        if (!id) throw new IllegalArgumentException("Missing event id");
        const event = await Event.findById(id).select(["_id", "attending"]);
        if (!event) throw new ResourceNotFoundException("Event not found");
        const hasJoined = await EventCandidate.findOne({
            event: id,
            candidate: uid,
        });
        if (hasJoined) {
            event.attending--;
            // concurrency
            await Promise.all([hasJoined.remove(), event.save()]);

            res.json({
                success: true,
                reply: "Event leaved successfully!",
                data: { joined: false },
            });
        } else {
            event.attending++;
            await Promise.all([
                EventCandidate.create({ event: id, candidate: uid }),
                event.save(),
            ]);
            res.json({
                success: true,
                message: "Event joined successfully!",
                data: { joined: true },
                _links: { self: HyperLinks.eventOpsLinks(id) },
            });
        }
    } catch (err) {
        next(err);
    }
};
const interesedEventToggle = async (req, res, next) => {
    const id = req.params.id;
    const uid = req.user._id;
    try {
        if (!id) throw new IllegalArgumentException("Missing event id");
        const event = await Event.findById(id).select(["_id", "interested"]);
        if (!event) throw new ResourceNotFoundException("Event not found");
        const isIntrested = await EventInterested.findOne({
            event: id,
            interested: uid,
        });
        if (isIntrested) {
            event.interested--;
            // concurrency
            await Promise.all([isIntrested.remove(), event.save()]);

            res.json({
                success: true,
                reply: "Event marked as uninterested!",
                data: { interested: false },
            });
        } else {
            event.interested++;
            await Promise.all([
                EventInterested.create({ event: id, interested: uid }),
                event.save(),
            ]);
            res.json({
                success: true,
                message: "Event marked as interested!",
                data: { interested: true },
                _links: { self: HyperLinks.eventOpsLinks(id) },
            });
        }
    } catch (err) {
        next(err);
    }
};

const getEventCandidates = async (req, res, next) => {
    const id = req.params.id;
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    try {
        if (!id) throw new IllegalArgumentException("Missing event id");
        if (!isValidObjectId(id))
            throw new IllegalArgumentException("Invalid event id");

        const event = await Event.exists({ _id: id });
        if (!event) throw new ResourceNotFoundException("Event not found");

        const candidatePromise = EventCandidate.find({ event: id })
            .select("user createdAt")
            .populate("candidate", ["username", "showOnlineStatus", "avatar"])
            .sort("-createdAt")
            .limit(candidatePerPage)
            .skip((page - 1) * candidatePerPage)
            .exec();

        const countPromise = EventCandidate.find({
            event: id,
        }).countDocuments();

        const [candidates, count] = await Promise.all([
            candidatePromise,
            countPromise,
        ]);

        res.json({
            success: true,
            data: candidates,
            totalPages: Math.ceil(count / candidatePerPage),
            currentPage: Number(page),
            _links: { self: HyperLinks.eventOpsLinks(id) },
        });
    } catch (err) {
        next(err);
    }
};
const getEventInterested = async (req, res, next) => {
    const id = req.params.id;
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    try {
        if (!id) throw new IllegalArgumentException("Missing event id");
        if (!isValidObjectId(id))
            throw new IllegalArgumentException("Invalid event id");

        const event = await Event.exists({ _id: id });
        if (!event) throw new ResourceNotFoundException("Event not found");

        const interestedPromise = EventInterested.find({ event: id })
            .select("user createdAt")
            .populate("interested", ["username", "showOnlineStatus", "avatar"])
            .sort("-createdAt")
            .limit(intrestedPerPage)
            .skip((page - 1) * intrestedPerPage)
            .exec();

        const countPromise = EventInterested.find({
            event: id,
        }).countDocuments();

        const [interested, count] = await Promise.all([
            interestedPromise,
            countPromise,
        ]);

        res.json({
            success: true,
            data: interested,
            totalPages: Math.ceil(count / intrestedPerPage),
            currentPage: Number(page),
            _links: { self: HyperLinks.eventOpsLinks(id) },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllPublicEvents,
    getEventById,
    getAllMyEvents,
    addEvent,
    updateEventById,
    deleteEventById,
    deleteAllEvents,
    joinLeaveEvent,
    interesedEventToggle,
    getEventCandidates,
    getEventInterested,
};
