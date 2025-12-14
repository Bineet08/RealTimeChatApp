import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthContext } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
  const { logout, axios, onlineUsers } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [lastMessageTime, setLastMessageTime] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Debug: Log online users when they change
  useEffect(() => {
    console.log('🟢 Online Users:', onlineUsers);
  }, [onlineUsers]);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/messages/users');
        if (data.success) {
          setUsers(data.users);
          setUnseenMessages(data.unseenMessages || {});
          setLastMessageTime(data.lastMessageTime || {});
          console.log('👥 Fetched Users:', data.users.map(u => u.fullName));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [axios]);

  // Filter and sort users - most recent conversation first
  const sortedUsers = users
    .filter(user => user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const timeA = lastMessageTime[a._id] ? new Date(lastMessageTime[a._id]).getTime() : 0;
      const timeB = lastMessageTime[b._id] ? new Date(lastMessageTime[b._id]).getTime() : 0;
      return timeB - timeA; // Most recent first
    });

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white
    ${selectedUser ? "max-md:hidden" : ''} `}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src='#' alt='logo' className='max-w-40'></img>
          <div className='relative py-2 group'>
            <img src="#" alt='Menu' className='max-h-5 cursor-pointer' />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md 
            border border-gray-500 text-gray-100 hidden group-hover:block bg-[#282142]'>
              <p onClick={() => navigate('/profile')}
                className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className='my-2 border-t border-gray-500'></hr>
              <p onClick={logout} className='cursor-pointer text-sm'>Logout</p>
            </div>
          </div>
        </div>

        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-2 px-4 mt-5 '>
          <img src="#" alt="search" className='w-3' />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='bg-transparent border-none outline-none text-white
            text-xs placeholder-[#c8c8c8] flex-1'
            placeholder='Search user...'
          />
        </div>
      </div>

      <div className='flex flex-col'>
        {isLoading ? (
          <p className='text-gray-400 text-center py-4'>Loading users...</p>
        ) : sortedUsers.length === 0 ? (
          <p className='text-gray-400 text-center py-4'>
            {searchTerm ? 'No users found' : 'No other users yet'}
          </p>
        ) : (
          sortedUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const unreadCount = unseenMessages[user._id] || 0;

            return (
              <div
                onClick={() => setSelectedUser(user)}
                key={user._id}
                className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm 
                  ${selectedUser?._id === user._id && 'bg-[#282142]/50'} 
                  hover:bg-[#282142]/30 transition-colors`}
              >
                <img
                  src={user?.profilePic || '#'}
                  alt=""
                  className='w-[35px] h-[35px] aspect-square rounded-full object-cover'
                />
                <div className='flex flex-col leading-5 flex-1'>
                  <p>{user.fullName}</p>
                  {isOnline ? (
                    <span className='text-green-400 text-xs'>online</span>
                  ) : (
                    <span className='text-gray-500 text-xs'>offline</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <p className='text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500'>
                    {unreadCount}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  )
}

export default Sidebar