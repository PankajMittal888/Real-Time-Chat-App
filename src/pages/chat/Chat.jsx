import React, { useContext, useEffect, useState } from 'react'
import './Chat.css';
import Leftside from '../../component/leftsidebar/Leftside';
import Chatbox from '../../component/chatbos/Chatbox';
import Rightside from '../../component/rightsidebar/Rightside'
import { Appcontext } from '../../context/AppContext';
const Chat = () => {
  const [loading,setLoading]=useState(true);
  const {chatData,userData}=useContext(Appcontext);

  useEffect(()=>{
    if(userData && Array.isArray(chatData)){
      setLoading(false)
    }
  },[chatData,userData])
  return (
    <div className='chat'>
    {loading?<p className='load'>Loading....</p>:
      <div className="chat-container">
        <Leftside/>
        <Chatbox/>
        <Rightside/>
      </div>}
    </div>
  )
}

export default Chat