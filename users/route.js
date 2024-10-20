import express from "express"

const router = express.Router();
import requestController from "../utility/requestController.js"
import requestValidator from "../utility/requestValidator.js"
import * as validators from "./validator.js"
import * as controllers from './controller.js';

// Register a new user
router.post(
  '/register',
  requestValidator(validators.validateRegister),
  requestController(controllers.register),
);

// Login a user
router.post(
  '/login',
  requestValidator(validators.validateLogin),
  requestController(controllers.login),
);

// Middleware to check if the user is authenticated
import { isAuthenticated } from '../middleware/auth.middleware.js';
router.use(isAuthenticated);

// Get authenticated user's profile
router.get(
  '/myProfile',
  requestController(controllers.getMyProfile),
);

// Logout a user
router.get(
  '/logout',
  requestController(controllers.logout),
);

export default router
