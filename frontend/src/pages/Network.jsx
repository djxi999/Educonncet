import React, { useEffect, useState } from "react";
import api from "../api";

export default function Network() {
  const [users,setUsers]=useState([]); const [connections,setConnections]=useState([]); const [q,setQ]=useState("");
  const load=()=>Promise.all([api.get("/users",{params:{q}}),api.get("/connections")]).then(([u,c])=>{setUsers(u.data);setConnections(c.data)});
  useEffect(()=>load(),[]);
  const send=async id=>{try{await api.post(`/connections/${id}`);load()}catch(e){alert(e.response?.data?.message)}};
  const respond=async(id,status)=>{await api.patch(`/connections/${id}`,{status});load()};
  const stateFor=id=>connections.find(c=>c.sender?._id===id||c.receiver?._id===id);
  return <div className="content"><header className="page-head"><div><h1>Network</h1><p>Connect with students and professionals.</p></div></header>
    <div className="card filter"><input placeholder="Search people or universities" value={q} onChange={e=>setQ(e.target.value)}/><button className="primary" onClick={load}>Search</button></div>
    <div className="grid cards">{users.map(u=>{const c=stateFor(u._id);return <div className="card person" key={u._id}><div className="avatar big">{u.name[0]}</div><h3>{u.name}</h3><span className="tag">{u.role}</span><p>{u.university}</p><p className="muted">{u.bio}</p>{!c?<button className="primary" onClick={()=>send(u._id)}>Connect</button>:<small>{c.status==="pending"?"Request pending":`Connection: ${c.status}`}</small>}</div>})}</div>
    <h2>Incoming Requests</h2>{connections.filter(c=>c.receiver?.name&&c.status==="pending").map(c=><div className="card request" key={c._id}><b>{c.sender?.name}</b> wants to connect with you.<div><button onClick={()=>respond(c._id,"accepted")}>Accept</button><button onClick={()=>respond(c._id,"rejected")}>Reject</button></div></div>)}
  </div>;
}
