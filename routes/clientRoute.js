import { Router } from 'express';
import { createClient, getClients, updateClient, addComment, updateComment } from '../controllers/clientController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', verifyToken, createClient);
router.get('/', verifyToken, getClients);
router.put('/:id', verifyToken, updateClient);
router.post('/:id/comment', verifyToken, addComment);
router.post('/:id/comment/:commentId', verifyToken, updateComment);

export default router;