'use client';
import { useState, useEffect, useMemo } from 'react';

export default function SiddiqAI() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'preview' | 'code'>('preview');

  const MASTER_KEY = "SiddiqAI@2025";

  useEffect(() => {
    if (localStorage.getItem('siddiq_access') === MASTER_KEY) setIsAuthorized(true);
    const saved = localStorage.getItem('siddiq_code');
    if (saved) setGeneratedCode(saved);
  }, []);

  const handleLogin = () => {
    if (passInput.trim() === MASTER_KEY) {
      localStorage.setItem('siddiq_access', MASTER_KEY);
      setIsAuthorized(true);
    } else { alert("Wrong Code!"); }
  };

  const generateWebsite = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      const cleanCode = data.code.replace(/```html|```/g, '').trim();
      setGeneratedCode(cleanCode);
      localStorage.setItem('siddiq_code', cleanCode);
      setPrompt(''); 
      setView('preview');
    } catch (err) { alert("Error!"); }
    setLoading(false);
  };

  // Prevent re-rendering images when switching tabs
  const iframeContent = useMemo(() => {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet"><style>body{margin:0;padding:0;overflow-x:hidden;font-family:sans-serif;}</style></head><body>${generatedCode || '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#ccc;text-transform:uppercase;letter-spacing:5px;font-size:10px;font-weight:bold;">Siddiq AI Engine Ready</div>'}</body></html>`;
  }, [generatedCode]);

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-black flex items-center justify-center p-6 text-white font-sans text-center">
        <div className="w-full max-w-sm bg-gray-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <h1 className="text-3xl font-black text-blue-500 mb-6 italic tracking-tighter">SIDDIQ AI</h1>
          <input type="password" placeholder="ACCESS CODE" className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-600 mb-4 text-white text-center font-bold" value={passInput} onChange={(e) => setPassInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          <button onClick={handleLogin} className="w-full bg-blue-600 p-4 rounded-xl font-bold uppercase tracking-widest text-sm">Unlock Engine</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      
      {/* Sidebar */}
      <div className="w-full md:w-96 border-r border-white/10 flex flex-col bg-[#0a0a0a] z-30 shadow-xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center text-left">
          <div>
            <h1 className="text-xl font-black text-blue-500 italic">SIDDIQ AI</h1>
            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.3em]">Flux AI Engine v6.0</p>
          </div>
          <button onClick={() => {localStorage.clear(); window.location.reload();}} title="New Project" className="text-gray-600 hover:text-red-500"><i className="fas fa-power-off"></i></button>
        </div>
        
        <div className="p-6 flex-1 flex flex-col gap-6">
          <textarea className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 outline-none h-48 text-sm text-white transition-all" placeholder="E.g. A Ferrari rental website with luxury red cars..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button onClick={generateWebsite} className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-black text-xs tracking-widest shadow-lg disabled:opacity-50" disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : 'GENERATE AI DESIGN'}
          </button>
          <div className="mt-auto text-[10px] text-gray-600 text-center uppercase tracking-widest font-bold border border-white/5 p-4 rounded-2xl">
            <i className="fas fa-bolt text-blue-500 mr-2"></i> Real-time AI Generation
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col bg-[#f1f5f9] overflow-hidden">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 shadow-sm">
          <div className="flex gap-8">
            <button onClick={() => setView('preview')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${view === 'preview' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Canvas</button>
            <button onClick={() => setView('code')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${view === 'code' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Code Source</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex justify-center items-start md:p-8 p-2 bg-[#e2e8f0]/50">
          <div className="w-full h-full transition-all duration-500 shadow-2xl bg-white overflow-hidden rounded-2xl border border-gray-300 mx-auto">
            {view === 'preview' ? (
              <iframe srcDoc={iframeContent} className="w-full h-full border-none" />
            ) : (
              <div className="bg-[#0a0a0a] h-full p-6 overflow-auto text-blue-400 font-mono text-xs"><pre><code>{generatedCode}</code></pre></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}