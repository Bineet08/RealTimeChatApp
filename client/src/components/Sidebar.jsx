import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthContext } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import { Search, MoreVertical, MessageSquare, LogOut, User } from 'lucide-react'

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

  // Fetch users with search/debounce
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('/api/messages/users', {
          params: searchTerm ? { search: searchTerm } : {}
        });
        if (data.success) {
          setUsers(data.users);
          setUnseenMessages(data.unseenMessages || {});
          setLastMessageTime(data.lastMessageTime || {});
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [axios, searchTerm]);

  // Sort users - most recent conversation first (no filtering here, server does it)
  const sortedUsers = [...users].sort((a, b) => {
    const timeA = lastMessageTime[a._id] ? new Date(lastMessageTime[a._id]).getTime() : 0;
    const timeB = lastMessageTime[b._id] ? new Date(lastMessageTime[b._id]).getTime() : 0;
    return timeB - timeA; // Most recent first
  });

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white
    ${selectedUser ? "max-md:hidden" : ''} `}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2 text-white font-bold text-lg'>
            <MessageSquare className='w-8 h-8 text-violet-400 fill-violet-500/20' />
            <span className='max-lg:hidden'>Chit Chat</span>
          </div>
          <div className='relative py-2 group'>
            <MoreVertical className='w-6 h-6 text-gray-300 cursor-pointer hover:text-white transition-colors' />
            <div className='absolute top-full right-0 z-20 w-40 p-2 rounded-xl 
            border border-gray-700 shadow-xl text-gray-100 hidden group-hover:block bg-[#282142]'>
              <p onClick={() => navigate('/profile')}
                className='cursor-pointer text-sm p-3 hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors'>
                <User className='w-4 h-4' /> Edit Profile
              </p>
              <div className='h-[1px] bg-gray-700 my-1'></div>
              <p onClick={logout} className='cursor-pointer text-sm p-3 hover:bg-red-500/10 text-red-400 rounded-lg flex items-center gap-2 transition-colors'>
                <LogOut className='w-4 h-4' /> Logout
              </p>
            </div>
          </div>
        </div>

        <div className='bg-[#282142] rounded-xl flex items-center gap-2 py-3 px-4 mt-5 border border-transparent focus-within:border-violet-500/50 transition-colors'>
          <Search className='w-5 h-5 text-gray-400' />
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
                  src={user?.profilePic || '/avatar.png'}
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