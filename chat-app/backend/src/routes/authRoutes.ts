import express from 'express';

import { registerHander, loginHander, logoutHander } from '../controllers/authController.js';

const router = express.Router();

// Register route
router.post('/', registerHander);
// Login route
router.post('/login', loginHander);
// Logout route
router.post('/logout', logoutHander);

// Export the router
export default router;