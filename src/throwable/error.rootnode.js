/* error start */
class ValidationError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = "ValidationError";
        this.message = message;
        this.statusCode = statusCode;
    }
}
class PermissionError extends Error {
    constructor(message, statusCode = 401) {
        super(message);
        this.name = "PermissionError";
        this.message = message;
        this.statusCode = statusCode;
    }
}
class DatabaseError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = "DatabaseError";
        this.message = message;
        this.statusCode = statusCode;
    }
}
class NotImplementedError extends Error {
    constructor(message, statusCode = 501) {
        super(message);
        this.name = "NotImplemented";
        this.message = message;
        this.statusCode = statusCode;
    }
}
class RouteNotFoundError extends Error {
    constructor(message, statusCode = 404) {
        super(message);
        this.name = "RouteNotFound";
        this.message = message;
        this.statusCode = statusCode;
    }
}
/* error end */

const Errors = {
    ValidationError,
    PermissionError,
    DatabaseError,
    NotImplementedError,
    RouteNotFoundError,
};

module.exports = Errors;
