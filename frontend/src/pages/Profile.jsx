import React, { useContext, useState } from "react";
import api from "../api";
import { AuthContext } from "../App";

export default function Profile() {
  const {user,setUser}=useContext(AuthContext); const [form,setForm]=useState({name:user.name,university:user.university||"",bio:user.bio||"",skills:(user.skills||[]).join(", ")});
  const save=async e=>{e.preventDefault();const data=(await api.put("/users/me",{...form,skills:form.skills.split(",").map(x=>x.trim()).filter(Boolean)})).data;localStorage.setItem("user",JSON.stringify(data));setUser(data);alert("Profile updated")};
  return <div className="content"><header className="page-head"><div><h1>My Profile</h1><p>Manage your public profile.</p></div></header><form className="card profile" onSubmit={save}><div className="avatar huge">{user.name[0]}</div><span className="tag">{user.role}</span><label>Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>University / Organization<input value={form.university} onChange={e=>setForm({...form,university:e.target.value})}/></label><label>Bio<textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/></label><label>Skills <small>(comma separated)</small><input value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})}/></label><button className="primary">Save Changes</button></form></div>;
}
