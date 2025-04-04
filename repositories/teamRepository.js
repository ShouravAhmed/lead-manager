import Team from '../models/team.js';

class TeamRepository {
  async getTeams() {
    return await Team.find().populate('members');
  }
  async getTeamByProperties(properties) {
    return await Team.find(properties).populate('members');
  }
  async getTeamById(id) {
    return await Team.findById(id).populate('members');
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