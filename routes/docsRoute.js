import { Router } from 'express';
import { getDocs } from '../controllers/docsController.js';

const router = Router();

router.get('/',  getDocs);

export default router;    