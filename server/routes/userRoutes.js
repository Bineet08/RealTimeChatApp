import express from 'express'
import { signup, login, updateProfile, checkAuth, logout } from '../controllers/userController.js';
import { protectRoute } from '../middlewares/auth.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update-profile', protectRoute, updateProfile);
router.get('/check-auth', protectRoute, checkAuth);

export { router as userRoutes };