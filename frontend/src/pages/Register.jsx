import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../App";

export default function Register() {
  const { login } = useContext(AuthContext);
  const [form,setForm]=useState({name:"",email:"",password:"",role:"Student",university:"",bio:""});
  const [error,setError]=useState("");
  const submit=async e=>{e.preventDefault();setError("");try{login((await api.post("/auth/register",form)).data)}catch(err){setError(err.response?.data?.message||"Registration failed")}};
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  return <div className="auth-page"><form className="auth-card wide" onSubmit={submit}>
    <div className="brand center">Edu<span>Connect</span></div><h1>Create your account</h1>
    {error&&<div className="error">{error}</div>}
    <input name="name" placeholder="Full name" required onChange={change}/>
    <input name="email" type="email" placeholder="Email" required onChange={change}/>
    <input name="password" type="password" placeholder="Password" minLength="6" required onChange={change}/>
    <select name="role" value={form.role} onChange={change}><option>Student</option><option>Professional</option></select>
    <input name="university" placeholder="University / Organization" onChange={change}/>
    <textarea name="bio" placeholder="Short bio" onChange={change}/>
    <button className="primary">Register</button><p className="center">Already registered? <Link to="/login">Login</Link></p>
  </form></div>;
}
