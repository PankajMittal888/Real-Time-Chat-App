import React, { useContext, useState } from "react";
import "./Leftside.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/Firebase";
import { Appcontext } from "../../context/AppContext";
import { toast } from "react-toastify";
const Leftside = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const { userData, chatData,messagesId,chatuser,setChatuser,setMessagesId} = useContext(Appcontext);
  const inputHanderler = async (e) => {
    try {
      let input = e.target.value;
      if (input) {
        setShowSearch(true);
        const UserRef = collection(db, "users");
        let q = query(UserRef, where("username", "==", input.toLowerCase()));
        const querysnap = await getDocs(q);
        if (!querysnap.empty && querysnap.docs[0].data().id !== userData.id) {
          const foundUser = querysnap.docs[0].data();
          const userExists =
            Array.isArray(chatData) &&
            chatData.some((chat) => chat.rId === foundUser.id);

          if (!userExists) {
            setUser(foundUser);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {}
  };

  const addChat = async () => {
    let massegeRef = collection(db, "massages");
    let chatRef = collection(db, "chats");
    try {
      let newMassageRef = doc(massegeRef);
      await setDoc(newMassageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatRef, user.id), {
        chatData: arrayUnion({
          maessageId: newMassageRef.id,
          lastMessage: "",
          rId: userData.id,
          updateAt: Date.now(),
          lastSeen: true,
        }),
      });

      await updateDoc(doc(chatRef, userData.id), {
        chatData: arrayUnion({
          maessageId: newMassageRef.id,
          lastMessage: "",
          rId: user.id,
          updateAt: Date.now(),
          lastSeen: true,
        }),
      });
    } catch (error) {
      console.error(error);
      toast.error(error.code);
    }
  };

  const setChat = async (item) => {
    setMessagesId(item.maessageId);
    setChatuser(item);

   const uresChatref = doc(db, "chats", userData.id);
const chatsnapshot = await getDoc(uresChatref); // ✅ use getDoc for document
let userchatdata = chatsnapshot.data();

const chatindex = userchatdata.chatData.findIndex(
  (c) => c.maessageId === item.maessageId // ✅ correct arrow function and field name
);

if (chatindex !== -1) {
  userchatdata.chatData[chatindex].lastSeen = true;

  await updateDoc(uresChatref, {
    chatData: userchatdata.chatData,
  });
}

  };

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profileupdate")}>Edit-profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>

        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHanderler}
            type="text"
            placeholder="search here"
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-friend">
            <img src={assets.avatar_icon} alt="" />
            <p>{user.name}</p>
          </div>
        ) : Array.isArray(chatData) && chatData.length > 0 ? (
          chatData.map((item, index) => (
            // const ChatUser = chatUsers[item.rId];
            <div onClick={() => setChat(item)} key={index} className={`friends ${item.lastSeen || item.maessageId==messagesId?"":"border"}`}>
              <img src={assets.profile_img} alt="profile" />
              <div>
                <p>{item.UserData.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="err">No chats found</p>
        )}
      </div>
    </div>
  );
};

export default Leftside;
