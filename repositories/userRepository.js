import User from '../models/User.js';

class UserRepository {
  async getUsers() {
    return await User.find();
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async getUserByProperties(properties) {
    return await User.findOne(properties);
  }

  async getUserByUsernameOrEmail(usernameOrEmail) {
    return await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
  }

  async createUser(user) {
    return await User.create(user);
  }

  async updateUser(id, user) {
    return await User.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true,
    });
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }
}

export default new UserRepository();
