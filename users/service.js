import mongoose from 'mongoose';
import { Api400Error } from '../handlers/errorHandlers/customError.js';
import errorMessage from '../data/messages.json' assert { type: 'json' };
import {User} from '../models/user.model.js';

class UserService {

  // Method to create a new user
  async createUser({ name, email, mobileNumber, password, gender, avatar }) {
    try {

      const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Api400Error({ message: 'Email is already registered.' });
        }

      const newUser = new User({
        name,
        email,
        mobileNumber,
        password,
        gender,
        avatar,
      });
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Api400Error({ message: errorMessage.defaultErr.badRequest });
    }
  }

  // Method to find a user by email
  async findUserByEmail(email) {
    try {
      const user = await User.findOne({ email }).select('+password');
      return user;
    } catch (error) {
      throw new Api400Error({ message: errorMessage.defaultErr.badRequest });
    }
  }

  // Method to find a user by their ID
  async getUserById(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Api400Error({ message: 'Invalid user ID' });
    }
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        throw new Api400Error({ message: errorMessage.userErr.notFound });
      }
      return user;
    } catch (error) {
      throw new Api400Error({ message: errorMessage.defaultErr.badRequest });
    }
  }

  // Method to update user details
  async updateUser(userId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Api400Error({ message: 'Invalid user ID' });
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!updatedUser) {
        throw new Api400Error({ message: errorMessage.userErr.notFound });
      }
      return updatedUser;
    } catch (error) {
      throw new Api400Error({ message: errorMessage.defaultErr.badRequest });
    }
  }

  // Method to delete a user by ID
  async deleteUserById(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Api400Error({ message: 'Invalid user ID' });
    }
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        throw new Api400Error({ message: errorMessage.userErr.notFound });
      }
      return deletedUser;
    } catch (error) {
      throw new Api400Error({ message: errorMessage.defaultErr.badRequest });
    }
  }

  // Method to check if an email is already registered
  async isEmailRegistered(email) {
    try {
      const user = await User.findOne({ email });
      return !!user;
    } catch (error) {
      throw new Api400Error({ message: errorMessage.defaultErr.badRequest });
    }
  }

  // Method to validate user credentials (for login)
  async validateUserCredentials(email, password) {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Api400Error({ message: 'Invalid credentials' });
      }
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        throw new Api400Error({ message: 'Invalid credentials' });
      }
      return user;
    } catch (error) {
      throw new Api400Error({ message: errorMessage.defaultErr.badRequest });
    }
  }
}

export default UserService;
