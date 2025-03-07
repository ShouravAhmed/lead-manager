import userRepository from "../repositories/userRepository.js";

class UserService
{
    async getUsers() {
        return await userRepository.getUsers();
    }

    async getUserById(id) {
        return await userRepository.getUserById(id);
    }

    async getUserByProperties(properties) {
        return await userRepository.getUserByProperties(properties);
    }

    async getUserByUsernameOrEmail(username) {
        return await userRepository.getUserByUsernameOrEmail(username);
    }

    async createUser(user) {
        return await userRepository.createUser(user);
    }

    async updateUser(id, user) {
        return await userRepository.updateUser(id, user);
    }

    async deleteUser(id) {
        return await userRepository.deleteUser(id);
    }
}

export default new UserService();