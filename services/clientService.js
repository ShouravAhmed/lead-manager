import clientRepository from "../repositories/clientRepository.js";

class ClientService{
    async getClientById(id) {
        return await clientRepository.getClientById(id);
    }
    async createClient(client) {
        return await clientRepository.createClient(client);
    }
    async getClientsByProperty(property) {
        return await clientRepository.getClientsByProperty(property);
    }
    async updateClientById(id, client) {
        return await clientRepository.updateClientById(id, client);
    }

    async addComment(clientId, comment) {
        return await clientRepository.addComment(clientId, comment);
    }
    
    async updateComment(clientId, commentId, updatedComment) {
        return await clientRepository.updateComment(clientId, commentId, updatedComment);
    }
}

export default new ClientService();