import leadRepository from "../repositories/leadRepository.js";

class LeadService {
  async getLeadsByProperty({ property, limit, page }) {
    return await leadRepository.getLeadsByProperty({ property, limit, page });
  }

  async createLead(lead) {
    return await leadRepository.createLead(lead);
  }

  async getLeadById(id) {
    return await leadRepository.getLeadById(id);
  }

  async updateLeadById(id, lead) {
    return await leadRepository.updateLeadById(id, lead);
  }

  async addComment(leadId, comment) {
    return await leadRepository.addComment(leadId, comment);
  }

  async updateCurrentOwner(leadId, memberId) {
    return await leadRepository.updateCurrentOwner(leadId, memberId);
  }
}

export default new LeadService();