class ServiceException extends Error
{
    constructor(status, message) {
        super(message);

        // assign the error class name in custom error
        this.name = this.constructor.name;

        // keep refrence to the custom error class
        Error.captureStackTrace(this, this.constructor);

        this.message = message;
        this.status = status;
    }
}

module.exports = ServiceException;