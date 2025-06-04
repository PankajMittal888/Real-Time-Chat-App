

import React, { useContext } from "react";
import "./Rightside.css";
// import assests from "../../assets/assets";
import assets from "../../assets/assets";
import { logout } from "../../config/Firebase";
import { Appcontext } from "../../context/AppContext";

const Rightside = () => {
  const { chatuser, messages } = useContext(Appcontext);
  return chatuser ? (
    <div className="rs">
      <div className="rs-profile">
        <img src={assets.avatar_icon} alt="" />
        <h3>
          {chatuser?.userData?.name ||
            chatuser?.UserData?.name ||
            "No name found"}

          {Date.now() -
            (chatuser?.userData?.lastseen ||
              chatuser?.UserData?.lastseen ||
              0) <=
          300000 ? (
            <img src={assets.green_dot} alt="" className="dot" />
          ) : (
            null
          )}
       { console.log(
            chatuser?.userData?.lastSeen || chatuser?.UserData?.lastSeen || 0 )}
        </h3>
        <p>
          {chatuser?.userData?.bio ||
            chatuser?.UserData?.bio ||
            "user is available"}
        </p>
      </div>
      <hr />
      <button onClick={logout}>Logout</button>
    </div>
  ) : (
    <div className="rs">
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Rightside;
