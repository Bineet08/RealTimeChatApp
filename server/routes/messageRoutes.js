import express from 'express'
import { protectRoute } from '../middlewares/auth.js';
import { getMessages, getUsersForSidebar, markMessagesSeen, sendMessage } from '../controllers/messageController.js';
const router = express.Router();


router.get('/users', protectRoute, getUsersForSidebar);
router.get('/:id', protectRoute, getMessages);
router.put('/mark/:id', protectRoute, markMessagesSeen);
router.post("/send/:id", protectRoute, sendMessage)

export { router as messageRoutes };