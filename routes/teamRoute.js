import { Router } from 'express';
import { getTeams, getTeam, createTeam, addTeamMember } from '../controllers/teamController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getTeams);
router.post('/', verifyToken, createTeam);
router.get('/:id', verifyToken, getTeam);
router.post('/:id/member', verifyToken, addTeamMember);

export default router;    