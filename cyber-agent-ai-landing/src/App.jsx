import React, { useEffect, useState } from 'react'
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, Atom,
  AudioLines, Bot, BrainCircuit, Bug, Check, ChevronRight, CircleDot, Clock3,
  Code2, Cpu, Fingerprint, GitBranch, Globe2, KeyRound, Lock, LockKeyhole,
  Mail, Menu, Network, Radar, ScanSearch, Search, Server, Shield, ShieldAlert,
  ShieldCheck, Sparkles, Terminal, UserRound, X, Zap
} from 'lucide-react'

const features = [
  { icon: Bot, title: 'AI Assistant', desc: 'Get intelligent insights, real-time guidance and smart recommendations.', color: 'cyan' },
  { icon: BrainCircuit, title: 'Autonomous AI Agent', desc: 'Works on its own to analyze threats, plan and take safe actions.', color: 'cyan' },
  { icon: Sparkles, title: 'Generative AI', desc: 'Create, analyze and summarize security content with AI.', color: 'violet' },
  { icon: Cpu, title: 'Productivity Tools', desc: 'File, code and workflow tools that help you work smarter.', color: 'cyan' },
  { icon: Network, title: 'Intelligent Automation', desc: 'Automate repetitive tasks with reviewable workflows.', color: 'cyan' },
  { icon: ShieldAlert, title: 'Threat Detection', desc: 'Identify suspicious activity, phishing and malware indicators.', color: 'red' },
  { icon: LockKeyhole, title: 'Privacy', desc: 'Keep personal information protected with privacy-first controls.', color: 'green' },
  { icon: ShieldCheck, title: 'Secure Applications', desc: 'Check apps for common weaknesses and unsafe patterns.', color: 'cyan' },
  { icon: Fingerprint, title: 'Identity & Access', desc: 'Manage access, identity checks and permission boundaries.', color: 'cyan' },
  { icon: Activity, title: 'Fraud Detection', desc: 'Flag unusual patterns that may indicate fraud or abuse.', color: 'green' },
  { icon: Bug, title: 'Vulnerability Detection', desc: 'Find and prioritize potential security weaknesses.', color: 'cyan' },
  { icon: Globe2, title: 'Network Security', desc: 'Review network signals and monitor suspicious connections.', color: 'cyan' },
  { icon: ScanSearch, title: 'Digital Forensics', desc: 'Organize evidence and investigate security events.', color: 'violet' },
  { icon: Shield, title: 'Zero Trust Architecture', desc: 'Verify each request and minimize implicit trust.', color: 'cyan' },
  { icon: AudioLines, title: 'Behavior Analytics', desc: 'Surface unusual activity with explainable behavior signals.', color: 'green' },
  { icon: Zap, title: 'Automated Incident Response', desc: 'Guide containment and recovery with human approval.', color: 'red' },
  { icon: KeyRound, title: 'Runtime Guardrails', desc: 'Add policy checks around AI actions and tool execution.', color: 'cyan' },
]

const solutions = [
  { icon: UserRound, title: 'For Individuals', desc: 'Protect your digital identity, accounts and personal data.' },
  { icon: Code2, title: 'For Developers', desc: 'Review code, detect common flaws and improve app security.' },
  { icon: Server, title: 'For Businesses', desc: 'Monitor risks and build safer day-to-day operations.' },
  { icon: ShieldCheck, title: 'For Enterprise', desc: 'Plan zero-trust controls, visibility and policy governance.' },
]

function Logo() {
  return <a className="brand" href="#home" aria-label="Cyber Agent AI home">
    <span className="brand-mark"><span>A</span></span>
    <span><strong>CYBER-AGENT <em>AI</em></strong><small>DETECT • DEFEND • AUTOMATE</small></span>
  </a>
}

function SectionTitle({ eyebrow, title, text }) {
  return <div className="section-title">
    <div className="eyebrow"><span className="pulse-dot" /> {eyebrow}</div>
    <h2>{title}</h2>
    {text && <p>{text}</p>}
  </div>
}

function AuthModal({ mode, onClose, onModeChange }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  if (!mode) return null

  function submit(e) {
    e.preventDefault()
    setMessage('Demo form only — connect a secure authentication backend before using real accounts.')
  }

  return <div className="modal-backdrop" onMouseDown={onClose}>
    <div className="auth-modal hud-panel" onMouseDown={e => e.stopPropagation()}>
      <button className="modal-close icon-button" onClick={onClose} aria-label="Close"><X size={19}/></button>
      <div className="modal-emblem"><ShieldCheck size={27}/></div>
      <div className="eyebrow">SECURE ACCESS PROTOCOL</div>
      <h2>{mode === 'login' ? 'WELCOME BACK' : 'CREATE YOUR ACCOUNT'}</h2>
      <p className="muted">Enter the system. Your digital defense starts here.</p>
      <form onSubmit={submit} className="auth-form">
        <label>Email address</label>
        <div className="input-wrap"><Mail size={17}/><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/></div>
        <label>Password</label>
        <div className="input-wrap"><Lock size={17}/><input type="password" minLength={6} required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters"/></div>
        <button className="button button-primary full-width" type="submit">{mode === 'login' ? 'LOGIN SECURELY' : 'REGISTER ACCOUNT'} <ArrowRight size={17}/></button>
      </form>
      {message && <div className="notice"><AlertTriangle size={15}/>{message}</div>}
      <div className="auth-switch">{mode === 'login' ? 'New to the system?' : 'Already have access?'} <button onClick={() => {setMessage(''); onModeChange(mode === 'login' ? 'register' : 'login')}}>{mode === 'login' ? 'Register' : 'Login'}</button></div>
      <small className="fine-print"><LockKeyhole size={12}/> Demo UI — no credentials are sent or stored.</small>
    </div>
  </div>
}

function Header({ onAuth }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [['Home','#home'],['Features','#features'],['Solutions','#solutions'],['How it works','#how-it-works'],['Pricing','#pricing'],['About','#about']]
  return <header className="topbar">
    <div className="container nav-inner">
      <Logo/>
      <button className="mobile-menu icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
        {links.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <div className="nav-actions"><span className="online-status"><i/> Demo mode</span><button className="button button-outline small" onClick={() => onAuth('login')}>Login</button><button className="button button-primary small" onClick={() => onAuth('register')}><UserRound size={15}/> Register</button></div>
    </div>
  </header>
}

function Hero({ onAuth }) {
  return <section className="hero section-grid" id="home">
    <div className="hero-bg-glow"/>
    <div className="container hero-inner">
      <div className="hero-copy">
        <div className="eyebrow hero-eyebrow"><span className="pulse-dot"/> NEXT-GEN CYBERSECURITY AI AGENT</div>
        <h1>CYBER-AGENT <span>AI</span><br/><b>YOUR DIGITAL GUARDIAN</b></h1>
        <p className="hero-lead">Detect. Defend. Automate.</p>
        <p className="hero-desc">An intelligent cybersecurity platform built to help identify threats, review vulnerabilities and support safer digital workflows — from code to network.</p>
        <div className="hero-buttons"><button className="button button-primary" onClick={() => onAuth('register')}>Get Started <ArrowRight size={18}/></button><a className="button button-outline" href="#features"><CircleDot size={17}/> Explore Features</a></div>
        <div className="hero-proof"><span><Sparkles size={15}/> AI Powered</span><span><ShieldCheck size={15}/> Threat Awareness</span><span><LockKeyhole size={15}/> Zero Trust Mindset</span></div>
      </div>
      <div className="hero-visual">
        <div className="scan-ring ring-one"/><div className="scan-ring ring-two"/>
        <div className="guardian">
          <div className="hood"><div className="face"><div className="brow"/><div className="eye eye-left"/><div className="eye eye-right"/><div className="mask-line"/><div className="mask-vent"/></div></div>
          <div className="shoulder shoulder-left"/><div className="shoulder shoulder-right"/><div className="chest-mark">A</div>
        </div>
        <div className="orb"><div className="orb-latitude"/><div className="orb-longitude"/><div className="orb-point p1"/><div className="orb-point p2"/><div className="orb-point p3"/></div>
        <div className="floating-alert alert-red"><AlertTriangle size={17}/><div><b>THREAT SIGNAL</b><small>Suspicious activity flagged</small></div></div>
        <div className="floating-alert alert-cyan"><Radar size={17}/><div><b>SCANNING</b><small>Reviewing risk indicators</small></div></div>
        <div className="visual-code">ANALYZE<br/>DETECT<br/>DEFEND<br/>AUTOMATE</div>
        <div className="visual-caption">THREATS DON'T SLEEP<br/><span>NEITHER SHOULD DEFENSE</span></div>
      </div>
    </div>
    <div className="hero-bottom-line"/>
  </section>
}

function FeatureGrid() {
  return <section className="section features-section" id="features">
    <div className="container">
      <SectionTitle eyebrow="OUR CAPABILITIES" title={<>POWERFUL FEATURES FOR <span className="text-cyan">TOTAL SECURITY</span></>} text="One connected platform concept for AI assistance, productivity and cyber defense."/>
      <div className="features-grid">
        {features.map((f, i) => {const Icon = f.icon; return <article className={`feature-card tone-${f.color}`} key={f.title} style={{'--delay': `${i * 35}ms`}}>
          <div className="feature-icon"><Icon size={23}/></div><h3>{f.title}</h3><p>{f.desc}</p><span className="card-index">CS / {String(i + 1).padStart(2,'0')}</span>
        </article>})}
      </div>
    </div>
  </section>
}

function AgentSection() {
  return <section className="agent-section" id="about">
    <div className="container agent-layout">
      <div className="agent-art">
        <div className="agent-avatar"><div className="avatar-halo"/><div className="avatar-head"><div className="avatar-eye left"/><div className="avatar-eye right"/><div className="avatar-mouth"/></div><div className="avatar-neck"/><div className="avatar-shoulders"/></div>
        <div className="terminal-mini"><div className="terminal-head"><span/> CYBER-AGENT / CONSOLE</div><p><i>›</i> Initializing defense core...</p><p><i>›</i> Checking security signals</p><p className="success"><i>✓</i> Demo systems ready</p><div className="mini-bars">{Array.from({length:24},(_,i)=><span key={i} style={{height:`${15 + ((i*17)%48)}%`}}/>)}</div></div>
      </div>
      <div className="agent-copy">
        <div className="eyebrow">MORE THAN A TOOL</div><h2>AN AI AGENT THAT<br/><span className="text-cyan">THINKS IN LAYERS.</span></h2>
        <p>CYBER-AGENT AI brings assistant-style interaction together with security-focused workflows, helping users understand risks and choose safer next steps.</p>
        <div className="agent-points"><div><BrainCircuit/><b>Analyze signals</b><small>Summarize useful context.</small></div><div><ScanSearch/><b>Find weak points</b><small>Surface issues for review.</small></div><div><ShieldCheck/><b>Guide response</b><small>Keep people in control.</small></div></div>
        <a href="#how-it-works" className="text-link">Explore the workflow <ArrowRight size={16}/></a>
      </div>
      <div className="agent-quote hud-panel">“Not just a tool.<br/>A smarter layer<br/>of digital defense.”<small>— CYBER-AGENT AI</small></div>
    </div>
  </section>
}

function Workflow() {
  const steps = [
    {n:'01', title:'DETECT', icon:Radar, desc:'Review systems, apps and signals for possible risk.'},
    {n:'02', title:'ANALYZE', icon:BrainCircuit, desc:'Understand context, prioritize findings and explain why they matter.'},
    {n:'03', title:'RESPOND', icon:ShieldCheck, desc:'Recommend safe next steps and require approval for sensitive actions.'},
  ]
  return <section className="section workflow-section" id="how-it-works">
    <div className="container">
      <SectionTitle eyebrow="SIMPLE PROCESS" title={<>3 STEPS TO <span className="text-cyan">SMARTER PROTECTION</span></>} text="A clear workflow from first signal to a considered response."/>
      <div className="workflow-grid">{steps.map((s,i)=>{const Icon=s.icon;return <React.Fragment key={s.n}><article className="workflow-card"><div className="step-number">{s.n}</div><Icon size={30}/><h3>{s.title}</h3><p>{s.desc}</p></article>{i<2&&<div className="workflow-arrow"><ArrowRight/></div>}</React.Fragment>})}</div>
    </div>
  </section>
}

function Solutions() {
  return <section className="section solutions-section" id="solutions"><div className="container">
    <SectionTitle eyebrow="SECURITY FOR EVERY LAYER" title={<>BUILT FOR YOUR <span className="text-cyan">DIGITAL WORLD</span></>} text="Adapt the platform concept to the people and environments you need to protect."/>
    <div className="solutions-grid">{solutions.map(s=>{const Icon=s.icon;return <article className="solution-card" key={s.title}><Icon size={29}/><h3>{s.title}</h3><p>{s.desc}</p><ArrowUpRight className="solution-arrow" size={17}/></article>})}</div>
  </div></section>
}

function DashboardPreview() {
  const [tab, setTab] = useState('App.jsx')
  const [scan, setScan] = useState(false)
  const code = tab === 'App.jsx'
    ? ['import { CyberAgent } from \"cyber-agent\";', '', 'const agent = new CyberAgent({', '  mode: \"defensive\",', '  humanApproval: true,', '});', '', 'await agent.review({', '  target: \"your-app\",', '  checks: [\"xss\", \"injection\", \"secrets\"]', '});']
    : ['// Security policy preview', 'const policy = {', '  leastPrivilege: true,', '  verifyEveryRequest: true,', '  logSecurityEvents: true,', '};', '', 'export default policy;']
  return <section className="section dashboard-section"><div className="container">
    <SectionTitle eyebrow="CONTROL CENTER PREVIEW" title={<>REAL-TIME THREAT <span className="text-cyan">INTELLIGENCE & CONTROL</span></>} text="A visual preview of the workspace — sample values only, not a live security system."/>
    <div className="dashboard-shell">
      <div className="dash-top"><div className="dash-brand"><span className="brand-mini">A</span><b>CYBER-AGENT AI</b></div><span className="dash-tag"><i/> LOCAL DEMO PREVIEW</span><span className="dash-clock">SECURE WORKSPACE / 01</span></div>
      <div className="dash-grid">
        <aside className="dash-sidebar">
          <div className="dash-panel-title"><Activity size={14}/> SYSTEM OVERVIEW</div>
          {[['AI AGENT','READY'],['SECURITY CORE','READY'],['NETWORK','DEMO'],['DATABASE','LOCAL'],['USERS','0 ACTIVE']].map(([a,b])=><div className="system-row" key={a}><span><i/>{a}</span><b>{b}</b></div>)}
          <div className="chart-bars">{Array.from({length:22},(_,i)=><span key={i} style={{height:`${12+(i*23)%65}%`}}/>)}</div>
          <div className="side-divider"/>
          <div className="dash-panel-title"><Terminal size={14}/> TERMINAL</div>
          <p className="console-line">&gt; agent --status</p><p className="console-line green">&gt; demo ready ✓</p><p className="console-line">&gt; awaiting input_</p>
        </aside>
        <div className="dash-editor">
          <div className="window-title"><span className="window-dots"><i/><i/><i/></span><div className="file-tabs">{['App.jsx','security.js'].map(t=><button className={tab===t?'active':''} key={t} onClick={()=>setTab(t)}>{t}</button>)}</div><Code2 size={14}/></div>
          <div className="code-area">{code.map((line,i)=><div className="code-line" key={i}><span>{String(i+1).padStart(2,'0')}</span><code className={line.includes('const')||line.includes('await')||line.includes('export')?'code-key':line.includes('//')?'code-comment':''}>{line || ' '}</code></div>)}</div>
          <div className="editor-foot"><span><CircleDot size={12}/> JSX</span><span>UTF-8</span><span>DEMO FILE</span></div>
        </div>
        <div className="dash-git">
          <div className="dash-panel-title"><GitBranch size={14}/> GIT GRAPH</div>
          <div className="git-branch"><span className="git-line cyan-line"/><i className="git-node cyan-node"/><div><b>main</b><small>a1b2c3d · Initial commit</small></div></div>
          <div className="git-branch branch-purple"><span className="git-line purple-line"/><i className="git-node purple-node"/><div><b>feature-login</b><small>e4f5g6h · Auth UI</small></div></div>
          <div className="git-branch branch-orange"><span className="git-line orange-line"/><i className="git-node orange-node"/><div><b>security-review</b><small>j7k8l9m · Policy checks</small></div></div>
          <div className="git-summary"><GitBranch size={14}/> 3 demo branches</div>
        </div>
        <div className="dash-browser">
          <div className="window-title"><span className="window-dots"><i/><i/><i/></span><b>Browser Preview</b><ArrowUpRight size={14}/></div>
          <div className="browser-screen"><div className="browser-top"><span/> localhost / preview</div><div className="browser-content"><div className="browser-logo">A</div><b>CYBER-AGENT AI</b><p>Detect. Defend. Automate.</p><div className="browser-cta">OPEN DASHBOARD <ArrowRight size={12}/></div></div></div>
        </div>
      </div>
      <div className="dash-bottom"><span><LockKeyhole size={13}/> SANDBOXED DEMO</span><span><Activity size={13}/> UI INTERACTIONS ENABLED</span><span>NO LIVE TARGET SCANNING</span></div>
    </div>
    <div className="dashboard-note"><AlertTriangle size={15}/> The terminal, code, Git graph and metrics shown here are illustrative UI data; they do not execute scans or access your device.</div>
  </div></section>
}

function Impact() {
  const metrics = [
    {icon: ShieldCheck, value:'24/7', label:'DESIGNED FOR MONITORING'},
    {icon: Radar, value:'17+', label:'FEATURE AREAS'},
    {icon: Zap, value:'3 STEP', label:'DETECT • ANALYZE • RESPOND'},
    {icon: LockKeyhole, value:'ZERO', label:'TRUST BY DEFAULT'},
  ]
  return <section className="impact-section"><div className="container impact-inner"><div><div className="eyebrow">OUR MISSION</div><h2>TRUSTED BY DESIGN.<br/><span className="text-cyan">BUILT FOR A SAFER FUTURE.</span></h2><p>Bring security awareness into everyday digital work.</p></div><div className="metrics-grid">{metrics.map(m=>{const Icon=m.icon;return <div className="metric-card" key={m.label}><Icon size={22}/><b>{m.value}</b><small>{m.label}</small></div>})}</div></div></section>
}

function Pricing({ onAuth }) {
  const plans = [
    {name:'STARTER', price:'FREE', desc:'Explore the interface and core concepts.', items:['AI assistant UI','Feature overview','Demo workspace'], action:'Start Free', featured:false},
    {name:'PRO', price:'Coming soon', desc:'For individual builders and security learners.', items:['Expanded workflows','Code review integrations','Personal activity history'], action:'Join Interest List', featured:true},
    {name:'ENTERPRISE', price:'Custom', desc:'For teams with specific security requirements.', items:['Team controls','Policy integrations','Deployment planning'], action:'Contact Us', featured:false},
  ]
  return <section className="section pricing-section" id="pricing"><div className="container"><SectionTitle eyebrow="PLANS & ACCESS" title={<>CHOOSE YOUR <span className="text-cyan">DEFENSE LEVEL</span></>} text="Transparent concept plans; production services and prices are not yet connected."/>
    <div className="pricing-grid">{plans.map(p=><article className={`pricing-card ${p.featured?'featured':''}`} key={p.name}>{p.featured&&<div className="popular-tag">RECOMMENDED</div>}<div className="pricing-name">{p.name}</div><h3>{p.price}</h3><p>{p.desc}</p><ul>{p.items.map(it=><li key={it}><Check size={15}/>{it}</li>)}</ul><button className={`button ${p.featured?'button-primary':'button-outline'} full-width`} onClick={()=>onAuth('register')}>{p.action}<ArrowRight size={15}/></button></article>)}</div>
  </div></section>
}

function FinalCTA({ onAuth }) {
  return <section className="final-cta"><div className="container final-cta-inner"><div className="cta-emblem"><ShieldCheck size={45}/></div><div><div className="eyebrow">YOUR NEXT LAYER OF DEFENSE</div><h2>READY TO SECURE YOUR DIGITAL WORLD?</h2><p>Explore the CYBER-AGENT AI experience.</p></div><div className="cta-actions"><button className="button button-outline" onClick={()=>onAuth('login')}>Login</button><button className="button button-primary" onClick={()=>onAuth('register')}>Register <ArrowRight size={16}/></button></div></div></section>
}

function Footer() {
  return <footer className="footer"><div className="container footer-top"><Logo/><div className="footer-links"><a href="#home">Home</a><a href="#features">Features</a><a href="#solutions">Solutions</a><a href="#pricing">Pricing</a><a href="#about">About</a></div><div className="footer-social"><a href="#home" aria-label="GitHub"><Code2/></a><a href="#home" aria-label="Network"><Network/></a><a href="#home" aria-label="Activity"><Activity/></a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} CYBER-AGENT AI. All rights reserved.</span><span>DETECT <i/> DEFEND <i/> AUTOMATE</span><span className="footer-disclaimer">Concept UI • Demo data</span></div></footer>
}

export default function App() {
  const [authMode, setAuthMode] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    document.body.style.overflow = authMode ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [authMode])
  return <div className="app-shell">
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
    <Header onAuth={setAuthMode}/>
    <main>
      <Hero onAuth={setAuthMode}/>
      <FeatureGrid/>
      <AgentSection/>
      <Workflow/>
      <Solutions/>
      <DashboardPreview/>
      <Impact/>
      <Pricing onAuth={setAuthMode}/>
      <FinalCTA onAuth={setAuthMode}/>
    </main>
    <Footer/>
    <AuthModal mode={authMode} onClose={()=>setAuthMode(null)} onModeChange={setAuthMode}/>
    <button className={`back-to-top ${scrolled?'visible':''}`} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top"><ArrowDownRight size={18}/></button>
  </div>
}