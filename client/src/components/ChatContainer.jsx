import React, { useRef, useEffect, useState } from 'react'
import { userDummyMessages } from '../assets/userDummyData'

const ChatContainer = ({selectedUser, setSelectedUser}) => {
  const [expandedMsgId, setExpandedMsgId] = useState(null)

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

  const scrollToEnd = useRef();
  useEffect(()=>{
    if(scrollToEnd.current){
      /*scrollToEnd.current.scrollIntoView({ behavior:"smooth" })*/
      scrollToEnd.current.scrollTop = scrollToEnd.current.scrollHeight;
    }
  },[]);


  return selectedUser? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500 '>
        <img src="#" alt="UserIcon" className='w-8 rounded-full '/>
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          Ankit
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
        </p>
        <img onClick={()=>setSelectedUser(null)} src="#" alt="" className='md:hidden max-w-7'/>
        <img src="#" alt="info" className='max--md:hidden max-w-5' />
      </div>


    <div className='flex flex-col h-[calc(100% - 120px)] overflow-y-scroll p-3 pb-6 '>
      { userDummyMessages.map((msg,index)=>(
        <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== "775447867sdfsdf" && 'flex-row-reverse'}`}>
          <p className={`bg-violet-500/30 text-white p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all ${msg.senderId !== "775447867sdfsdf" ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.content}</p>
          <div className='text-center text-xs cursor-pointer' onClick={() => setExpandedMsgId(expandedMsgId === msg._id ? null : msg._id)}>
            <img src={msg.senderId !== "775447867sdfsdf"?"#":"#"} alt="user" className='w-7 rounded-full'/>
            <p className='text-gray-500 hover:text-gray-300'>
              {expandedMsgId === msg._id ? formatFullDateTime(msg.timestamp) : formatTime(msg.timestamp)}
            </p>
            </div>
        </div>
      ))}
      /* <div ref={scrollToEnd}></div> */
    </div>

    </div>
  

) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src="#" alt="logo" className='max-w-16'/>
      <p className='text-lg font-medium text-white'>Chit Chat</p>
    </div>
  )
}

export default ChatContainer