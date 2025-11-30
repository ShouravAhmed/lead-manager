import teamService from "../services/teamService.js";
import userService from "../services/userService.js";

// Get all teams (for admin dashboard)
export const getAllTeams = async (req, res) => {
  try {
    const teams = await teamService.getTeams();
    res.status(200).json({ success: true, message: "Teams fetched successfully", teams });
  } 
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Verify a team
export const verifyTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await teamService.getTeamById(id);
    
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    const updatedTeam = await teamService.updateTeam(id, { isVarified: true });
    res.status(200).json({ success: true, message: "Team verified successfully", team: updatedTeam });
  } 
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Unverify a team
export const unverifyTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await teamService.getTeamById(id);
    
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    const updatedTeam = await teamService.updateTeam(id, { isVarified: false });
    res.status(200).json({ success: true, message: "Team unverified successfully", team: updatedTeam });
  } 
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update team
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    const team = await teamService.getTeamById(id);
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const updatedTeam = await teamService.updateTeam(id, updateData);
    res.status(200).json({ success: true, message: "Team updated successfully", team: updatedTeam });
  } 
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete team
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await teamService.getTeamById(id);
    
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    await teamService.deleteTeam(id);
    res.status(200).json({ success: true, message: "Team deleted successfully" });
  } 
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all users (for admin dashboard)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    // Remove password from response
    const usersWithoutPassword = users.map(user => {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    });
    res.status(200).json({ success: true, message: "Users fetched successfully", users: usersWithoutPassword });
  } 
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update user role (superAdmin only)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin', 'superAdmin'].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent changing own role
    if (user.id.toString() === req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "You cannot change your own role" });
    }

    const updatedUser = await userService.updateUser(id, { role });
    const userObj = updatedUser.toObject();
    delete userObj.password;
    
    res.status(200).json({ success: true, message: "User role updated successfully", user: userObj });
  } 
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, title, bio, phone, email, username } = req.body;
    
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent admins from editing other admins or super admins (only super admins can edit admins/super admins)
    if ((user.role === 'admin' || user.role === 'superAdmin') && req.user.role !== 'superAdmin') {
      return res.status(403).json({ success: false, message: "Admins can only edit regular users" });
    }

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (title !== undefined) updateData.title = title;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;

    const updatedUser = await userService.updateUser(id, updateData);
    const userObj = updatedUser.toObject();
    delete userObj.password;
    
    res.status(200).json({ success: true, message: "User updated successfully", user: userObj });
  } 
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting own account
    if (id.toString() === req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "You cannot delete your own account" });
    }

    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent admins from deleting other admins or super admins (only super admins can delete admins/super admins)
    if ((user.role === 'admin' || user.role === 'superAdmin') && req.user.role !== 'superAdmin') {
      return res.status(403).json({ success: false, message: "Admins can only delete regular users" });
    }

    await userService.deleteUser(id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } 
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

