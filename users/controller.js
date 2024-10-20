import UserService from "./service.js"
import { cookieOptions, sendToken } from '../utility/features.js';
import { compare } from 'bcrypt';

export const register = async (req, res) => {
  const { name, email, mobileNumber, password, gender } = req.body;
  const userService = new UserService();
  const user = await userService.createUser({
    name,
    email,
    mobileNumber,
    password,
    gender,
  });
  console.log(res)

  return sendToken(res, user, 201, 'User Created Successfully!');
};

export const login = async (req, res) => {
  const { logger } = req.locals;
  const { email, password } = req.body;
  const userService = new UserService({ logger });

  const user = await userService.findUserByEmail(email);

  const isPasswordCorrect = await compare(password, user.password);
  if (!isPasswordCorrect) throw new Error('Invalid credentials');

  return sendToken(res,user, 200, `User Login Successful for ${user.name}!`);
};

export const getMyProfile = async (req) => {
  const { logger } = req.locals;
  const { userId } = req;
  const userService = new UserService({ logger });

  await userService.getUserById(userId);

  return {
    statusCode: 200,
    data: {
      message: 'User profile fetched successfully',
      user,
    },
  };
};

export const logout = async (req) => {
  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': `${sessionId}=; ${cookieOptions}; Max-Age=0`,
    },
    data: {
      message: 'Logged out successfully',
    },
  };
};
