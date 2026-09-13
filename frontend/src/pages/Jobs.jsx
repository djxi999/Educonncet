import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../App";

export default function Jobs() {
  const {user}=useContext(AuthContext); const [jobs,setJobs]=useState([]); const [q,setQ]=useState(""); const [show,setShow]=useState(false);
  const [form,setForm]=useState({title:"",company:"",description:"",location:"Remote",type:"Internship",skills:"",deadline:""});
  const load=()=>api.get("/jobs",{params:{q}}).then(r=>setJobs(r.data)); useEffect(()=>load(),[]);
  const create=async e=>{e.preventDefault();await api.post("/jobs",{...form,skills:form.skills.split(",").map(x=>x.trim()).filter(Boolean)});setShow(false);load()};
  const apply=async id=>{const coverLetter=prompt("Enter a short cover letter:")||"";try{await api.post(`/jobs/${id}/apply`,{coverLetter});alert("Application submitted")}catch(e){alert(e.response?.data?.message||"Could not apply")}};
  return <div className="content"><header className="page-head"><div><h1>Jobs & Internships</h1><p>Find opportunities or hire student talent.</p></div>{user.role==="Professional"&&<button className="primary" onClick={()=>setShow(!show)}>+ Post Opportunity</button>}</header>
  {show&&<form className="card" onSubmit={create}><h2>Post an Opportunity</h2><div className="grid two"><input placeholder="Job title" required onChange={e=>setForm({...form,title:e.target.value})}/><input placeholder="Company" required onChange={e=>setForm({...form,company:e.target.value})}/><select onChange={e=>setForm({...form,type:e.target.value})}><option>Internship</option><option>Job</option></select><input placeholder="Location" onChange={e=>setForm({...form,location:e.target.value})}/><input placeholder="Skills (comma separated)" onChange={e=>setForm({...form,skills:e.target.value})}/><input type="date" onChange={e=>setForm({...form,deadline:e.target.value})}/></div><textarea placeholder="Description" required onChange={e=>setForm({...form,description:e.target.value})}/><button className="primary">Publish</button></form>}
  <div className="card filter"><input placeholder="Search jobs, companies..." value={q} onChange={e=>setQ(e.target.value)}/><button className="primary" onClick={load}>Search</button></div>
  {jobs.map(j=><article className="card job" key={j._id}><div className="job-top"><div><span className="tag">{j.type}</span><h2>{j.title}</h2><h3>{j.company}</h3></div>{user.role==="Student"&&<button className="primary" onClick={()=>apply(j._id)}>Apply</button>}</div><p>{j.description}</p><p>📍 {j.location} &nbsp; · &nbsp; Skills: {j.skills.join(", ")}</p><small>Posted by {j.postedBy?.name}</small></article>)}
  </div>;
}
