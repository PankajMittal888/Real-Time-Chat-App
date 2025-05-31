import React, { useContext, useEffect, useState } from 'react';
import './Profileupdate.css';
import assests from  "../../assets/assets"
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import update from '../../lib/upload';
import { Appcontext } from '../../context/AppContext';

const Profileupdate = () => {
  const[image,setImage]=useState(false);
  const[name,setName]=useState("");
  const[Bio,setBio]=useState("");
  const[uid,setUid]=useState("");
  const[prevImage,setPrevImage]=useState("");
  const navigate=useNavigate();
  const {setUserData} =useContext(Appcontext)

      const profileupdate=async(event)=>{
          event.preventDefault();
          try {
            if(!prevImage && !image){
              toast.error("upload profile picture");
            }
            const docRef=doc(db,"users",uid);
            // if(image){
            //     const imageurl=await update(image);
            //     setPrevImage(imageurl);
            //     await updateDoc(docRef,{
            //       avatar:imageurl,
            //       name:name,
            //       bio:Bio
            //     })
            // }else{
            // await updateDoc(docRef,{
            //       name:name,
            //       bio:Bio
            //     })
            // }
            await updateDoc(docRef,{
                  name:name,
                  bio:Bio,
                })
            const snap=await getDoc(docRef);
            setUserData(snap.data())
            navigate('/chat');
          } catch (error) {
            console.error(error);
            toast.error(error.code);
          }
      }

    useEffect(()=>{
      onAuthStateChanged(auth,async(user)=>{
          if(user){
              setUid(user.uid);
                const decRef=doc(db,"users",user.uid)
                const docsnap=await getDoc(decRef);
                if(docsnap.data().name){
                  setName(docsnap.data().name)
                }
                if(docsnap.data().bio){
                  setBio(docsnap.data().bio)
                }
                  if(docsnap.data().avatar){
                  setPrevImage(docsnap.data().avatar)
                }
          }else{
              navigate('/');
          }
        
      })
    },[])


  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileupdate}>
          <h3>Profile detail</h3>
          <label htmlFor="avatar">
            <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="avatar" accept='.png,.jpg,.jpeg' hidden/>
            <img src={image? URL.createObjectURL(image):assests.avatar_icon} alt=""  />
            upload profile image
          </label>
          <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='your name' required />
          <textarea onChange={(e)=>setBio(e.target.value)}  value={Bio}  name="" placeholder='write profile bic' id="" required></textarea>
          <button type='submit'>submit</button>
        </form>
        <img src={image?URL.createObjectURL(image):assests.logo_icon} alt="" className='prifilepic' />
      </div>
    </div>
  )
}

export default Profileupdate