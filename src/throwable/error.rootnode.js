/* error start */
class ValidationError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "ValidationError";
        this.message = message;
        this.statusCode = statusCode;
    }
}
class PermissionError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "PermissionError";
        this.message = message;
        this.statusCode = statusCode;
    }
}
class DatabaseError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "DatabaseError";
        this.message = message;
        this.statusCode = statusCode;
    }
}
/* error end */

const Errors = {
    ValidationError,
    PermissionError,
    DatabaseError,
};

module.exports = Errors;
