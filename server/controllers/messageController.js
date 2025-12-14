import Message from '../models/message.js';
import User from '../models/User.js';
import cloudinary from '../lib/cloudinary.js'
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        const unseenMessages = {};
        const lastMessageTime = {};

        const promises = filteredUsers.map(async (user) => {
            // Get unseen messages count
            const unseenCount = await Message.countDocuments({
                senderId: user._id,
                receiverId: userId,
                seen: false
            });
            if (unseenCount > 0) {
                unseenMessages[user._id] = unseenCount;
            }

            // Get last message time for sorting
            const lastMessage = await Message.findOne({
                $or: [
                    { senderId: userId, receiverId: user._id },
                    { senderId: user._id, receiverId: userId }
                ]
            }).sort({ createdAt: -1 }).select('createdAt');

            if (lastMessage) {
                lastMessageTime[user._id] = lastMessage.createdAt;
            }
        });

        await Promise.all(promises);
        res.json({ success: true, users: filteredUsers, unseenMessages, lastMessageTime })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: selecteduserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selecteduserId },
                { senderId: selecteduserId, receiverId: myId },

            ]
        })

        await Message.updateMany({ senderId: selecteduserId, receiverId: myId }, { seen: true });
        res.json({ success: true, messages })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message })
    }
}

//--------marking seen---------------
export const markMessagesSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true })
        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message })
    }
}

//----------Send Message----------
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })


        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({ success: true, newMessage });


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message })
    }
}
