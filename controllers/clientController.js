import clientService from "../services/clientService.js";
import teamService from "../services/teamService.js";

export const createClient = async (req, res) => {
    try {
        const { team, fullName, phone, email, businessName, merchantHistory, deposit, lookingFor, creditScore, existingLoan, note } = req.body;
        if (!team || !fullName || !phone) {
            return res.status(400).json({ message: 'Missing mandatory fields' });
        }

        const _team = await teamService.getTeamById(team);
        if(!_team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }
        if(!_team.isVarified) {
            return res.status(403).json({ success: false, message: "Team is not verified" });
        }
        if(!_team.members.some(member => member.toString() === req.user.id)) {
            return res.status(403).json({ success: false, message: "Client can't be created for an unvarified team." });
        }

        const clientExists = await clientService.getClientsByProperty({phone, team});
        if(clientExists.length > 0) {
            return res.status(400).json({ success: false, message: "Client with this phone number already exists." });
        }

        const client = await clientService.createClient({ team, fullName, phone, email, businessName, merchantHistory, deposit, lookingFor, creditScore, existingLoan, note });
        if(!client) {
            return res.status(400).json({ success: false, message: "client creation unsuccessfull" });
        } 
        res.status(201).json({ success: true, message: "client created successfully", client });
    } 
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getClients = async (req, res) => {
    try {
        const teamId = req.query.team;
        const phone = req.query.phone;
        if(teamId && phone) {
            const team = await teamService.getTeamById(teamId);
            if(!team || !team.members.some(member => member.toString() === req.user.id)) {
                return res.status(403).json({ success: false, message: "You are not authorized to get clients for this team." });
            }
            const phoneRegex = new RegExp(phone, 'i');
            const clients = await clientService.getClientsByProperty({ team: team.id, phone: { $regex: phoneRegex } });
            
            if(!clients || clients.length === 0) {
                return res.status(404).json({ success: false, message: "Client not found" });
            }
            res.status(200).json({ success: true, message: "client fetched successfully", client: clients[0] });
        }
        else if(teamId) {
            const team = await teamService.getTeamById(teamId);
            if(!team || !team.members.some(member => member.toString() === req.user.id)) {
                return res.status(403).json({ success: false, message: "You are not authorized to get clients for this team." });
            }
            const clients = await clientService.getClientsByProperty({ team: team.id });
            res.status(200).json({ success: true, message: "clients fetched successfully", clients });
        }
        else {
            res.status(400).json({ success: false, message: "Missing mandatory fields" });
        }
    } 
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await clientService.getClientById(id);
        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }
        const _team = await teamService.getTeamById(client.team);
        if (!_team || !_team.members.some(member => member.toString() === req.user.id)) {
            return res.status(403).json({ success: false, message: "You are not authorized to update client for this team." });
        }

        const { team, phone, comments, _id, createdAt, updatedAt, ...updateData } = req.body;

        const updatedClient = await clientService.updateClientById(id, updateData);
        if (!updatedClient) {
            return res.status(400).json({ success: false, message: "Client update unsuccessful" });
        }
        res.status(200).json({ success: true, message: "Client updated successfully", client: updatedClient });
    } 
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const addComment = async (req, res) => {
    const { comment } = req.body;
    const clientId = req.params.id;
    const newComment = { user: req.user.id, comment };

    const client = await clientService.getClientById(clientId);
    if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
    }
    const _team = await teamService.getTeamById(client.team);
    if (!_team || !_team.members.some(member => member.toString() === req.user.id)) {
        return res.status(403).json({ success: false, message: "You are not authorized to update client for this team." });
    }
    
    try {
        const updatedClient = await clientService.addComment(clientId, newComment);
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
};

export const updateComment = async (req, res) => {
    const { comment } = req.body;
    const clientId = req.params.id;
    const commentId = req.params.commentId;

    const client = await clientService.getClientById(clientId);
    if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
    }
    const _team = await teamService.getTeamById(client.team);
    if (!_team || !_team.members.some(member => member.toString() === req.user.id)) {
        return res.status(403).json({ success: false, message: "You are not authorized to update client for this team." });
    }

    const oldComment = client.comments.find(comment => comment.id.toString() === commentId);
    if(oldComment.user.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "You are not authorized to update this comment" });
    }

    try {
        const updatedClient = await clientService.updateComment(clientId, commentId, comment);
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error });
    }
};