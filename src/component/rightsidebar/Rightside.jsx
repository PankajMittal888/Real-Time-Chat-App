import React, { useContext } from 'react';
import './Rightside.css';
import assests from "../../assets/assets"
import { logout } from '../../config/Firebase';
import { Appcontext } from '../../context/AppContext';

const Rightside = () => {

  const {chatuser,messages} =useContext(Appcontext);
  return chatuser? (

    <div className='rs'>
        <div className="rs-profile">
        <img src={assests.avatar_icon} alt="" />
        <h3>{chatuser.UserData.name}
          <img src={assests.green_dot} alt="" className="dot" />



        </h3>
        <p>{chatuser.UserData.bio}</p>
   </div>
    <hr />
        <div className="rs-media">
          {/* <p>media</p>
          <div>
            <img src={assests.pic1} alt="" />
            <img src={assests.pic2} alt="" />
            <img src={assests.pic3} alt="" />
            <img src={assests.pic4} alt="" />
            <img src={assests.pic1} alt="" />
            <img src={assests.pic2} alt="" />
          </div> */}
        </div>
     
        <button onClick={logout}>Logout</button>
    </div>
  ):
  <div className='rs'>
    <button onClick={logout}>Logout</button>
  </div>
}

export default Rightside