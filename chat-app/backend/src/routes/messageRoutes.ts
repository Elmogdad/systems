
import express from 'express';
import { sendMessage, getMessages , getUsersForSidebar} from '../controllers/messageController.js';

const router = express.Router();


import protectRoute from '../middlewares/protectRoute.js';

router.get('/conversations', protectRoute , getUsersForSidebar)
router.get('/:id', protectRoute ,getMessages);
router.post('/send/:id',protectRoute, sendMessage);


export default router;