import Client from '../models/client.js';

class ClientRepository {
    async getClientById(id) {
        return Client.findById(id);
    }
    async createClient(client) {
        return await Client.create(client);
    }
    async getClientsByProperty(property) {
        console.log({property});
        try {
            return await Client.find(property);
        }
        catch (error) {
            console.error("Error fetching clients by property:", error);
            throw new Error("Error fetching clients by property");
        }
    }
    async updateClientById(id, client) {
        return await Client.findByIdAndUpdate(id, client, { new: true });
    }
    async addComment(clientId, comment) {
        return await Client.findByIdAndUpdate(
            clientId,
            { $push: { comments: comment } },
            { new: true }
        );
    }
    async updateComment(clientId, commentId, updatedComment) {
        return await Client.findOneAndUpdate(
            { _id: clientId, 'comments._id': commentId },
            { $set: { 'comments.$.comment': updatedComment, 'comments.$.updatedAt': Date.now() } },
            { new: true }
        );
    }
}

export default new ClientRepository();