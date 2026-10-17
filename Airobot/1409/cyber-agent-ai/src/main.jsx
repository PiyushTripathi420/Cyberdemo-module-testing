import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Check, Send, Volume2, VolumeX, FileText, ShieldCheck, Sparkles, RotateCcw } from 'lucide-react';
import './styles.css';

const starterMessages = [
  { from: 'bot', text: 'How can I assist you?' },
  { from: 'user', text: 'Your task has been completed!' },
  { from: 'bot', text: 'Generate the report.' }
];

function Robot({ talking }) {
  return <div className={`robot-wrap ${talking ? 'is-talking' : ''}`} aria-label="Animated blue AI assistant">
    <div className="robot-aura" />
    <svg className="robot-svg" viewBox="0 0 310 310" role="img" aria-label="Blue humanoid AI robot face with glowing headphones">
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#071a3c"/><stop offset=".36" stopColor="#1675b9"/><stop offset=".7" stopColor="#49d8f7"/><stop offset="1" stopColor="#10234e"/></linearGradient>
        <linearGradient id="face" x1="0" y1="0" x2="1" y2=".8"><stop stopColor="#062047"/><stop offset=".42" stopColor="#257db6"/><stop offset=".7" stopColor="#73eaff"/><stop offset="1" stopColor="#102750"/></linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#03214b"/><stop offset=".5" stopColor="#24b8eb"/><stop offset="1" stopColor="#08152e"/></linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="155" cy="288" rx="112" ry="16" fill="#00d9ff" opacity=".14"/>
      <path d="M20 304 Q28 252 72 235 L116 215 L195 215 L240 237 Q280 260 292 304Z" fill="url(#skin)" stroke="#2beaff" strokeWidth="2"/>
      <path d="M103 226 L128 208 L181 208 L207 228 L190 268 L121 268Z" fill="#06142e" stroke="#24dfff" strokeWidth="2"/>
      <path d="M136 224 L174 224 L181 258 L128 258Z" fill="#071a37" stroke="#176f9e"/>
      {[0,1,2].map((n)=><rect key={n} x="146" y={230+n*9} width="18" height="3" rx="1.5" fill="#48f3ff" opacity={1-n*.2} filter="url(#glow)"/>)}
      <path d="M111 72 Q114 29 155 27 Q202 29 205 75 L201 146 Q194 188 157 202 Q119 190 108 148Z" fill="url(#face)" stroke="#65efff" strokeWidth="2.2"/>
      <path d="M119 67 Q128 40 155 39 Q183 40 195 67" fill="none" stroke="#b7faff" strokeWidth="2" opacity=".7"/>
      <path d="M117 105 Q134 91 148 105 L145 112 Q132 108 120 114Z" fill="#04142f"/>
      <path d="M164 105 Q179 91 194 105 L191 114 Q177 108 165 112Z" fill="#04142f"/>
      <path d="M122 108 Q134 102 145 108" stroke="#a5ffff" strokeWidth="4" strokeLinecap="round" filter="url(#glow)"/>
      <path d="M166 108 Q179 102 190 108" stroke="#a5ffff" strokeWidth="4" strokeLinecap="round" filter="url(#glow)"/>
      <path d="M155 113 L147 143 L159 148" fill="none" stroke="#56dfff" strokeWidth="2" opacity=".9"/>
      <path d="M132 161 Q155 170 179 160" fill="none" stroke="#0b2c55" strokeWidth="4" strokeLinecap="round"/>
      <path className="mouth-line" d="M136 161 Q155 166 174 161" fill="none" stroke="#a3ffff" strokeWidth="2.5" strokeLinecap="round"/>
      <path className="mouth-open" d="M137 158 Q155 155 173 158 Q169 175 155 175 Q141 173 137 158Z" fill="#020916" stroke="#76f8ff" strokeWidth="2"/>
      <path d="M110 78 Q91 79 91 106 L95 143 Q101 164 117 164" fill="none" stroke="#32eaff" strokeWidth="4" filter="url(#glow)"/>
      <path d="M201 78 Q220 79 220 106 L216 143 Q210 164 195 164" fill="none" stroke="#32eaff" strokeWidth="4" filter="url(#glow)"/>
      <rect x="78" y="88" width="24" height="52" rx="11" fill="url(#metal)" stroke="#63f3ff" strokeWidth="3" filter="url(#glow)"/>
      <ellipse cx="90" cy="114" rx="4" ry="13" fill="#9dffff"/>
      <rect x="209" y="88" width="24" height="52" rx="11" fill="url(#metal)" stroke="#63f3ff" strokeWidth="3" filter="url(#glow)"/>
      <ellipse cx="221" cy="114" rx="4" ry="13" fill="#9dffff"/>
      <path d="M80 109 Q69 136 82 166 L107 193" fill="none" stroke="#2aeaff" strokeWidth="2" opacity=".8"/>
      <path d="M231 109 Q242 136 229 166 L204 193" fill="none" stroke="#2aeaff" strokeWidth="2" opacity=".8"/>
      <circle cx="132" cy="75" r="2" fill="#aaffff"/><circle cx="180" cy="68" r="1.8" fill="#aaffff"/><circle cx="189" cy="132" r="1.5" fill="#aaffff"/>
      <path d="M128 186 L136 194 M183 185 L175 194" stroke="#4aeaff" strokeWidth="2"/>
    </svg>
  </div>;
}

function PanelBar({ color = 'cyan' }) { return <div className={`panel-bar ${color}`}><span/><span/><span/><div className="bar-controls">▰　▱　■</div></div>; }
function StatusCard({ title, subtitle, second = false }) { return <div className={`status-card ${second ? 'status-right' : ''}`}><div className="check-ring"><Check size={29}/></div><div><div className="status-title">{title}</div><div className="status-subtitle">{subtitle}</div></div><span className="corner-mark"/></div>; }
function CodePane({ second = false }) {
  const lines = second ? [
    ['1', '{'], ['2', '  let data = fetch_data();'], ['3', '  if (data) {'], ['4', '    return response.json(data)'], ['5', '    process_data(data)'], ['6', '  }'], ['7', '}'], ['8', ''], ['9', '  // integrity check passed'], ['10', '  return status.success']
  ] : [
    ['31', '# secure_request_handler'], ['32', 'def fetch_data(url):'], ['33', '    response = requests.get(url)'], ['34', '    return response.json()'], ['35', '}'], ['36', 'if __name__ == "__main__":'], ['37', '    data = fetch_data()'], ['38', '    process_data(data)']
  ];
  return <section className="code-pane"><PanelBar color={second ? 'purple' : 'cyan'}/><div className="code-toolbar"><span className="tiny-track"/><span className="tiny-track short"/></div><div className="code-lines">{lines.map(([num, code], i) => <div className="code-line" key={num}><span className="line-num">{num}</span><code className={i % 3 === 0 ? 'code-green' : i % 3 === 1 ? 'code-purple' : 'code-blue'}>{code || ' '}</code></div>)}</div><div className="pane-scroll"><i/></div><div className="pane-footer"><span/></div></section>;
}
function GitGraph() {
 return <div className="git-body"><svg className="git-lines" viewBox="0 0 560 210" preserveAspectRatio="none"><g fill="none" strokeWidth="3"><path d="M26 38 H88 V76 H153 V119 H210 V162 H260 H332 L376 119 H443" stroke="#17e9ee"/><path d="M88 76 H258 H330 L375 76 H475" stroke="#21b7e9"/><path d="M153 119 H300 H374 L410 119 H475" stroke="#bb55fa"/><path d="M210 162 H300 H356 H410 L443 119" stroke="#8b63ef"/><path d="M258 76 L300 119" stroke="#7a51d5"/><path d="M332 76 L374 119" stroke="#9b57e9"/></g>{[[26,38,'#4df9ff'],[88,38,'#27e8f5'],[88,76,'#3debf4'],[153,76,'#44dcff'],[153,119,'#27e8f5'],[210,119,'#6deaff'],[210,162,'#bf67ff'],[260,162,'#ba67ff'],[300,162,'#7faaff'],[356,162,'#bd69ff'],[258,76,'#20c6ec'],[300,119,'#b969fa'],[332,76,'#25b8eb'],[374,76,'#f28cff'],[410,119,'#cf66fa'],[443,119,'#cb66ff'],[475,76,'#c866ff']].map(([x,y,c],i)=><circle key={i} cx={x} cy={y} r="5.5" fill={c} stroke={c} strokeWidth="1"/> )}</svg><div className="branch-label main-label">main</div><div className="branch-label feature-label">feature-login</div><div className="branch-label bug-label">bugfix-issue-42</div><span className="hash hash-one">a3d4f21</span><span className="hash hash-two">c911656</span></div>
}
function App() {
 const [messages, setMessages] = useState(starterMessages);
 const [input, setInput] = useState('');
 const [talking, setTalking] = useState(false);
 const [muted, setMuted] = useState(false);
 const [report, setReport] = useState(false);
 const [taskDone, setTaskDone] = useState(true);
 const chatEnd = useRef(null);
 useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
 useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);
 const speak = (text) => {
   if (muted || !('speechSynthesis' in window)) return;
   window.speechSynthesis.cancel();
   const utterance = new SpeechSynthesisUtterance(text);
   utterance.rate = 0.96; utterance.pitch = 0.88; utterance.volume = 1;
   utterance.onstart = () => setTalking(true); utterance.onend = () => setTalking(false); utterance.onerror = () => setTalking(false);
   window.speechSynthesis.speak(utterance);
 };
 const answerFor = (text) => {
   const q = text.toLowerCase();
   if (q.includes('report')) return 'Your security report is ready. It includes task status, code integrity notes, and the current branch overview.';
   if (q.includes('scan') || q.includes('security') || q.includes('vulnerab')) return 'I can help review security findings. Connect your scanner or provide logs and code so I can analyze actual results. This demo does not run a real security scan yet.';
   if (q.includes('help')) return 'I am your CYBER-AGENT AI interface. Ask for a report, a security review, or an explanation of the dashboard.';
   return `I received: “${text}”. I can help with security reports, code-integrity review, and dashboard tasks. Connect a backend AI service for full intelligent responses.`;
 };
 const send = (text = input) => {
   const clean = text.trim(); if (!clean) return;
   setMessages(m => [...m, { from: 'user', text: clean }]); setInput('');
   const answer = answerFor(clean);
   window.setTimeout(() => { setMessages(m => [...m, { from: 'bot', text: answer }]); speak(answer); }, 350);
 };
 const generateReport = () => { setReport(true); setTaskDone(true); const text = 'Security report generated successfully. The current demo shows the task as completed; connect a security-analysis backend to populate real findings.'; setMessages(m => [...m, { from: 'bot', text }]); speak(text); };
 return <main className="app-shell"><div className="ambient ambient-cyan"/><div className="ambient ambient-purple"/>
   <header className="status-row"><StatusCard title="Task Completed" subtitle={report ? 'Security Report Ready!' : 'Report Generated Successfully!'}/><StatusCard title="AI Process Complete" subtitle="All Tasks Finished!" second/></header>
   <div className="dashboard-frame"><div className="editor-column"><CodePane/><CodePane second/></div><div className="right-column"><section className="assistant-panel"><PanelBar/><div className="assistant-content"><div className="robot-stage"><Robot talking={talking}/><span className="robot-label"><span className="live-dot"/> AI ONLINE</span></div><div className="chat-area"><div className="chat-messages">{messages.map((m,i)=><div className={`bubble ${m.from}`} key={i}>{m.text}</div>)}<div ref={chatEnd}/></div><form className="chat-compose" onSubmit={e=>{e.preventDefault();send();}}><input aria-label="Message AI assistant" value={input} onChange={e=>setInput(e.target.value)} placeholder="Message AI assistant..."/><button title="Send message" aria-label="Send message"><Send size={16}/></button></form></div></div><div className="assistant-footer"><span className="footer-glow"/><div className="assistant-tools"><button onClick={()=>setMuted(v=>!v)} title={muted?'Enable voice':'Mute voice'}>{muted?<VolumeX size={15}/>:<Volume2 size={15}/>}</button><button onClick={()=>{setMessages(starterMessages);setTalking(false);}} title="Reset conversation"><RotateCcw size={15}/></button><span className="online-state"><i/> {talking ? 'SPEAKING' : 'READY'}</span></div></div></section>
   <section className="git-panel"><PanelBar color="purple"/><GitGraph/><div className="git-footer"><span/><span/></div></section></div></div>
   <div className="bottom-actions"><span className="secure-tag"><ShieldCheck size={13}/> SECURE SESSION</span><span className="bottom-divider"/><span className="build-label">CYBER-AGENT <b>AI</b> <i>v1.0</i></span><button onClick={generateReport} className="report-button"><FileText size={14}/>{report ? 'Report Generated' : 'Generate Report'}</button><button className="complete-button" onClick={()=>setTaskDone(v=>!v)}><Sparkles size={14}/>{taskDone ? 'Task Completed' : 'Mark Task Complete'}</button></div>
 </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
