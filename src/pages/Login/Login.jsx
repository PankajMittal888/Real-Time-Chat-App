import React, { useState } from 'react';
import './Login.css';
import assets from '../../assets/assets';
import { signup,login,resetPass} from '../../config/Firebase';
const Login = () => {
  const [currentState,setCurrentState]=useState("Sign up");;
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const  onSubmitHandler=(e)=>{
    e.preventDefault();
    if(currentState=="Sign up"){
      if(name && email && password){
        signup(name,email,password)
      }
    }else{
        login(email,password);
    }

  }

  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" className='logo' />

      <form onSubmit={onSubmitHandler} className='loginform'>
        <h2>{currentState}</h2>
        {currentState==="Sign up"?<input onChange={(e)=>setName(e.target.value)} type="text" placeholder='your name' className='form-input' required />:null}
         <input type="email" onChange={(e)=>setEmail(e.target.value)} placeholder='email address' className='form-input' required />
          <input type="password" onChange={(e)=>setPassword(e.target.value)} placeholder='enter password' className='form-input' required />
          <button type='submit'>
          {currentState=="Sign up"?"Create account":"login now"}
            </button>
          <div className="login-term">
            <input type="checkbox"/>
            <p>Agree to the term of use and privacy police</p>
          </div>
          <div className="login-forget">
            {currentState==="Sign up"? <p className="login-toggle">
              Already have a account <span onClick={()=>setCurrentState("login")}>Click here</span>
            </p>: <p className="login-toggle">
              create a Account <span onClick={()=>setCurrentState("Sign up")}>Click here</span>
            </p>}

            {currentState=="login"?<p className="login-toggle">
              forgot password <span onClick={()=>resetPass(email)}>reset here</span>
            </p>:null}
          </div>
      </form>
    </div>
  )
}

export default Login