import express from 'express';
import protectRoute from '../middlewares/protectRoute.js';
import { registerHander, loginHander, logoutHander,getMeHander , getAllUsersHander} from '../controllers/authController.js';

const router = express.Router();


router.get('/me', protectRoute, getMeHander );
router.get('/all', protectRoute, getAllUsersHander );
// Register route
router.post('/', registerHander);
// Login route
router.post('/login', loginHander);
// Logout route
router.post('/logout', logoutHander);

// Export the router
export default router;