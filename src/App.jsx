import './App.css';
import './index.css'
import {Routes,Route, Await} from 'react-router-dom';
import Login from './pages/Login/Login';
import Chat from './pages/chat/Chat';
import Profileupdate from './pages/profileupdate/Profileupdate';
 import { ToastContainer, toast } from 'react-toastify';
import { useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/Firebase';
import { useNavigate } from 'react-router-dom';
import { Appcontext } from './context/AppContext';
function App() {
  let navigate=useNavigate();
  const {loaduser} = useContext(Appcontext);
   useEffect(()=>{
  onAuthStateChanged(auth, async(user)=>{
        if(user){
          navigate('/chat');
          await loaduser(user.uid);
        }else{
          navigate('/');
        }
  })
 },[])
  return (
   <>
   <ToastContainer/>
   <Routes>
    <Route  path='/' element={<Login/>} />
     <Route  path='/chat' element={<Chat/>} />
      <Route  path='/profileupdate' element={<Profileupdate/>} />
   </Routes>
   </>
  )
}

export default App
