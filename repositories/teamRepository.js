import Team from '../models/Team.js';

class TeamRepository {
  async getTeams() {
    return await Team.find();
  }
  async getTeamByProperties(properties) {
    return await Team.find(properties);
  }
  async getTeamById(id) {
    return await Team.findById(id);
  }
  async createTeam(team) {
    return await Team.create(team);
  }
  async addMember(teamId, memberId) {
    return await Team.findByIdAndUpdate(
      teamId,
      { $addToSet: { members: memberId } },
      { new: true }
    );
  }
}

export default new TeamRepository();