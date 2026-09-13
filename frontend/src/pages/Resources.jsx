import React, { useEffect, useState } from "react";
import api, { FILE_URL } from "../api";

export default function Resources() {
  const [data,setData]=useState({resources:[]}); const [filters,setFilters]=useState({q:"",subject:"",university:"",category:""});
  const [form,setForm]=useState({title:"",description:"",subject:"",university:"",category:"Notes",file:null});
  const load=()=>api.get("/resources",{params:filters}).then(r=>setData(r.data));
  useEffect(()=>{load()},[]);
  const submit=async e=>{e.preventDefault();const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,v));await api.post("/resources",fd);setForm({...form,title:"",description:"",subject:"",university:"",file:null});load()};
  return <div className="content"><header className="page-head"><div><h1>Academic Resource Hub</h1><p>Search, filter and share study materials.</p></div></header>
    <div className="grid two">
      <form className="card" onSubmit={submit}><h2>Upload Resource</h2>
        <input placeholder="Title" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        <input placeholder="Subject" required value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/>
        <input placeholder="University" value={form.university} onChange={e=>setForm({...form,university:e.target.value})}/>
        <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{["Notes","Guide","Question Paper","Other"].map(x=><option key={x}>{x}</option>)}</select>
        <input type="file" required onChange={e=>setForm({...form,file:e.target.files[0]})}/>
        <button className="primary">Upload</button>
      </form>
      <div><div className="card filter"><input placeholder="Search resources..." value={filters.q} onChange={e=>setFilters({...filters,q:e.target.value})}/><input placeholder="Subject" value={filters.subject} onChange={e=>setFilters({...filters,subject:e.target.value})}/><button className="primary" onClick={load}>Search</button></div>
      {data.resources.map(r=><div className="card resource" key={r._id}><div><span className="tag">{r.category}</span><h3>{r.title}</h3><p>{r.description}</p><small>{r.subject} · {r.university||"Any university"} · by {r.uploadedBy?.name}</small></div><a className="button" href={FILE_URL+r.fileUrl} target="_blank">Download</a></div>)}</div>
    </div>
  </div>;
}
