/* exception start */
class IllegalArgumentException extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "IllegalArgument";
        this.message = message;
        this.statusCode = statusCode;
    }
}
class ResourceNotFoundException extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "ResourceNotFound";
        this.message = message;
        this.statusCode = statusCode;
    }
}
/* exception end */

const Exceptions = {
    IllegalArgumentException,
    ResourceNotFoundException,
};

module.exports = Exceptions;
