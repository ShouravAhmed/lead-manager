import Lead from '../models/Lead.js';

class LeadRepository {
    async getLeadsByProperty({property, limit, page}) {
        limit = limit || 0;
        page = page ? (page <= 0 ? 1 : page) : 1;
        const skip = (page - 1) * limit;
        const query = Lead.find(property).skip(skip).populate('client');
        if (limit) {
            query.limit(limit);
        }
        return await query.exec();
    }

    async createLead(lead) {
        return await Lead.create(lead);
    }
    async getLeadById(id) {
        return await Lead.findById(id).populate('client');
    }

    async updateLeadById(id, lead) {
        return await Lead.findByIdAndUpdate(id, lead, {new: true});
    }

    async addComment(leadId, comment) {
        return await Lead.findByIdAndUpdate(
            leadId,
            { $push: { comments: comment } },
            { new: true }
        );
    }

    async updateCurrentOwner(leadId, memberId) {
        await Lead.findByIdAndUpdate(leadId, { currentOwner: memberId });
        return await Lead.findByIdAndUpdate(
            leadId,
            { $addToSet: { subOwners: memberId } },
            { new: true }
        );
    }
}

export default new LeadRepository();