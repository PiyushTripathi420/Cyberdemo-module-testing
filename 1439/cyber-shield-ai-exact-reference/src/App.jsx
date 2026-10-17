import React,{useState}from"react";
import{X,Shield,ArrowUpRight}from"lucide-react";
export default function App(){
 const [mode,setMode]=useState("");
 const [email,setEmail]=useState("");
 const [notice,setNotice]=useState("");
 const open=(m)=>{setMode(m);setNotice("");};
 const submit=(e)=>{e.preventDefault();setNotice("Demo only: connect a secure backend and identity provider to enable real authentication.");};
 return <main className="page">
   <div className="poster-wrap">
     <img className="poster" src="/cyber-shield-fullpage.png" alt="CYBER-SHIELD AI cyberpunk landing page reference"/>
     {/* Invisible, responsive click zones preserve the exact reference artwork. */}
     <button className="hotspot login-hotspot" aria-label="Login" onClick={()=>open("Login")}/>
     <button className="hotspot register-hotspot" aria-label="Get started" onClick={()=>open("Register")}/>
     <button className="hotspot hero-start-hotspot" aria-label="Get started" onClick={()=>open("Register")}/>
     <button className="hotspot hero-demo-hotspot" aria-label="Watch demo" onClick={()=>open("Demo")}/>
     <button className="hotspot features-hotspot" aria-label="View all features" onClick={()=>document.getElementById("feature-info").showModal()}/>
     <button className="hotspot pricing-start-hotspot" aria-label="Choose free plan" onClick={()=>open("Register")}/>
     <button className="hotspot pricing-pro-hotspot" aria-label="Choose pro plan" onClick={()=>open("Register")}/>
     <button className="hotspot contact-hotspot" aria-label="Contact sales" onClick={()=>open("Contact Sales")}/>
     <button className="hotspot footer-login-hotspot" aria-label="Footer login" onClick={()=>open("Login")}/>
     <button className="hotspot footer-register-hotspot" aria-label="Footer register" onClick={()=>open("Register")}/>
   </div>
   <dialog id="feature-info" className="feature-dialog"><form method="dialog"><button className="close" aria-label="Close"><X/></button><div className="eyebrow">CYBER-SHIELD AI / CORE MODULES</div><h2>Security features</h2><p>AI assistant · Autonomous AI agent · Generative AI · Productivity tools · Intelligent automation · Threat detection · Privacy · Secure applications · Identity and access · Fraud detection · Vulnerability detection · Network security · Digital forensics · Zero Trust · Behavior analytics · Incident response · Runtime guardrails.</p><button className="action">Close</button></form></dialog>
   {mode&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setMode("");}}><form className="auth" onSubmit={submit}><button type="button" className="close" onClick={()=>setMode("")} aria-label="Close"><X/></button><Shield className="shield" size={42}/><div className="eyebrow">SECURE ACCESS / CYBER-SHIELD AI</div><h1>{mode==="Register"?"CREATE YOUR ACCESS":mode==="Login"?"WELCOME BACK":mode==="Demo"?"SYSTEM DEMO":"CONTACT SALES"}</h1><p>{mode==="Demo"?"This reference page is a visual demo. The image itself is not a live security console.":"Enter your email to continue to the demo access flow."}</p>{mode!=="Demo"&&<><label htmlFor="email">EMAIL ADDRESS</label><input id="email" type="email" placeholder="you@example.com" required value={email} onChange={e=>setEmail(e.target.value)}/><button className="action" type="submit">Continue <ArrowUpRight size={16}/></button></>}{notice&&<p className="notice">{notice}</p>}<small>Demo interface only. No credentials are sent or stored.</small></form></div>}
 </main>;
}