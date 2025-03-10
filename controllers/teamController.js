import teamService from "../services/teamService.js";
import { sendEmail } from "../helper/emailHelper.js";
import userService from "../services/userService.js";

export const getTeams = async (req, res) => {
  try {
    const teams = await teamService.getTeamByProperties({...req.query, members: { $in: [req.user.id] }});
    if(teams.length === 0) {
      return res.status(404).json({ success: false, message: "No teams found" });
    }
    res.status(200).json({ success: true, message: "Teams fetched successfully", teams });
  } 
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const createTeam = async (req, res) => {
  try {
    const { title, description } = req.body;
    const team = await teamService.createTeam({ title, description, owner: req.user.id, members: [req.user.id], });
    res.status(201).json({ success: true, message: "Team created successfully", team });
  } 
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const getTeam = async (req, res) => {
  const id = req.params.id;
  try {
    const team = await teamService.getTeamById(id);

    if (!team || !team.members.some(member => member.toString() === req.user.id.toString())) {
      return res.status(403).json({ success: false, message: "You don't have access to this team" });
    }
    res.status(200).json({ success: true, message: "Team fetched successfully", team });
  } 
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const addTeamMember = async (req, res) => {
  try {
    const { email } = req.body;
    const teamId = req.params.id;

    const team = await teamService.getTeamById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }
    if (!team.isVarified) {
      return res.status(403).json({ success: false, message: "You can't add members to an unverified team" });
    }
    if(team.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to add members to this team" });
    }

    const member = await userService.getUserByUsernameOrEmail(email);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }
    
    console.log({ members: team.members });
    console.log({ member: member.id.toString() })

    if(team.members.some(m => m.toString() === member.id.toString())) {
      return res.status(404).json({ success: false, message: "Member already added to the team" });
    }

    const updatedTeam = await teamService.addMember(team.id, member.id);

    sendEmail(
        email, 
        `You have been added to the team: ${team.title}`, 
        `
Dear ${member.username},

We are pleased to inform you that you have been added to the team: ${team.title}. Please log in to your account to see the details and start collaborating with your team members.
You can access your team here: https://edgelead.com/team/${team.id}

If you have any questions or need further assistance, feel free to reach out to our support team.

Best regards,
EdgeLead
        `
    );

    res.status(201).json({ success: true, message: "Member added successfully", team: updatedTeam });
  } 
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}