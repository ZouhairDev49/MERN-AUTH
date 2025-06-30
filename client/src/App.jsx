import { useEffect, useState } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import Register from "./auth/Register";
import LandingPage from './LandingPage';
import Login from "./auth/Login";
import ResetPasswordPage from "./auth/ResetPassword";
import EmailVerify from "./auth/EmailVerify";

function App() {
//   const [data, setData] = useState([]);
// useEffect(()=>{
//   axios.get('http://localhost:4000/api/user/data').
//   then((res)=>setData(res.data))
// },[])
// console.log(data);

  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/reset-password" element={<ResetPasswordPage/>}/>
      <Route path="/verify-account" element={<EmailVerify/>}/>
    </Routes>
    </>
  );
}

export default App;
