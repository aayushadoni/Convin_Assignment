import { getUniqueId } from '../utility/index.js';

function addRequestId(req, _, next) {
  const requestId = getUniqueId();
  req.locals = {};
  req.locals.requestId = requestId;
  next();
}

function addMeta(req, _, next) {
  const { path } = req;
  req.locals.path = path;
  next();
}


export {
  addRequestId,
  addMeta,
};
