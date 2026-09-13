import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../App";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form,setForm]=useState({email:"",password:""});
  const [error,setError]=useState("");
  const submit=async e=>{e.preventDefault();setError("");try{login((await api.post("/auth/login",form)).data)}catch(err){setError(err.response?.data?.message||"Login failed")}};
  return <div className="auth-page"><form className="auth-card" onSubmit={submit}>
    <div className="brand center">Edu<span>Connect</span></div><h1>Welcome back</h1><p className="muted">Connect, learn and grow.</p>
    {error&&<div className="error">{error}</div>}
    <input placeholder="Email" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
    <input placeholder="Password" type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
    <button className="primary">Login</button><p className="center">New here? <Link to="/register">Create an account</Link></p>
  </form></div>;
}
