import { Router } from 'express';
import { 
  getAllTeams, 
  verifyTeam, 
  unverifyTeam, 
  updateTeam, 
  deleteTeam,
  getAllUsers,
  updateUserRole,
  updateUser,
  deleteUser
} from '../controllers/adminController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isAdmin, isSuperAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(isAdmin);

// Team management routes
router.get('/teams', getAllTeams);
router.put('/teams/:id/verify', verifyTeam);
router.put('/teams/:id/unverify', unverifyTeam);
router.put('/teams/:id', updateTeam);
router.delete('/teams/:id', deleteTeam);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Super admin only routes
router.put('/users/:id/role', isSuperAdmin, updateUserRole);

export default router;

