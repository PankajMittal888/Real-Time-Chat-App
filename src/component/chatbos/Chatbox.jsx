import React, { useContext, useEffect, useState } from "react";
import "./Chatbox.css";
import assests from "../../assets/assets";
import { Appcontext } from "../../context/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/Firebase";
import { toast } from "react-toastify";

const Chatbox = () => {
  const { userData, messagesId, chatuser, messages, setMessages } =
    useContext(Appcontext);
  const [input, setInput] = useState("");

  const sendMsg = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "massages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });
      }

      const usersId = [chatuser.rId, userData.id];
      usersId.forEach(async (id) => {
        let userIdref = doc(db, "chats", id);
        let usersnapshot = await getDoc(userIdref);
        if (usersnapshot) {
          let userChatData = usersnapshot.data();
          let chatIndex = userChatData.chatData.findIndex(
            (c) => c.maessageId === messagesId
          );
          userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30);
          userChatData.chatData[chatIndex].updateAt = Date.now();
          if (userChatData.chatData[chatIndex].rId === userData.id) {
            userChatData.chatData[chatIndex].lastSeen = false;
          }
          await updateDoc(userIdref, {
            chatData: userChatData.chatData,
          });
        }
      });
    } catch (error) {
      toast.error(error.messages);
    }
    setInput("");
  };

  useEffect(() => {
    if (messagesId) {
      const unsub = onSnapshot(doc(db, "massages", messagesId), (res) => {
        setMessages(res.data().messages.reverse());
      });
      return () => {
        unsub();
      };
    }
  }, [messagesId]);

  const Timeconvert=(timestamp)=>{
    const date=timestamp.toDate();
    let hours=date.getHours();
    let minute=date.getMinutes();
    if(hours>12){
      return hours-12+":"+minute+"PM"
    }else{
       return hours+":"+minute+"AM"
    }

  }

  return chatuser ? (
    <div className="chatbox">
      <div className="chatuser">
        <img src={assests.avatar_icon} alt="" className="first" />
        <p>
          {chatuser.UserData.name}{" "}
          <img src={assests.green_dot} alt="" className="dot" />


        </p>
        <img src={assests.help_icon} alt="" />
      </div>

      <div className="chat-msg">
        {messages.map((msg,index)=>(
        <div key={index} className={msg.sId==userData.id?"s-msg":"r-msg"}>
          <p className="msg">{msg.text}</p>
          <div>
            <img src={assests.avatar_icon} alt="" />
            <p>{Timeconvert(msg.createdAt)}</p>
          </div>
        </div>
        ))}
        
      </div>

      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="send a massage"
        />
        <input
          type="file"
          id="image"
          accept="image/png,image/jpeg,image/jpg"
          hidden
        />
        <label htmlFor="image">
          <img src={assests.gallery_icon} alt="" />
        </label>
        <img onClick={sendMsg} src={assests.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className="chat-welcome">
      <img src={assests.logo_icon} alt="" />
      <p>chat anytime,anywhere</p>
    </div>
  );
};

export default Chatbox;
