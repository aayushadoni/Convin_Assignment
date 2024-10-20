import { checkExcludedPaths } from "./authExclusions.js";
import {USER} from "../models/userTypeEnum.js"
import { ValidationError } from '../handlers/errorHandlers/customError.js';
import errorMessage from '../data/messages.json' assert { type: 'json' };
import { customStatusMessage } from "../handlers/errorHandlers/statusCodes.js";

function errorFormattar(error) {
  const errors = [];
  error.details.forEach((detail) => {
    errors.push({
      message: detail.message.replace(/["]+/g, ''),
      param: detail.context.label,
    });
  });
  return errors;
}

function validateWithSchema(schema, data, next) {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    const errors = errorFormattar(error);
    const validationError = new ValidationError({ message: errors });
    return next(validationError);
  }
  return next();
}

const requestValidator = (validator) => (req, _, next) => {
  const {
    bodySchema = null,
    querySchema = null,
    pathSchema = null,
    userAllowed = [USER.ADMIN,USER.CUSTOMER],
  } = validator(req);

  const {
    body, query, params, userType, locals: { path },
  } = { ...req };

  const excluded = checkExcludedPaths({ originalUrl: path });

  if (!excluded && !userAllowed.includes(userType)) {
    const validationError = new ValidationError({
      statusCode: 403,
      message: errorMessage.authErr.userNotAuthorized,
      code: customStatusMessage.AUTH_ERROR,
    });
    return next(validationError);
  }
  if (querySchema) {
    return validateWithSchema(querySchema, query, next);
  }

  if (bodySchema) {
    return validateWithSchema(bodySchema, body, next);
  }

  if (pathSchema) {
    return validateWithSchema(pathSchema, params, next);
  }

  if (!querySchema && !bodySchema && !pathSchema) {
    return next();
  }
  return next();
};

export default requestValidator
