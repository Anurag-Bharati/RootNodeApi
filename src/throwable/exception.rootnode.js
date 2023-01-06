/* exception start */
class IllegalArgumentException extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = "IllegalArgument";
        this.message = message;
        this.statusCode = statusCode;
    }
}
class EntityNotFoundException extends Error {
    constructor(message, statusCode = 404) {
        super(message);
        this.name = "EntityNotFound";
        this.message = message;
        this.statusCode = statusCode;
    }
}
class EntityConflictException extends Error {
    constructor(message, statusCode = 409) {
        super(message);
        this.name = "EntityConflict";
        this.message = message;
        this.statusCode = statusCode;
    }
}
class FieldNotMatchedException extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = "FieldNotMatched";
        this.message = message;
        this.statusCode = statusCode;
    }
}
class ResourceNotFoundException extends Error {
    constructor(message, statusCode = 404) {
        super(message);
        this.name = "ResourceNotFound";
        this.message = message;
        this.statusCode = statusCode;
    }
}
class InvalidMediaTypeException extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = "InvalidMediaType";
        this.message = message;
        this.statusCode = statusCode;
    }
}
class IllegalPostTypeExecption extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = "IllegalPostType";
        this.message = message;
        this.statusCode = statusCode;
    }
}
/* exception end */

const Exceptions = {
    IllegalArgumentException,
    ResourceNotFoundException,
    EntityNotFoundException,
    EntityConflictException,
    FieldNotMatchedException,
    InvalidMediaTypeException,
    IllegalPostTypeExecption,
};

module.exports = Exceptions;
