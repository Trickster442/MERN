import express from 'express';
import AuthController from '../controller/authController.js';

const router = express.Router(); // Instantiate the router properly
const authController = new AuthController(); // Correctly instantiate the controller

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Logout route
// router.get('/logout', authController.logout);

// // Refresh token route (if you have this feature implemented)
// router.get('/refresh_token', authController.generateAccessToken);

export default router;
