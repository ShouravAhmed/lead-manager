import teamRepository from "../repositories/teamRepository.js";

class TeamService
{
    async getTeams() {
        return await teamRepository.getTeams();
    }

    async getTeamById(id) {
        return await teamRepository.getTeamById(id);
    }

    async getTeamByProperties(properties) {
        return await teamRepository.getTeamByProperties(properties);
    }

    async createTeam(team) {
        return await teamRepository.createTeam(team);
    }

    async addMember(teamId, memberId) {
        return await teamRepository.addMember(teamId, memberId);
    }
}

export default new TeamService();