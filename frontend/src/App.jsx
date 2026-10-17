import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, ArrowDownToLine, ArrowRight, AudioLines, Bell, Bot, Braces, Check,
  CheckCircle2, ChevronDown, ChevronRight, CircleHelp, Code2, Command, Copy,
  Cpu, CreditCard, Crown, Eye, EyeOff, FileCode2, FileText, Folder, Gauge,
  Globe, History, KeyRound, Lock, LogIn, LogOut, Menu, MessageSquare, Mic,
  MoreHorizontal, Play, Plus, Radio, Rocket, Send, Settings, Shield, ShieldCheck,
  SlidersHorizontal, Sparkles, Terminal, Upload, User, UserPlus, WandSparkles,
  X, Zap
} from "lucide-react";

const initialChats = [
  { id: 1, title: "Build a Python web app", time: "2m ago" },
  { id: 2, title: "Explain this code", time: "12m ago" },
  { id: 3, title: "Create a cyberpunk image", time: "29m ago" },
  { id: 4, title: "Debug this error", time: "1h ago" },
  { id: 5, title: "Web scraping script", time: "2h ago" },
  { id: 6, title: "System prompt setup", time: "5h ago" }
];

const IconButton = ({ children, onClick, title, className = "" }) => (
  <button type="button" title={title} onClick={onClick}
    className={`icon-button ${className}`}>{children}</button>
);

function Brand({ small = false }) {
  return <div className="brand-lockup">
    <div className="brand-mark"><Command size={small ? 17 : 22} /></div>
    <div><div className="brand-name">CYBER-AGENT <span>AI</span></div>
      {!small && <div className="brand-sub">BUILD. HACK. CREATE.</div>}
    </div>
  </div>;
}

function Modal({ title, eyebrow, children, onClose, danger = false }) {
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className={`hud-modal ${danger ? "danger-modal" : ""}`} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-corners" />
      <div className="modal-top"><span>{eyebrow || "SECURE CHANNEL"}</span><IconButton title="Close" onClick={onClose}><X size={17}/></IconButton></div>
      <h2>{title}</h2>
      {children}
    </section>
  </div>;
}

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authOpen, setAuthOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState("482716");
  const [authError, setAuthError] = useState("");
  const [lockTool, setLockTool] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("AI Hub");
  const [engineTab, setEngineTab] = useState("Code Editor");
  const [prompt, setPrompt] = useState("");
  const [guestPrompt, setGuestPrompt] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Welcome back, operator. What are we building today?", time: "22:14" }
  ]);
  const [guestMessages, setGuestMessages] = useState([]);
  const [chats, setChats] = useState(initialChats);
  const [code, setCode] = useState(`from flask import Flask, render_template, request\n\napp = Flask(__name__)\n\n@app.route("/")\ndef home():\n    return render_template("index.html")\n\nif __name__ == "__main__":\n    app.run(debug=True, host="0.0.0.0", port=5000)`);
  const [terminalLines, setTerminalLines] = useState([
    "(venv) $ python main.py", "* Serving Flask app 'main'", "* Debug mode: on",
    "* Running on http://0.0.0.0:5000 (Press CTRL+C to quit)"
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [listening, setListening] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("You are CYBER-AGENT AI, a precise, secure, developer-focused assistant.");
  const [privacy, setPrivacy] = useState({ history: true, telemetry: false, confirmations: true });
  const [plan, setPlan] = useState("Free Tier");
  const [previewUrl, setPreviewUrl] = useState("http://localhost:5000");
  const fileRef = useRef(null);
  const guestInputRef = useRef(null);

  const usage = useMemo(() => {
    const total = messages.reduce((n, m) => n + Math.ceil(m.text.length / 4), 0);
    return { prompt: Math.max(1248, total * 3 + 1248), completion: Math.max(2367, total * 5 + 2367) };
  }, [messages]);

  useEffect(() => {
    const handler = e => { if (e.key === "Escape") { setAuthOpen(false); setLockTool(""); setSettingsOpen(false); setProfileOpen(false); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const openAuth = mode => {
    setAuthMode(mode); setAuthOpen(true); setOtpSent(false); setOtp(""); setAuthError("");
  };
  const sendOtp = e => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !email.toLowerCase().endsWith("@gmail.com")) {
      setAuthError("Enter a valid @gmail.com address."); return;
    }
    setDemoOtp(String(Math.floor(100000 + Math.random() * 900000)));
    setOtpSent(true); setAuthError("");
  };
  const verifyOtp = e => {
    e.preventDefault();
    if (otp === demoOtp) {
      setUser({ email, name: email.split("@")[0] || "Operator" });
      setAuthOpen(false); setOtpSent(false); setAuthError(""); setActiveNav("AI Hub");
      setMessages([{ role: "assistant", text: `Identity verified. Secure workspace initialized, ${email.split("@")[0]}. What are we building today?`, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } else setAuthError("Invalid code. Use the demo OTP shown below.");
  };
  const logout = () => {
    setUser(null); setSettingsOpen(false); setProfileOpen(false); setMessages([]);
    setGuestMessages([]); setActiveNav("AI Hub");
  };
  const sendMessage = (text, guest = false) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (guest && guestMessages.length >= 3) { setLockTool("More guest messages"); return; }
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const answer = guest
      ? "I can help with that at a basic level. Sign in to unlock longer answers, files, voice, and developer tools."
      : `Let's break this down. For “${trimmed.slice(0, 110)}”, I'd start with a clear implementation plan, validate the requirements, then test each piece in isolation. This prototype uses a simulated response; connect your model API in a backend to enable real AI responses.`;
    if (guest) {
      setGuestMessages(prev => [...prev, { role: "user", text: trimmed, time: now }, { role: "assistant", text: answer, time: now }]);
      setGuestPrompt("");
    } else {
      setMessages(prev => [...prev, { role: "user", text: trimmed, time: now }, { role: "assistant", text: answer, time: now }]);
      setPrompt("");
    }
  };
  const requireAuth = tool => { if (!user) setLockTool(tool); else if (tool === "Settings") setSettingsOpen(true); else if (tool === "File / Video Upload") fileRef.current?.click(); else if (tool === "Voice Input") toggleVoice(); else if (tool === "Terminal") setEngineTab("Terminal"); else if (tool === "Code Sandbox") setEngineTab("Code Editor"); };
  const toggleVoice = () => {
    if (!user) return setLockTool("Voice Input");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setLockTool("Voice input is not supported by this browser"); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = e => setPrompt(p => `${p}${p ? " " : ""}${e.results[0][0].transcript}`);
    recognition.start();
  };
  const handleFiles = e => {
    const files = Array.from(e.target.files || []);
    if (files.length) setUploadedFiles(prev => [...prev, ...files.map(f => ({ name: f.name, size: f.size, type: f.type }))]);
    e.target.value = "";
  };
  const runTerminal = e => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;
    const canned = cmd === "help" ? ["Available demo commands: help, ls, pwd, python main.py, clear"]
      : cmd === "ls" ? ["main.py  requirements.txt  templates/  static/"]
      : cmd === "pwd" ? ["/workspace/cyber-agent"]
      : cmd === "clear" ? []
      : cmd === "python main.py" ? ["Starting simulated development server...", "Server running at http://localhost:5000"]
      : [`${cmd}: simulated terminal — no host command was executed.`];
    setTerminalLines(prev => cmd === "clear" ? [] : [...prev, `$ ${cmd}`, ...canned]);
    setTerminalInput("");
  };

  return <div className="app-shell">
    <div className="ambient ambient-a" /><div className="ambient ambient-b" />
    {!user ? <GuestLanding
      messages={guestMessages} prompt={guestPrompt} setPrompt={setGuestPrompt}
      sendMessage={sendMessage} openAuth={openAuth} requireAuth={requireAuth}
      guestInputRef={guestInputRef}
    /> : <Dashboard
      user={user} usage={usage} messages={messages} prompt={prompt} setPrompt={setPrompt}
      sendMessage={sendMessage} chats={chats} setChats={setChats} activeNav={activeNav}
      setActiveNav={setActiveNav} engineTab={engineTab} setEngineTab={setEngineTab}
      code={code} setCode={setCode} terminalLines={terminalLines} terminalInput={terminalInput}
      setTerminalInput={setTerminalInput} runTerminal={runTerminal} previewUrl={previewUrl}
      setPreviewUrl={setPreviewUrl} requireAuth={requireAuth} setSettingsOpen={setSettingsOpen}
      profileOpen={profileOpen} setProfileOpen={setProfileOpen} logout={logout}
      uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} fileRef={fileRef}
      handleFiles={handleFiles} toggleVoice={toggleVoice} listening={listening}
    />}

    {authOpen && <Modal title={otpSent ? "Verify your identity" : authMode === "register" ? "Create operator ID" : "Welcome back, operator"} eyebrow="GMAIL • OTP AUTHENTICATION" onClose={() => setAuthOpen(false)}>
      <div className="auth-brand"><Brand small /></div>
      {!otpSent ? <form onSubmit={sendOtp} className="stack-form">
        <p className="muted">Authenticate your Gmail address to initialize a secure workspace.</p>
        <label className="field-label">GMAIL ADDRESS</label>
        <input className="field" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="operator@gmail.com" autoFocus required />
        {authError && <p className="error-text">{authError}</p>}
        <button className="btn-primary full" type="submit"><MailIcon /> Send demo OTP <ArrowRight size={16}/></button>
        <p className="fine-print"><ShieldCheck size={13}/> Prototype mode: no email is sent.</p>
      </form> : <form onSubmit={verifyOtp} className="stack-form">
        <p className="muted">A simulated verification code was generated for <strong>{email}</strong>.</p>
        <label className="field-label">6-DIGIT VERIFICATION CODE</label>
        <input className="field otp-field" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" maxLength={6} placeholder="••••••" autoFocus required />
        <div className="demo-code"><span>DEMO OTP</span><strong>{demoOtp}</strong><button type="button" className="text-action" onClick={() => setOtp(demoOtp)}>Use code</button></div>
        {authError && <p className="error-text">{authError}</p>}
        <button className="btn-primary full" type="submit" disabled={otp.length !== 6}><ShieldCheck size={16}/> Verify & enter dashboard</button>
        <button type="button" className="text-action center" onClick={() => { setOtpSent(false); setAuthError(""); }}>Change email</button>
      </form>}
    </Modal>}

    {lockTool && <Modal title="ACCESS DENIED" eyebrow="SECURITY GATE • 403" danger onClose={() => setLockTool("")}>
      <div className="denied-icon"><Lock size={28}/></div>
      <p className="denied-sub">LOGIN REQUIRED</p>
      <p className="muted center">"{lockTool}" is restricted to verified operators. Authenticate to unlock the full AI workspace.</p>
      <div className="lock-list">{["File / Video Upload", "Voice Input", "Code Sandbox", "Terminal", "Settings"].map(t => <div key={t}><Lock size={13}/>{t}</div>)}</div>
      <div className="modal-actions"><button className="btn-primary" onClick={() => { setLockTool(""); openAuth("login"); }}><LogIn size={15}/> Login with Gmail</button><button className="btn-ghost" onClick={() => { setLockTool(""); openAuth("register"); }}>Register</button></div>
    </Modal>}

    {settingsOpen && user && <SettingsDrawer onClose={() => setSettingsOpen(false)} apiKey={apiKey} setApiKey={setApiKey}
      showApiKey={showApiKey} setShowApiKey={setShowApiKey} systemPrompt={systemPrompt} setSystemPrompt={setSystemPrompt}
      privacy={privacy} setPrivacy={setPrivacy} plan={plan} setPlan={setPlan} />}
  </div>;
}

function MailIcon() {
  return <span className="gmail-glyph">M</span>;
}

function GuestLanding({ messages, prompt, setPrompt, sendMessage, openAuth, requireAuth }) {
  const input = useRef(null);
  return <div className="guest-page">
    <header className="landing-nav"><Brand/><nav><a href="#home">Home</a><a href="#features">Features</a><a href="#pricing">Pricing</a></nav>
      <div className="nav-actions"><button className="btn-outline" onClick={() => openAuth("login")}><LogIn size={15}/> Login with Gmail</button><button className="btn-ghost" onClick={() => openAuth("register")}>Register</button></div>
    </header>
    <main id="home">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot"/> NEXT-GEN AI ASSISTANT</div>
          <h1>YOUR AI SIDEKICK<br/>IN THE <span>DIGITAL REALM</span></h1>
          <p className="hero-links">Chat <b>•</b> Code <b>•</b> Create <b>•</b> Automate</p>
          <p className="hero-description">A focused AI workspace built for developers, creators, and digital explorers.</p>
          <div className="hero-ctas"><button className="btn-primary" onClick={() => openAuth("login")}><MailIcon/> Login with Gmail</button><button className="btn-ghost" onClick={() => openAuth("register")}><UserPlus size={15}/> Register</button></div>
          <div className="hero-stats"><div><strong>01</strong><span>THINK</span></div><div><strong>02</strong><span>BUILD</span></div><div><strong>03</strong><span>EXECUTE</span></div></div>
        </div>
        <div className="hero-visual" aria-label="Abstract cyberpunk AI illustration">
          <div className="radar radar-one"/><div className="radar radar-two"/><div className="scan-line"/>
          <div className="hooded-figure"><div className="hood"/><div className="face"><i/><i/></div><div className="cloak"/></div>
          <div className="visual-label label-a">NEURAL LINK <span>ACTIVE</span></div><div className="visual-label label-b">AI CORE<br/><strong>ONLINE</strong></div>
          <div className="visual-code">01001<br/>11010<br/>00111<br/>10101</div>
          <div className="visual-bottom">SYSTEM STATUS <span>● OPERATIONAL</span></div>
        </div>
      </section>
      <section className="guest-chat panel" id="features">
        <div className="section-bar"><div className="section-title"><Bot size={17}/> AI CHAT <span className="guest-chip">GUEST MODE</span></div><span className="muted small">LIMITED RESPONSES • MAX 200 TOKENS</span></div>
        <div className="guest-chat-content">
          <div className="guest-transcript">
            {messages.length === 0 ? <div className="empty-prompt"><Sparkles size={18}/><span>Ask a question. Explore the signal.</span></div> : messages.map((m,i) => <div className={`chat-message ${m.role}`} key={i}><div className="message-avatar">{m.role === "assistant" ? <Bot size={15}/> : <User size={15}/>}</div><div><div className="message-meta">{m.role === "assistant" ? "CYBER-AGENT" : "YOU"} <span>{m.time}</span></div><p>{m.text}</p></div></div>)}
          </div>
          <form className="guest-input-row" onSubmit={e => { e.preventDefault(); sendMessage(prompt, true); }}>
            <input ref={input} value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Ask me anything... (guest mode)" maxLength={400} aria-label="Guest prompt"/>
            <span className="char-count">{prompt.length}/400</span><button className="send-button" aria-label="Send prompt"><Send size={17}/></button>
          </form>
          <div className="guest-tools">
            <span className="field-label">ADVANCED TOOLS</span>
            <div className="tool-grid">{["File / Video Upload", "Voice Input", "Code Sandbox", "Terminal", "Settings"].map((tool,i) => <button className="locked-tool" key={tool} onClick={() => requireAuth(tool)}><span>{[<Upload/>,<Mic/>,<Braces/>,<Terminal/>,<Settings/>][i]}</span>{tool}<Lock size={12} className="tool-lock"/></button>)}</div>
          </div>
          <div className="guest-foot"><span><span className="live-dot"/> Guest mode active</span><button className="text-action" onClick={() => openAuth("register")}>Upgrade for full access <ArrowRight size={13}/></button></div>
        </div>
      </section>
      <section className="feature-strip" id="pricing">
        <div><ShieldCheck/><strong>Private by design</strong><span>Your workspace, your rules.</span></div><div><Code2/><strong>Developer-first</strong><span>Build and debug in one place.</span></div><div><Zap/><strong>Fast workflow</strong><span>Less context switching.</span></div>
      </section>
      <footer className="landing-footer"><Brand small/><span>CYBER-AGENT AI v1.0.0 • BUILD. HACK. CREATE.</span></footer>
    </main>
  </div>;
}

function Dashboard(props) {
  const {
    user, usage, messages, prompt, setPrompt, sendMessage, chats, setChats, activeNav,
    setActiveNav, engineTab, setEngineTab, code, setCode, terminalLines, terminalInput,
    setTerminalInput, runTerminal, previewUrl, setPreviewUrl, requireAuth, setSettingsOpen,
    profileOpen, setProfileOpen, logout, uploadedFiles, setUploadedFiles, fileRef,
    handleFiles, toggleVoice, listening
  } = props;
  const [chatSearch, setChatSearch] = useState("");
  const [dragging, setDragging] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [runStatus, setRunStatus] = useState("Ready");
  const [copied, setCopied] = useState(false);
  const transcriptRef = useRef(null);
  useEffect(() => { if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight; }, [messages]);
  const createChat = () => { setChats(prev => [{ id: Date.now(), title: "New secure session", time: "now" }, ...prev]); setActiveNav("AI Hub"); };
  const navItems = [
    ["AI Hub", Bot], ["Code Editor", Code2], ["Live Browser", Globe], ["Terminal", Terminal],
    ["File Manager", Folder], ["History", History], ["Settings", Settings]
  ];
  const onNav = name => { if (name === "Settings") setSettingsOpen(true); else { setActiveNav(name); if (["Code Editor","Live Browser","Terminal"].includes(name)) setEngineTab(name); } setMobileSidebar(false); };
  const submit = e => { e.preventDefault(); sendMessage(prompt); };
  const execute = () => { setRunStatus("Running"); setTimeout(() => setRunStatus("Server Running"), 500); };
  const copyCode = async () => { try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch { setCopied(false); } };
  const onDrop = e => { e.preventDefault(); setDragging(false); const files = Array.from(e.dataTransfer.files || []); if(files.length) setUploadedFiles(prev => [...prev, ...files.map(f=>({name:f.name,size:f.size,type:f.type}))]); };

  return <div className="dashboard-page">
    <header className="dashboard-topbar">
      <button className="mobile-menu icon-button" onClick={() => setMobileSidebar(v=>!v)}><Menu/></button>
      <Brand small/>
      <div className="verified-pill"><CheckCircle2 size={13}/> Verified User</div>
      <div className="top-spacer"/>
      <div className="token-tracker"><div className="tracker-heading"><Activity size={14}/> TOKEN TRACKER</div><div className="tracker-metrics"><div><span>Prompt Tokens</span><strong>{usage.prompt.toLocaleString()} <small>/ 10,000</small></strong></div><div><span>Completion Tokens</span><strong>{usage.completion.toLocaleString()} <small>/ 10,000</small></strong></div><div className="monthly"><span>Monthly Usage</span><strong>38%</strong><div className="usage-bar"><i/></div></div></div></div>
      <button className="premium-pill" onClick={() => setSettingsOpen(true)}><Crown size={15}/> Upgrade to Premium</button>
      <div className="profile-wrap"><button className="profile-trigger" onClick={() => setProfileOpen(v=>!v)}><span className="avatar">{user.name.slice(0,1).toUpperCase()}</span><span className="profile-name">{user.name}</span><ChevronDown size={14}/></button>
        {profileOpen && <div className="profile-menu"><div className="profile-email">{user.email}</div><button onClick={() => {setSettingsOpen(true);setProfileOpen(false);}}><Settings size={14}/> User settings</button><button onClick={logout}><LogOut size={14}/> Sign out</button></div>}
      </div>
    </header>
    <div className={`dashboard-body ${mobileSidebar ? "sidebar-open" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-label">WORKSPACE</div>
        <nav>{navItems.map(([name, Icon]) => <button key={name} className={`side-nav-item ${activeNav===name ? "active" : ""}`} onClick={() => onNav(name)}><Icon size={17}/><span>{name}</span>{name==="Settings" && <Lock size={11} className="nav-lock"/>}</button>)}</nav>
        <div className="sidebar-premium"><div className="premium-crown"><Crown size={17}/></div><strong>Premium Hacker Tier</strong><p>Unlock advanced AI models, more tools and higher limits.</p><button onClick={() => setSettingsOpen(true)}>Upgrade now <ArrowRight size={12}/></button></div>
        <div className="sidebar-version">CYBER-AGENT AI v1.0.0<br/><span>Build. Hack. Create. //</span></div>
      </aside>
      <main className="workspace">
        <div className="workspace-heading"><div><h2><Bot size={18}/> {activeNav === "AI Hub" ? "AI HUB" : activeNav.toUpperCase()} <span>• Chat & Assistant</span></h2><div className="secure-tag"><ShieldCheck size={12}/> FULL ACCESS (LOGGED IN)</div></div><IconButton title="New session" onClick={createChat}><Plus size={16}/></IconButton></div>
        {activeNav === "AI Hub" || activeNav === "History" ? <div className="chat-layout">
          <aside className="chat-history"><button className="new-chat" onClick={createChat}><Plus size={14}/> New Chat</button><div className="history-search"><input value={chatSearch} onChange={e=>setChatSearch(e.target.value)} placeholder="Search history..."/></div><div className="history-list">{chats.filter(c=>c.title.toLowerCase().includes(chatSearch.toLowerCase())).map(c=><button key={c.id} className="history-item" onClick={() => setActiveNav("AI Hub")}><MessageSquare size={13}/><span>{c.title}<small>{c.time}</small></span></button>)}</div></aside>
          <section className="chat-main">
            <div className="conversation" ref={transcriptRef}>
              {messages.map((m,i)=><div className={`chat-message ${m.role}`} key={i}><div className="message-avatar">{m.role==="assistant"?<Bot size={15}/>:<User size={15}/>}</div><div className="message-body"><div className="message-meta">{m.role==="assistant"?"CYBER-AGENT AI":"YOU"} <span>{m.time}</span></div>{m.role==="assistant"?<div className="assistant-answer"><p>{m.text}</p>{i===0 && <div className="inline-code"><div><FileCode2 size={13}/> quick_start.py <button onClick={copyCode}><Copy size={12}/>{copied?"Copied":"Copy"}</button></div><pre>from flask import Flask{"\n"}app = Flask(__name__){"\n"}@app.route("/"){"\n"}def home(): return "Hello, operator"</pre></div>}</div>:<p className="user-bubble">{m.text}</p>}</div></div>)}
            </div>
            <div className={`composer-area ${dragging?"dragging":""}`} onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={onDrop}>
              {dragging && <div className="drop-overlay"><Upload size={22}/> Drop files to attach</div>}
              {uploadedFiles.length>0 && <div className="attachment-list">{uploadedFiles.map((f,i)=><span key={i}><FileText size={12}/>{f.name}<button onClick={()=>setUploadedFiles(p=>p.filter((_,j)=>j!==i))}><X size={11}/></button></span>)}</div>}
              <form className="composer" onSubmit={submit}><button type="button" className="composer-tool" title="Upload file or video" onClick={()=>fileRef.current?.click()}><Plus size={17}/></button><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Type your message... (Shift + Enter for newline)" rows={1} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit(e);}}}/><button type="button" className={`mic-button ${listening?"listening":""}`} onClick={toggleVoice} title="Voice input"><Mic size={16}/></button><button className="send-button" type="submit" disabled={!prompt.trim()}><Send size={16}/></button></form>
              <div className="composer-foot"><span><Lock size={10}/> Secure session</span><span>{prompt.length}/4000</span><span>AI can make mistakes. Verify critical output.</span></div>
            </div>
          </section>
        </div> : activeNav === "File Manager" ? <div className="module-panel"><div className="module-title"><Folder/> File Manager <button className="btn-outline" onClick={()=>fileRef.current?.click()}><Upload size={14}/> Upload files</button></div><div className="file-drop" onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={onDrop} onClick={()=>fileRef.current?.click()}><Upload size={27}/><strong>Drop files here or browse</strong><span>Documents, source code, images and video (demo only)</span></div>{uploadedFiles.map((f,i)=><div className="file-row" key={i}><FileText size={16}/><span>{f.name}</span><small>{(f.size/1024).toFixed(1)} KB</small><button className="text-action" onClick={()=>setUploadedFiles(p=>p.filter((_,j)=>j!==i))}>Remove</button></div>)}</div> : <DeveloperEngine {...{engineTab,setEngineTab,code,setCode,terminalLines,terminalInput,setTerminalInput,runTerminal,previewUrl,setPreviewUrl,runStatus,execute,copyCode,copied}} />}
      </main>
      <input ref={fileRef} type="file" multiple accept="image/*,video/*,.pdf,.txt,.md,.js,.jsx,.py,.html,.css,.json,.zip" hidden onChange={handleFiles}/>
    </div>
  </div>;
}

function DeveloperEngine({engineTab,setEngineTab,code,setCode,terminalLines,terminalInput,setTerminalInput,runTerminal,previewUrl,setPreviewUrl,runStatus,execute,copyCode,copied}) {
  const [fixes, setFixes] = useState(false);
  const tabs = [["Code Editor",Code2],["Live Browser",Globe],["Terminal",Terminal]];
  return <section className="developer-engine">
    <div className="engine-header"><div><Code2 size={16}/> DEVELOPER ENGINE</div><span className={`status-dot ${runStatus==="Server Running"?"active":""}`}/></div>
    <div className="engine-tabs">{tabs.map(([name,Icon])=><button key={name} className={engineTab===name?"active":""} onClick={()=>setEngineTab(name)}><Icon size={13}/>{name}</button>)}</div>
    {engineTab==="Code Editor" && <div className="editor-workspace">
      <div className="file-tree"><div className="tree-title">EXPLORER <MoreHorizontal size={14}/></div><div className="tree-folder"><ChevronDown size={12}/> WORKSPACE</div>{["main.py","app.py","requirements.txt","templates/","static/"].map((f,i)=><button key={f} className={`tree-file ${i===0?"selected":""}`} onClick={()=>i<2&&setCode(i===0?code:`# app.py\nfrom flask import Flask\napp = Flask(__name__)\n\n@app.route('/')\ndef index():\n    return 'Hello, operator'`)}>{i<2?<FileCode2 size={12}/>:<FileText size={12}/>} {f}</button>)}</div>
      <div className="code-pane"><div className="code-toolbar"><span><FileCode2 size={12}/> main.py <i>●</i></span><div><button onClick={copyCode}><Copy size={12}/>{copied?"Copied":"Save"}</button><button className="run-action" onClick={execute}><Play size={12}/> Run</button><button className="fix-action" onClick={()=>setFixes(v=>!v)}><WandSparkles size={12}/> Auto-Fix</button></div></div>
        {fixes && <div className="fix-notice"><CheckCircle2 size={13}/> Demo analysis complete: no blocking syntax issues detected. <button onClick={()=>setFixes(false)}><X size={12}/></button></div>}
        <div className="editor"><div className="line-numbers">{code.split("\n").map((_,i)=><div key={i}>{i+1}</div>)}</div><textarea spellCheck="false" aria-label="Code editor" value={code} onChange={e=>setCode(e.target.value)}/></div>
        <div className="editor-status"><span>Python 3.11</span><span>UTF-8</span><span>Ln {code.split("\n").length}, Col 1</span></div>
      </div>
    </div>}
    {engineTab==="Live Browser" && <div className="browser-pane"><div className="browser-toolbar"><button onClick={()=>setPreviewUrl("http://localhost:5000")}><Activity size={13}/></button><input value={previewUrl} onChange={e=>setPreviewUrl(e.target.value)} aria-label="Preview URL"/><button onClick={execute}><ArrowRight size={14}/></button></div><div className="browser-preview"><div className="preview-card"><div className="preview-logo"><Bot size={20}/> CYBER-AGENT AI</div><span className="preview-kicker">YOUR WORKSPACE. REIMAGINED.</span><h3>AI Dashboard</h3><p>Your personal AI development environment.</p><div><button onClick={()=>setPreviewUrl("http://localhost:5000/dashboard")}>Get Started</button><button onClick={()=>setPreviewUrl("http://localhost:5000/docs")}>Explore</button></div><div className="preview-city">▂▅▃▆▂▇▅▃▆▂▅▇▃▅▂▆▅▃▇▂▅</div></div><p className="preview-foot">STATIC PREVIEW • NOT A LIVE WEB CONTAINER</p></div></div>}
    {engineTab==="Terminal" && <div className="terminal-pane"><div className="terminal-toolbar"><span><Terminal size={13}/> TERMINAL — bash (simulated)</span><button onClick={()=>setTerminalInput("clear")}><X size={12}/></button></div><div className="terminal-output">{terminalLines.map((line,i)=><div key={i} className={line.startsWith("$")?"terminal-command":line.toLowerCase().includes("running")?"terminal-success":""}>{line}</div>)}</div><form className="terminal-form" onSubmit={runTerminal}><span>❯</span><input value={terminalInput} onChange={e=>setTerminalInput(e.target.value)} placeholder="Type 'help' for available commands..." autoComplete="off"/><button aria-label="Run command"><ArrowRight size={14}/></button></form><div className="terminal-status"><span><i/> Session active</span><span>UTF-8</span></div></div>}
    <div className="engine-footer"><span><span className={`live-dot ${runStatus==="Server Running"?"": "dim"}`}/>{runStatus}</span><span>Powered by Cyber-Agent AI</span></div>
  </section>;
}

function SettingsDrawer({onClose,apiKey,setApiKey,showApiKey,setShowApiKey,systemPrompt,setSystemPrompt,privacy,setPrivacy,plan,setPlan}) {
  const [tab,setTab] = useState("API Keys");
  const [mcp,setMcp] = useState({filesystem:false,github:false,search:true});
  const [saved,setSaved] = useState(false);
  const sections = [["API Keys",KeyRound],["System Prompts",FileText],["Security & Privacy",Shield],["MCP Connections",Radio],["Subscription & Billing",CreditCard]];
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),1800); };
  return <div className="drawer-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <aside className="settings-drawer">
      <div className="drawer-head"><div><div className="eyebrow"><span className="live-dot"/> CONTROL CENTER</div><h2><Settings size={19}/> User Settings</h2><p>Manage your account and preferences.</p></div><IconButton title="Close settings" onClick={onClose}><X size={17}/></IconButton></div>
      <div className="drawer-body"><nav className="settings-nav">{sections.map(([name,Icon])=><button key={name} className={tab===name?"active":""} onClick={()=>setTab(name)}><Icon size={16}/>{name}<ChevronRight size={13}/></button>)}</nav>
        <div className="settings-content">
          {tab==="API Keys" && <><div className="settings-section-title"><KeyRound size={17}/> API KEY MANAGEMENT</div><p className="muted">Connect your own model provider. This demo stores values only in component memory.</p><label className="field-label">MODEL PROVIDER</label><select className="field"><option>OpenAI-compatible API</option><option>Anthropic</option><option>Local model</option></select><label className="field-label">SECRET API KEY</label><div className="secret-field"><input className="field" type={showApiKey?"text":"password"} value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-••••••••••••••••"/><button onClick={()=>setShowApiKey(v=>!v)}>{showApiKey?<EyeOff size={15}/>:<Eye size={15}/>}</button></div><div className="info-note"><ShieldCheck size={14}/> For production, store secrets server-side. Never ship API keys in browser code.</div><button className="btn-primary full" onClick={save}><Check size={14}/> {saved?"Saved":"Save configuration"}</button></>}
          {tab==="System Prompts" && <><div className="settings-section-title"><FileText size={17}/> CUSTOM SYSTEM PROMPT</div><p className="muted">Set the assistant's behavior for this prototype session.</p><textarea className="field prompt-editor" value={systemPrompt} onChange={e=>setSystemPrompt(e.target.value)} rows={8}/><div className="counter">{systemPrompt.length} characters</div><button className="btn-primary full" onClick={save}><Check size={14}/> {saved?"Saved":"Save system prompt"}</button></>}
          {tab==="Security & Privacy" && <><div className="settings-section-title"><Shield size={17}/> SECURITY & PRIVACY</div>{[["history","Chat history","Keep recent conversations in this session."],["telemetry","Usage telemetry","Share anonymous diagnostics (demo toggle)."],["confirmations","Confirm risky actions","Ask before destructive operations."]].map(([k,title,desc])=><div className="toggle-row" key={k}><div><strong>{title}</strong><p>{desc}</p></div><button className={`toggle ${privacy[k]?"on":""}`} aria-pressed={privacy[k]} onClick={()=>setPrivacy(p=>({...p,[k]:!p[k]}))}><i/></button></div>)}<div className="info-note"><Lock size={14}/> Session-only controls; no data is sent to a server.</div></>}
          {tab==="MCP Connections" && <><div className="settings-section-title"><Radio size={17}/> MCP TOOL CONNECTIONS</div><p className="muted">Toggle illustrative connectors. No external MCP servers are contacted.</p>{[["filesystem","Local filesystem","Read and organize project files"],["github","GitHub","Repositories, issues and pull requests"],["search","Web search","Search connector placeholder"]].map(([k,title,desc])=><div className="connector-row" key={k}><div className="connector-icon"><Command size={16}/></div><div className="connector-info"><strong>{title}</strong><span>{desc}</span></div><button className={`toggle ${mcp[k]?"on":""}`} aria-pressed={mcp[k]} onClick={()=>setMcp(p=>({...p,[k]:!p[k]}))}><i/></button></div>)}</>}
          {tab==="Subscription & Billing" && <><div className="settings-section-title"><CreditCard size={17}/> SUBSCRIPTION & BILLING</div><div className={`plan-card ${plan==="Free Tier"?"chosen":""}`}><div><span>STARTER</span><strong>Free Tier</strong><small>$0 / month</small></div><ul><li>5,000 tokens/month</li><li>Basic AI models</li><li>Limited tools</li></ul><button className="btn-ghost full" onClick={()=>setPlan("Free Tier")}>{plan==="Free Tier"?"Current plan":"Select Free"}</button></div><div className={`plan-card premium-plan ${plan==="Premium Hacker Tier"?"chosen":""}`}><div><span><Crown size={12}/> PRO ACCESS</span><strong>Premium Hacker Tier</strong><small>$19 / month <em>• demo pricing</em></small></div><ul><li>100,000 tokens/month</li><li>GPT-4 / Claude / Llama</li><li>All tools & priority support</li></ul><button className="btn-premium full" onClick={()=>setPlan("Premium Hacker Tier")}>{plan==="Premium Hacker Tier"?"Selected in demo":"Upgrade now"}</button></div><p className="fine-print">No payments are collected by this prototype.</p></>}
        </div>
      </div>
      <div className="drawer-foot"><span><ShieldCheck size={14}/> ENCRYPTED SESSION • DEMO</span><button className="btn-outline" onClick={onClose}>Done</button></div>
    </aside>
  </div>;
}

export default App;
