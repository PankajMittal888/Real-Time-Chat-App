import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/Firebase";
import { useNavigate } from "react-router-dom";

export const Appcontext = createContext();

const AppcontextProvider = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatuser, setChatuser] = useState(null);
  const [chatvisiual,setChatvisiual]=useState(false);

  const loaduser = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const usersnap = await getDoc(userRef);
      const userData = usersnap.data();
      setUserData(userData);
      if (userData.name) {
        navigate("/chat");
      } else {
        navigate("/profileupdate");
      }
    await updateDoc(userRef, {
        lastseen: Date.now(),
      });

    setInterval(async () => {
  if (auth.currentUser) {
    await updateDoc(userRef, { lastSeen: Date.now() });
    console.log("Periodic lastSeen update:", Date.now()); 
  }
}, 30000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unsub = onSnapshot(chatRef, async (res) => {
        const chatItem = res.data().chatData;
        // console.log(res.data());
        const tempchat = [];
        for (let item of chatItem) {
          const userRef = doc(db, "users", item.rId);
          const usersnap = await getDoc(userRef);
          const UserData = usersnap.data();
          tempchat.push({ ...item, UserData });
        }
        setChatData(tempchat.sort((a, b) => b.updatedAt - a.updatedAt));
      });
      return () => {
        unsub();
      };
    }
  }, [userData]);

useEffect(() => {
  if (chatuser?.rId) {
    const userRef = doc(db, "users", chatuser.rId);
    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.lastSeen && data.lastSeen > (chatuser?.userData?.lastSeen || 0)) {
          setChatuser((prev) => ({
            ...prev,
            userData: { ...prev.userData, lastSeen: data.lastSeen },
          }));
          console.log("chatuser lastSeen updated:", data.lastSeen);
        } else {
          console.log("Skipped old lastSeen:", data.lastSeen);
        }
      }
    }, (error) => {
      console.error("onSnapshot error:", error);
    });
    return () => unsub();
  }
}, [chatuser?.rId]);
  

  const Value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loaduser,
    messages,messagesId,chatuser,setChatuser,setMessages,setMessagesId,chatvisiual,setChatvisiual
  };
  return (
    <Appcontext.Provider value={Value}>{props.children}</Appcontext.Provider>
  );
};
export default AppcontextProvider;
