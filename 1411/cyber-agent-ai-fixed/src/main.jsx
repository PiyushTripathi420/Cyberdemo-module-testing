import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { createRoot } from 'react-dom/client';
import {
  ShieldCheck, CheckCircle2, Code2, Terminal as TerminalIcon, FolderOpen,
  Play, FileUp, Send, ChevronDown, GitBranch, FileCode2, Activity, Wifi,
  Settings, X, Paperclip, Download, RefreshCw, Mic, MicOff, Volume2
} from 'lucide-react';
import robot from './assets/ai-robot-reference.jpg';
import './styles.css';

/*
  Required model path:
  public/models/cyber-agent.glb

  This dashboard is a frontend demo. The terminal is simulated and the
  security findings are illustrative, not a real scan of the user's device.
*/

function GLBAvatar({ speaking, active = false, onModelError }) {
  const { scene, animations } = useGLTF('/models/cyber-agent.glb');
  const model = useMemo(() => scene.clone(true), [scene]);
  const { actions, names } = useAnimations(animations, model);
  const morphMeshes = useRef([]);
  const elapsed = useRef(0);
  const baseY = useRef(0);
  const blink = useRef({ next: 2.5, remaining: 0 });

  useEffect(() => {
    // Turn the avatar first, then measure its rotated bounds so centering stays correct.
    model.rotation.y = -Math.PI / 2;
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (!Number.isFinite(maxDim) || maxDim <= 0) {
      onModelError?.('The GLB file loaded, but it contains no visible 3D geometry.');
      return;
    }

    // Keep the whole avatar inside the frame rather than letting its head/feet crop.
    const scale = 1.55 / maxDim;
    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    baseY.current = model.position.y;
    morphMeshes.current = [];

    model.traverse((obj) => {
      if (!obj.isMesh) return;
      obj.castShadow = true;
      obj.receiveShadow = true;

      if (obj.morphTargetInfluences && obj.morphTargetDictionary) {
        const names = Object.keys(obj.morphTargetDictionary);
        const mouth = names.filter((name) =>
          /mouth.?open|jaw.?open|viseme.?aa|viseme.?ah|open.?mouth/i.test(name)
        );
        const eyes = names.filter((name) =>
          /eye.?blink|blink|eyes.?closed|close.?eyes/i.test(name)
        );

        morphMeshes.current.push({
          obj,
          mouthIndices: mouth.map((name) => obj.morphTargetDictionary[name]),
          blinkIndices: eyes.map((name) => obj.morphTargetDictionary[name])
        });
      }
    });
  }, [model, onModelError]);

  // Use a walk clip only if the GLB contains one. Otherwise keep the model
  // spatially fixed; procedural face animation still works without a paid API.
  useEffect(() => {
    const walkName = names.find((name) => /walk|walking/i.test(name));
    Object.entries(actions).forEach(([name, action]) => {
      if (!action) return;
      if (active && walkName && name === walkName) {
        action.reset().fadeIn(0.2).play();
      } else {
        action.fadeOut(0.2);
      }
    });
    return () => {
      Object.values(actions).forEach((action) => action?.fadeOut(0.1));
    };
  }, [active, actions, names]);

  useFrame((_, delta) => {
    elapsed.current += delta;

    // No orbit/drag reaction and no idle body sway: the avatar stays put.
    const mouthAmount = speaking
      ? 0.12 + Math.abs(Math.sin(elapsed.current * 12)) * 0.58
      : 0;

    blink.current.next -= delta;
    if (blink.current.next <= 0 && blink.current.remaining <= 0) {
      blink.current.remaining = 0.16;
      blink.current.next = 2.2 + Math.random() * 3.2;
    }

    const blinking = blink.current.remaining > 0;
    if (blinking) blink.current.remaining = Math.max(0, blink.current.remaining - delta);
    const blinkAmount = blinking
      ? Math.sin((1 - blink.current.remaining / 0.16) * Math.PI)
      : 0;

    morphMeshes.current.forEach(({ obj, mouthIndices, blinkIndices }) => {
      const influences = obj.morphTargetInfluences;
      if (!influences) return;

      mouthIndices.forEach((index) => {
        influences[index] = THREE.MathUtils.damp(influences[index] || 0, mouthAmount, 14, delta);
      });
      blinkIndices.forEach((index) => {
        influences[index] = THREE.MathUtils.damp(influences[index] || 0, blinkAmount, 22, delta);
      });
    });
  });

  return <primitive object={model} />;
}

class AvatarErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false, error: '' };
  }

  static getDerivedStateFromError(error) {
    return { failed: true, error: error?.message || 'Unknown 3D model error' };
  }

  componentDidCatch(error, info) {
    console.error('GLB avatar error:', error);
    console.error('Component stack:', info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback || (
        <div className="avatar-fallback">
          <img src={robot} alt="Cyber-Agent AI preview" />
          <div className="avatar-placeholder">
            <b>3D MODEL LOADING FAILED</b>
            <span>{this.state.error}</span>
            <span>Check the browser console and GLB file path.</span>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const initialFiles = {
  'app.py': `from flask import Flask, request, jsonify
from analyzer import analyze_data
from utils import generate_report

app = Flask(__name__)

@app.route('/scan', methods=['POST'])
def scan():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    result = analyze_data(data)
    report = generate_report(result)
    return jsonify({"status": "success", "report": report})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)`,
  'analyzer.py': `import re

def analyze_data(payload):
    findings = []
    source = str(payload)
    patterns = {
        "Possible SQL injection": r"(union\\s+select|or\\s+1=1)",
        "Possible script injection": r"<script|javascript:",
    }
    for label, pattern in patterns.items():
        if re.search(pattern, source, re.I):
            findings.append({"severity": "high", "issue": label})
    return {"findings": findings, "scanned": True}`,
  'utils.py': `from datetime import datetime

def generate_report(result):
    return {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "findings": result.get("findings", []),
        "summary": "Scan complete"
    }`,
  'README.md': `# CYBER-AGENT AI

React-based cybersecurity dashboard demo.

Run npm install, then npm run dev.`,
  'requirements.txt': `flask>=3.0`,
  'package.json': `{
  "name": "cyber-agent-ai",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite --host 0.0.0.0"
  }
}`
};

const starterMessages = [
  {
    role: 'assistant',
    text: 'Hello. I’m your Cyber Agent AI. I can help with code analysis, vulnerability detection, and security reports. What would you like to investigate today?'
  }
];

function App() {
  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState('app.py');
  const [messages, setMessages] = useState(starterMessages);
  const [draft, setDraft] = useState('');
  const [networkOnline, setNetworkOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : false
  );
  const [glbAvailable, setGlbAvailable] = useState(false);
  const [modelError, setModelError] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [voice, setVoice] = useState(false);
  const [muted, setMuted] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [terminal, setTerminal] = useState([
    'PS C:\\cyber-agent-ai> npm run dev',
    '> cyber-agent-ai@1.0.0 dev',
    '> vite --host 0.0.0.0',
    '',
    '  VITE ready',
    '  ➜  Local:   http://localhost:5173/',
    '  ➜  Network: http://192.168.1.5:5173/',
    '  ➜  press h + enter to show help'
  ]);
  const [termInput, setTermInput] = useState('');
  const [runState, setRunState] = useState('Ready');
  const chatEnd = useRef(null);
  const fileInput = useRef(null);
  const speechRef = useRef(null);
  const recognitionRef = useRef(null);
  const online = networkOnline;

  useEffect(() => {
    const update = () => setNetworkOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);

    let cancelled = false;
    fetch('/models/cyber-agent.glb', { method: 'HEAD' })
      .then((response) => {
        if (!cancelled) setGlbAvailable(response.ok);
      })
      .catch(() => {
        if (!cancelled) setGlbAvailable(false);
      });

    return () => {
      cancelled = true;
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      recognitionRef.current?.stop?.();
    };
  }, []);

  const toggleVoice = () => {
    if (voice) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      setVoice(false);
    } else {
      setVoice(true);
      setMuted(false);
    }
  };

  const speak = (text) => {
    if (!voice || muted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    utterance.pitch = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('Voice input is not supported in this browser. Try Chrome on localhost or HTTPS.');
      return;
    }
    if (listening) {
      recognitionRef.current?.stop?.();
      setListening(false);
      return;
    }
    try {
      setVoiceError('');
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.onstart = () => setListening(true);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map((result) => result[0]?.transcript || '').join(' ').trim();
        if (transcript) setDraft(transcript);
      };
      recognition.onerror = (event) => {
        setListening(false);
        if (event.error === 'not-allowed') setVoiceError('Microphone permission denied. Allow microphone access in browser settings.');
        else setVoiceError(`Voice input error: ${event.error}. You can type your message instead.`);
      };
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      setListening(false);
      setVoiceError('Could not start the microphone. Check browser permission and try again.');
    }
  };

  const answerFor = (question) => {
    const text = question.toLowerCase();
    if (text.includes('scan') || text.includes('vulnerab') || text.includes('security')) {
      return 'Demo scan finished. Review these areas: validate and normalize untrusted input at the API boundary, and use parameterized database queries instead of string concatenation. This is a UI demonstration, not a real scan of your machine.';
    }
    if (text.includes('report')) {
      return 'Your demonstration report is ready. It includes scan status, example findings, recommended mitigations, and a timestamp. Use Generate Report to export it as a text file.';
    }
    if (text.includes('hello') || text.includes('hi')) {
      return 'Hello! I’m ready to help. Choose a file in the Explorer or ask me to explain a security concept.';
    }
    return `I received: “${question}”. I can explain the selected code, outline secure coding fixes, or produce a demonstration security report. For live analysis of your project, connect a trusted backend/API.`;
  };

  const send = () => {
    const question = draft.trim();
    if (!question) return;
    setMessages((current) => [...current, { role: 'user', text: question }]);
    setDraft('');
    setRunState('Analyzing');
    window.setTimeout(() => {
      const answer = answerFor(question);
      setMessages((current) => [...current, { role: 'assistant', text: answer }]);
      speak(answer);
      setRunState('Ready');
    }, 450);
  };

  const runCode = () => {
    setRunState('Running');
    setTerminal((current) => [
      ...current,
      `PS C:\\cyber-agent-ai> python ${activeFile}`,
      `[demo] Running ${activeFile} in preview mode...`,
      '[demo] Syntax preview complete. No real system command was executed.',
      ''
    ]);
    window.setTimeout(() => setRunState('Ready'), 350);
  };

  const executeTerminal = () => {
    const command = termInput.trim();
    if (!command) return;
    setTerminal((current) => [
      ...current,
      `PS C:\\cyber-agent-ai> ${command}`,
      command === 'clear' ? '' :
        command === 'help' ? 'Available demo commands: help, npm run dev, python app.py, clear' :
        command === 'npm run dev' ? 'VITE ready — http://localhost:5173/' :
        command === 'python app.py' ? '[demo] Flask app preview started on port 5000.' :
        '[demo] Terminal is simulated; command was not executed by the host.',
      ''
    ]);
    setTermInput('');
  };

  const importFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFiles((current) => ({ ...current, [file.name]: String(reader.result ?? '') }));
      setActiveFile(file.name);
      setTerminal((current) => [...current, `[file] Imported ${file.name} (${file.size} bytes)`]);
    };
    reader.onerror = () => {
      setTerminal((current) => [...current, `[file] Could not read ${file.name}`]);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const downloadText = (filename, text) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const saveFile = () => {
    downloadText(activeFile, files[activeFile] ?? '');
  };

  const generateReport = () => {
    const report = `CYBER-AGENT AI — DEMONSTRATION SECURITY REPORT
Generated: ${new Date().toISOString()}

Status: Demo completed
Finding 1: Validate and normalize untrusted input.
Finding 2: Use parameterized queries for database access.

Note: These are illustrative recommendations, not results from a real security scan.`;
    downloadText('cyber-agent-report.txt', report);
    setMessages((current) => [
      ...current,
      {
        role: 'assistant',
        text: 'Report generated and downloaded. It is marked as a demonstration report; no real system scan was performed.'
      }
    ]);
  };

  const lines = (files[activeFile] || '').split('\n');

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon"><ShieldCheck /></div>
          <div><b>CYBER-AGENT AI</b><small>ANALYZE · DETECT · PROTECT</small></div>
        </div>
        <div className="top-status">
          {online ? <><span className="online-dot" /><span>ONLINE</span><i /></> : <><span className="offline-dot" /><span>OFFLINE</span></>}
          <span className="date">{new Date().toLocaleDateString()}</span>
          <span className="clock">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <button className="icon-btn" title="Refresh connection status" onClick={() => setNetworkOnline(navigator.onLine)}><Wifi size={17} /></button>
          <button className="icon-btn" title="Settings"><Settings size={17} /></button>
        </div>
      </header>

      <main className="dashboard">
        <section className="status-row">
          <div className="status-card cyan"><CheckCircle2 /><div><b>Task Completed</b><span>Report Generated Successfully!</span></div></div>
          <div className="status-card violet"><CheckCircle2 /><div><b>AI Process Complete</b><span>All Tasks Finished!</span></div></div>
        </section>

        <section className="workspace">
          <div className="left-column">
            <section className="panel editor-panel">
              <div className="panel-tabs">
                <div className="tab active"><Code2 size={15} /> Code Editor</div>
                <div className="tab"><TerminalIcon size={15} /> Editor Preview</div>
                <div className="panel-tools">
                  <button title="Import file" onClick={() => fileInput.current?.click()}><FileUp size={15} /></button>
                  <button title="Save file" onClick={saveFile}><Download size={15} /></button>
                  <button title="Run preview" onClick={runCode}><Play size={15} /></button>
                </div>
              </div>

              <div className="editor-body">
                <aside className="explorer">
                  <div className="explorer-title"><span>EXPLORER</span><FolderOpen size={14} /></div>
                  <div className="tree-root"><ChevronDown size={13} /> cyber-agent-ai</div>
                  <div className="tree-indent">
                    <div className="tree-root"><ChevronDown size={13} /> src</div>
                    {Object.keys(files).map((name) => (
                      <button key={name} className={`file-item ${activeFile === name ? 'selected' : ''}`} onClick={() => setActiveFile(name)}>
                        <FileCode2 size={13} /><span>{name}</span>
                      </button>
                    ))}
                    <button className="file-item import-file" onClick={() => fileInput.current?.click()}><Paperclip size={13} /> Import file…</button>
                  </div>
                  <input ref={fileInput} type="file" hidden accept=".js,.jsx,.ts,.tsx,.py,.json,.md,.txt,.css,.html,.yml,.yaml,.sh" onChange={importFile} />
                </aside>

                <div className="code-area">
                  <div className="file-tab">
                    <FileCode2 size={13} />{activeFile}
                    <button onClick={() => setActiveFile('app.py')} title="Select app.py"><X size={12} /></button>
                    <span className="spacer" />
                    <button onClick={saveFile}>Save</button>
                  </div>
                  <div className="code-scroll">
                    <pre className="line-numbers">{lines.map((_, index) => <span key={index}>{index + 1}</span>)}</pre>
                    <textarea spellCheck="false" aria-label="Code editor" value={files[activeFile] ?? ''} onChange={(event) => setFiles((current) => ({ ...current, [activeFile]: event.target.value }))} />
                  </div>
                  <div className="editor-footer">
                    <span><span className="online-dot" /> {runState}</span>
                    <span>Ln 1, Col 1&nbsp;&nbsp; Spaces: 4&nbsp;&nbsp; {activeFile.endsWith('.py') ? 'Python' : 'Text'}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel terminal-panel">
              <div className="terminal-head">
                <div className="terminal-tab active"><TerminalIcon size={14} /> Terminal</div>
                <span>Problems</span><span>Output</span><span>Debug Console</span><span className="spacer" />
                <button onClick={() => setTerminal([])} title="Clear terminal">Clear</button>
                <button onClick={() => setTerminal((current) => [...current, 'PS C:\\cyber-agent-ai> npm run dev', 'VITE ready — http://localhost:5173/'])} title="Restart demo"><RefreshCw size={14} /></button>
              </div>
              <div className="terminal-output">
                {terminal.map((line, index) => (
                  <div key={index} className={line.includes('VITE') || line.includes('Local:') ? 'term-green' : line.includes('[demo]') ? 'term-muted' : ''}>{line || '\u00a0'}</div>
                ))}
                <form className="terminal-input" onSubmit={(event) => { event.preventDefault(); executeTerminal(); }}>
                  <span>PS C:\cyber-agent-ai&gt;</span>
                  <input value={termInput} onChange={(event) => setTermInput(event.target.value)} placeholder="type help and press Enter" aria-label="Terminal command" />
                </form>
              </div>
            </section>
          </div>

          <div className="right-column">
            <section className="panel assistant-panel" style={{ position: "relative", overflow: "visible", isolation: "isolate" }}>
              <div className="assistant-head">
                <div><Activity size={16} /><b>AI Assistant</b>{online && <span className="online-pill"><span className="online-dot" /> Online</span>}</div>
                <div className="assistant-controls">
                  <button className="live-avatar-btn" onClick={toggleVoice}><Volume2 size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />{voice ? 'Voice Replies ON' : 'Enable Voice Replies'}</button>
                  <button className="clear-btn" onClick={() => setMessages([])}>Clear Chat</button>
                </div>
              </div>

              <div className="assistant-main" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "12px", position: "relative", overflow: "visible", paddingTop: "18px" }}>
                {/* Keep voice controls OUTSIDE the 3D canvas so the model cannot cover them. */}
                <div style={{ position: 'relative', zIndex: 100, flex: '0 0 auto', width: '100%', minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', padding: '10px', margin: '0 0 6px 0', boxSizing: 'border-box', border: '1px solid rgba(69,162,158,.8)', borderRadius: 10, background: '#06172b', boxShadow: '0 4px 14px rgba(0,0,0,.4)' }}>
                  <button type="button" onClick={startListening} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 12px', borderRadius: 9, border: `1px solid ${listening ? '#ff5b75' : '#45a29e'}`, background: listening ? 'rgba(180,30,60,.92)' : 'rgba(2,16,35,.92)', color: '#eaffff', fontWeight: 700, fontSize: 12, boxShadow: '0 0 14px rgba(69,162,158,.22)' }}>
                    {listening ? <MicOff size={16} /> : <Mic size={16} />}{listening ? 'LISTENING…' : 'TALK TO AI'}
                  </button>
                  <button type="button" onClick={toggleVoice} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 12px', borderRadius: 9, border: `1px solid ${voice ? '#66fcf1' : '#35516c'}`, background: voice ? 'rgba(4,80,83,.94)' : 'rgba(2,16,35,.92)', color: '#eaffff', fontWeight: 700, fontSize: 12, boxShadow: '0 0 14px rgba(69,162,158,.22)' }}>
                    <Volume2 size={16} />{voice ? 'VOICE REPLIES ON' : 'ENABLE VOICE'}
                  </button>
                  <span style={{ color: listening ? '#ff8a9b' : speaking ? '#66fcf1' : '#8ba8c7', fontSize: 11, fontWeight: 700 }}>{listening ? 'LISTENING' : speaking ? 'SPEAKING' : online ? 'ONLINE' : 'OFFLINE'}</span>
                </div>
                <div className={`robot-frame live-frame ${speaking ? 'speaking' : ''}`} style={{ flex: '0 0 auto', width: '100%', maxWidth: 'none', minWidth: 0, height: '620px', minHeight: '620px', position: 'relative', overflow: 'hidden' }}>
                  <AvatarErrorBoundary fallback={
                    <div className="avatar-fallback">
                      <img src={robot} alt="Cyber-Agent AI robot preview" />
                      <div className="avatar-placeholder"><b>3D MODEL LOADING FAILED</b><span>{modelError || 'Check public/models/cyber-agent.glb and the browser console.'}</span></div>
                    </div>
                  }>
                    <Canvas camera={{ position: [0, 0, 4.2], fov: 38 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }} style={{ width: "100%", height: "100%", touchAction: "none" }}>
                      <color attach="background" args={['#041329']} />
                      <ambientLight intensity={0.8} />
                      <directionalLight position={[2, 3, 4]} intensity={2.1} />
                      <pointLight position={[-2, 1, 1]} intensity={1.2} color="#22dfff" />
                      <Suspense fallback={null}>
                        <GLBAvatar speaking={speaking} active={runState === "Analyzing"} onModelError={setModelError} />
                        <ContactShadows position={[0, -1.1, 0]} opacity={0.25} scale={2.4} blur={2} />
                      </Suspense>
                      <OrbitControls enabled={false} enablePan={false} enableRotate={false} enableZoom={false} target={[0, 0, 0]} />
                    </Canvas>
                  </AvatarErrorBoundary>
                  <div className="robot-scanline" />
                  <div className="robot-caption"><span className="pulse-ring" />{listening ? 'LISTENING — SPEAK NOW' : speaking ? 'SPEAKING' : modelError ? 'MODEL ERROR' : glbAvailable ? 'LOCAL 3D AVATAR' : 'CHECKING MODEL'}</div>
                </div>

                <div className="chat-side" style={{ flex: "1 1 auto", width: "100%", minWidth: 0 }}>
                  <div className="chat-messages">
                    {messages.map((message, index) => (
                      <div key={index} className={`message-row ${message.role}`}>
                        <div className="message-avatar">{message.role === 'assistant' ? <ShieldCheck size={15} /> : <span>YOU</span>}</div>
                        <div className="bubble">
                          <p>{message.text}</p>
                          <small>{message.role === 'assistant' ? 'CYBER AGENT' : 'YOU'} · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                        </div>
                      </div>
                    ))}
                    {runState === 'Analyzing' && <div className="typing"><span /><span /><span /> Analyzing request…</div>}
                    <div ref={chatEnd} />
                  </div>
                  <form className="chat-compose" onSubmit={(event) => { event.preventDefault(); send(); }}>
                    <button type="button" onClick={startListening} title={listening ? 'Stop microphone' : 'Speak to Cyber Agent'} aria-label={listening ? 'Stop microphone' : 'Speak to Cyber Agent'} style={{ background: listening ? '#ef4444' : 'transparent', color: listening ? '#fff' : '#66fcf1', border: '1px solid #24516a', borderRadius: '8px', minWidth: '38px' }}>{listening ? <MicOff size={17} /> : <Mic size={17} />}</button>
                    <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={listening ? 'Listening… bolo' : online ? 'Ask about code or security…' : 'Offline mode: ask about code or security…'} aria-label="Message the assistant" />
                    <button disabled={!draft.trim()} title="Send message"><Send size={17} /></button>
                  </form>
                  {voiceError && <div className="api-error" role="status">{voiceError}</div>}
                </div>
              </div>

              {!glbAvailable && !modelError && (
                <div className="api-error" role="status">
                  3D model file not confirmed yet. Check that <code>public/models/cyber-agent.glb</code> exists and is served by Vite. The rest of the dashboard can still run.
                </div>
              )}
              {modelError && <div className="api-error" role="status">{modelError}</div>}

              <div className="assistant-actions">
                <button className="primary-btn" onClick={generateReport}><Activity size={15} /> Generate Report</button>
                <button className="file-picker-btn" onClick={() => fileInput.current?.click()}><FolderOpen size={15} /> Select File <span>{activeFile}</span></button>
                <button className="file-picker-btn" onClick={() => setMuted((value) => !value)}>{muted ? 'Unmute Voice' : 'Mute Voice'}</button>
              </div>
            </section>

            <section className="panel git-panel">
              <div className="git-head">
                <div><GitBranch size={17} /><b>Git Branches &amp; Commits</b></div>
                <button className="branch-select" onClick={() => setMessages((current) => [...current, { role: 'assistant', text: 'Branch view: main, feature-login, and bugfix-issue-42 are illustrative branches in this dashboard.' }])}>main <ChevronDown size={14} /></button>
              </div>
              <div className="git-graph">
                <svg viewBox="0 0 680 170" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Git branches and commits">
                  <defs><linearGradient id="grad" x1="0" x2="1"><stop offset="0" stopColor="#00f5df" /><stop offset="1" stopColor="#c44cff" /></linearGradient></defs>
                  <path d="M25 28 H650 M25 28 V68 H100 V112 H150 V145 H350 Q380 145 405 112 L465 68 H650" fill="none" stroke="url(#grad)" strokeWidth="2" />
                  <path d="M100 68 H260 Q290 68 315 68 H650" fill="none" stroke="#17c8ff" strokeWidth="2" />
                  <path d="M150 112 H430 Q450 112 465 68" fill="none" stroke="#a44dff" strokeWidth="2" />
                  <g fill="#1ce9e2" stroke="#0c293f" strokeWidth="2">{[[25,28],[25,68],[100,68],[100,112],[150,112]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5" />)}</g>
                  <g fill="#27bfff" stroke="#12203e" strokeWidth="2">{[[180,68],[260,68],[315,68],[350,145]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5" />)}</g>
                  <g fill="#c05aff" stroke="#261744" strokeWidth="2">{[[150,145],[210,145],[275,145],[405,112],[465,68],[530,68],[600,68],[650,68]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5" />)}</g>
                </svg>
                <div className="branch-label main-label">main</div>
                <div className="branch-label feature-label">feature-login</div>
                <div className="branch-label bug-label">bugfix-issue-42</div>
                <div className="hash hash-one">a3d4f21 <small>Initial commit</small></div>
                <div className="hash hash-two">c911656 <small>Add login feature</small></div>
                <div className="hash hash-three">e7f3a2b <small>Fix issue #42</small></div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

useGLTF.preload('/models/cyber-agent.glb');

createRoot(document.getElementById('root')).render(<App />);
