
import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';

const router = express.Router();


import protectRoute from '../middlewares/protectRoute.js';

router.post('/send/:id',protectRoute, sendMessage);
router.get('/:id', protectRoute ,getMessages);


export default router;