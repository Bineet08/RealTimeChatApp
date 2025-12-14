import React, { useRef, useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const { authUser, axios, socket, onlineUsers } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedMsgId, setExpandedMsgId] = useState(null);
  const scrollToEnd = useRef(null);

  // Format time for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const formatFullDateTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Fetch messages when selected user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) return;

      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/messages/${selectedUser._id}`);
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser?._id, axios]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      // Only add if it's from/to the selected user
      if (
        newMessage.senderId === selectedUser?._id ||
        newMessage.receiverId === selectedUser?._id
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, selectedUser?._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollToEnd.current) {
      scrollToEnd.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim() && !selectedImage) return;

    try {
      let imageData = null;

      if (selectedImage) {
        const reader = new FileReader();
        imageData = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(selectedImage);
        });
      }

      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, {
        text: messageText,
        image: imageData
      });

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
        setMessageText('');
        setSelectedImage(null);
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Check if user is online
  const isOnline = onlineUsers.includes(selectedUser?._id);

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/* Header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img
          src={selectedUser?.profilePic || '#'}
          alt="UserIcon"
          className='w-8 h-8 rounded-full object-cover'
        />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser?.fullName}
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src="#"
          alt="close"
          className='md:hidden max-w-7 cursor-pointer'
        />
        <img src="#" alt="info" className='max-md:hidden max-w-5' />
      </div>

      {/* Messages Area */}
      <div className='flex flex-col h-[calc(100%_-_120px)] overflow-y-scroll p-3 pb-6'>
        {isLoading ? (
          <div className='flex items-center justify-center h-full'>
            <p className='text-gray-400'>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className='flex items-center justify-center h-full'>
            <p className='text-gray-400'>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg._id || index}
              className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser?._id && 'flex-row-reverse'}`}
            >
              {/* Message content */}
              <div className={`max-w-[200px] mb-8 ${msg.senderId !== authUser?._id ? 'items-start' : 'items-end'}`}>
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="attachment"
                    className='rounded-lg mb-1 max-w-full cursor-pointer'
                    onClick={() => window.open(msg.image)}
                  />
                )}
                {msg.text && (
                  <p className={`bg-violet-500/30 text-white p-2 text-sm font-light rounded-lg break-all ${msg.senderId !== authUser?._id ? 'rounded-br-none' : 'rounded-bl-none'
                    }`}>
                    {msg.text}
                  </p>
                )}
              </div>

              {/* Avatar and time */}
              <div
                className='text-center text-xs cursor-pointer'
                onClick={() => setExpandedMsgId(expandedMsgId === msg._id ? null : msg._id)}
              >
                <img
                  src={msg.senderId !== authUser?._id ? selectedUser?.profilePic : authUser?.profilePic || '#'}
                  alt="user"
                  className='w-7 h-7 rounded-full object-cover'
                />
                <p className='text-gray-500 hover:text-gray-300'>
                  {expandedMsgId === msg._id
                    ? formatFullDateTime(msg.createdAt)
                    : formatTime(msg.createdAt)
                  }
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={scrollToEnd}></div>
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <div className='absolute bottom-16 left-3 right-3 bg-gray-800/90 p-2 rounded-lg flex items-center gap-2'>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="preview"
            className='h-16 rounded object-cover'
          />
          <p className='text-white text-sm flex-1 truncate'>{selectedImage.name}</p>
          <button
            onClick={() => setSelectedImage(null)}
            className='text-red-400 hover:text-red-300 text-sm'
          >
            Remove
          </button>
        </div>
      )}

      {/* Send Area */}
      <form onSubmit={handleSendMessage} className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder='Enter the message...'
            className='flex-1 text-sm border-none p-3 rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'
          />
          <input
            type="file"
            id='image'
            accept='image/jpg, image/jpeg, image/png'
            hidden
            onChange={handleImageSelect}
          />
          <label htmlFor="image">
            <img src="#" alt="imgicon" className='w-5 mr-2 cursor-pointer' />
          </label>
        </div>
        <button type="submit">
          <img src="#" alt="send" className='w-7 cursor-pointer' />
        </button>
      </form>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full'>
      <img src="#" alt="logo" className='max-w-16' />
      <p className='text-lg font-medium text-white'>Chit Chat</p>
      <p className='text-sm text-gray-400'>Select a user to start chatting</p>
    </div>
  )
}

export default ChatContainer