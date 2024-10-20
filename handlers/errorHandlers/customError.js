/* eslint-disable max-classes-per-file */
import { httpStatusCodes, customStatusMessage } from './statusCodes.js';

class ExpenseError extends Error {
  constructor(name, statusCode, message, displayMessage, code) {
    super(name);

    this.statusCode = statusCode;
    this.message = message;
    this.displayMessage = displayMessage;
    this.code = code;
    Error.captureStackTrace(this);
  }
}

class Api400Error extends ExpenseError {
  constructor({
    name = 'Bad Request',
    statusCode = httpStatusCodes.BAD_REQUEST,
    message = 'Invalid Request',
    displayMessage = 'Invalid Request',
    code = customStatusMessage.BAD_REQUEST,
  }) {
    super(name, statusCode, message, displayMessage, code);
  }
}

class Api500Error extends ExpenseError {
  constructor({
    name = 'Internal Server Error',
    statusCode = httpStatusCodes.INTERNAL_SERVER,
    message = 'Server Error Please try again later',
    displayMessage = 'Server Error Please try again later',
    code = customStatusMessage.INTERNAL_SERVER,
  }) {
    super(name, statusCode, message, displayMessage, code);
  }
}

class ValidationError extends ExpenseError {
  constructor({
    name = 'Validation Error',
    statusCode = httpStatusCodes.BAD_REQUEST,
    message = 'Some Fields are missing',
    displayMessage = 'Something went wrong!',
    code = customStatusMessage.VALIDATION_ERR,
  }) {
    super(name, statusCode, message, displayMessage, code);
  }
}

export {
  ExpenseError,
  Api400Error,
  Api500Error,
  ValidationError,
};
