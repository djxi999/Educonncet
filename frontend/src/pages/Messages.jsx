import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../App";

export default function Messages() {
  const {user}=useContext(AuthContext); const [users,setUsers]=useState([]); const [selected,setSelected]=useState(null); const [messages,setMessages]=useState([]); const [text,setText]=useState("");
  useEffect(()=>{api.get("/users").then(r=>setUsers(r.data))},[]);
  const open=async u=>{setSelected(u);setMessages((await api.get(`/messages/${u._id}`)).data)};
  const send=async e=>{e.preventDefault();if(!text.trim()||!selected)return;const m=(await api.post("/messages",{receiver:selected._id,text})).data;setMessages(x=>[...x,m]);setText("")};
  useEffect(()=>{const f=()=>selected&&open(selected);window.addEventListener("educonnect:new-message",f);return()=>window.removeEventListener("educonnect:new-message",f)},[selected]);
  return <div className="content"><header className="page-head"><div><h1>Messages</h1><p>Private communication for collaboration and mentorship.</p></div></header>
    <div className="chat card"><div className="chat-users"><h3>People</h3>{users.map(u=><button className={selected?._id===u._id?"selected":""} onClick={()=>open(u)} key={u._id}><span className="avatar">{u.name[0]}</span>{u.name}</button>)}</div>
    <div className="chat-main">{selected?<><div className="chat-head"><b>{selected.name}</b><small>{selected.role}</small></div><div className="messages">{messages.map(m=><div className={m.sender?._id===user._id?"bubble mine":"bubble"} key={m._id}>{m.text}</div>)}</div><form className="chat-input" onSubmit={send}><input placeholder="Type a message..." value={text} onChange={e=>setText(e.target.value)}/><button className="primary">Send</button></form></>:<div className="empty">Select a person to start chatting.</div>}</div></div>
  </div>;
}
