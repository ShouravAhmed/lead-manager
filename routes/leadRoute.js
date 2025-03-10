import { Router } from 'express';
import { getLeadById, getLeadsByTeam, createLead, updateLead, addComment, updateCurrentOwner } from '../controllers/leadController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:id', verifyToken, getLeadById);
router.get('/team/:id', verifyToken, getLeadsByTeam);
router.post('/', verifyToken, createLead);
router.put('/:id', verifyToken, updateLead);
router.post('/:id/comment', verifyToken, addComment);
router.post('/:id/current-owner', verifyToken, updateCurrentOwner);

export default router;    