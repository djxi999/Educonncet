import React, { useEffect, useState } from "react";
import api from "../api";

export default function Feed() {
  const [posts,setPosts]=useState([]); const [text,setText]=useState(""); const [comment,setComment]=useState({});
  const load=()=>api.get("/posts").then(r=>setPosts(r.data));
  useEffect(()=>{load()},[]);
  const create=async e=>{e.preventDefault();if(!text.trim())return;await api.post("/posts",{text});setText("");load()};
  const like=async id=>{await api.post(`/posts/${id}/like`);load()};
  const addComment=async id=>{if(!comment[id]?.trim())return;await api.post(`/posts/${id}/comments`,{text:comment[id]});setComment({...comment,[id]:""});load()};
  return <div className="content">
    <header className="page-head"><div><h1>Community Feed</h1><p>Share ideas, resources and opportunities.</p></div></header>
    <form className="composer card" onSubmit={create}><textarea placeholder="What's on your mind?" value={text} onChange={e=>setText(e.target.value)}/><button className="primary small">Post</button></form>
    {posts.map(p=><article className="card post" key={p._id}>
      <div className="post-author"><div className="avatar">{p.author?.name?.[0]}</div><div><b>{p.author?.name}</b><small>{p.author?.role} · {p.author?.university||"EduConnect"}</small></div></div>
      <p className="post-text">{p.text}</p>
      <div className="actions"><button onClick={()=>like(p._id)}>♥ {p.likes.length}</button><span>💬 {p.comments.length}</span></div>
      <div className="comments">{p.comments.map(c=><p key={c._id}><b>{c.user?.name}:</b> {c.text}</p>)}</div>
      <div className="comment-box"><input placeholder="Write a comment..." value={comment[p._id]||""} onChange={e=>setComment({...comment,[p._id]:e.target.value})}/><button onClick={()=>addComment(p._id)}>Send</button></div>
    </article>)}
  </div>;
}
