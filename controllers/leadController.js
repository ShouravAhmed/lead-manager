import leadService from "../services/leadService.js";
import teamService from "../services/teamService.js";
import clientService from "../services/clientService.js";
import userService from "../services/userService.js";

export const getLeadById = async (req, res, next) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    const team = await teamService.getTeamById(lead.team);
    if (!lead || !team || !team.members.some(member => member.equals(req.user.id))) {
      return res.status(400).json({success: false, message: 'You are not authorized to view this lead'});
    }
    res.status(200).json({success: true, message: 'Lead retrieved successfully', lead});
  } 
  catch (error) {
    next(error);
  }
}

export const getLeadsByTeam = async (req, res, next) => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    if (!team || !team.members.some(member => member.equals(req.user.id))) {
      return res.status(400).json({success: false, message: 'You are not authorized to view leads for this team'});
    }
    const { limit, page, ...optionalQueries } = req.query;
    const property = { team: req.params.id };
    for (const [key, value] of Object.entries(optionalQueries)) {
      if (value) {
        if(key === 'status') {
          const statusRegex = new RegExp(value, 'i');
          property[key] = { $regex: statusRegex };
        }
        else if(key === 'currentOwner') {
          property[key] = req.user.id;
        }	
        else if(key === 'subOwner') {
          property['subOwners'] = { $in: [req.user.id] };
        }
        else if(key === 'createdBy') {
          property[key] = req.user.id;
        }
      }
    }
    const leads = await leadService.getLeadsByProperty({ property, limit, page });
    res.status(200).json({success: true, message: 'Leads retrieved successfully', leads});
  } 
  catch (error) {
    next(error);
  }
}

export const createLead = async (req, res, next) => {
  try {;
    const team = await teamService.getTeamById(req.body.team);
    if(!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }
    if(!team.isVarified) {
        return res.status(403).json({ success: false, message: "Lead can't be created for an unvarified team." });
    }
    if (!team.members.some(member => member.equals(req.user.id))) {
      return res.status(400).json({success: false, message: 'You are not authorized to create a lead for this team'});
    }
    const client = await clientService.getClientById(req.body.client);
    if (!client || client.team.toString() !== team.id.toString()) {
      return res.status(400).json({success: false, message: 'You are not authorized to create a lead with this client'});
    }

    const properties = { ...req.body, createdBy: req.user.id, currentOwner: req.user.id, subOwners: [req.user.id] };
    const lead = await leadService.createLead(properties);
    res.status(201).json({success: true, message: 'Lead created successfully', lead});
  } 
  catch (error) {
    next(error);
  }
}

export const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await leadService.getLeadById(id);
        if (!lead) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }
        const _team = await teamService.getTeamById(lead.team);
        if (!_team || !_team.members.some(member => member.toString() === req.user.id)) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this lead." });
        }

        const { _id, createdAt, updatedAt, createdBy, team, client, comments, currentOwner, subOwners, ...updateData } = req.body;

        const updatedLead = await leadService.updateLeadById(id, updateData);
        if (!updatedLead) {
            return res.status(400).json({ success: false, message: "Lead update unsuccessful" });
        }
        res.status(200).json({ success: true, message: "Lead updated successfully", lead: updatedLead });
    } 
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const addComment = async (req, res) => {
    const { comment } = req.body;
    const leadId = req.params.id;
    const newComment = { user: leadId, comment };

    const lead = await leadService.getLeadById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    const _team = await teamService.getTeamById(lead.team);
    if (!_team || !_team.members.some(member => member.toString() === req.user.id)) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this lead." });
    }
    
    try {
      const updatedLead = await leadService.addComment(leadId, newComment);
      res.status(200).json(updatedLead);
    } 
    catch (error) {
      res.status(500).json({ message: 'Error adding comment', error });
    }
};

export const updateCurrentOwner = async (req, res) => {
    const { email } = req.body;
    const leadId = req.params.id;

    const user = await userService.getUserByUsernameOrEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: "Subowner not found" });
    }

    const lead = await leadService.getLeadById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    const _team = await teamService.getTeamById(lead.team);
    if (!_team || !_team.members.some(member => member.toString() === req.user.id)) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this lead." });
    }

    try {
      const updatedLead = await leadService.updateCurrentOwner(leadId, user.id);
      res.status(200).json({success: true, message: 'Current owner updated successfully', lead: updatedLead});
    } 
    catch (error) {
      res.status(500).json({ success: false, message: 'Error updating current owner', error });
    }
}