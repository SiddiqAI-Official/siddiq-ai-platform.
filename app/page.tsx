'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function SiddiqAI() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [previewSize, setPreviewSize] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [messages, setMessages] = useState<any[]>([]);

  const MASTER_KEY = "SiddiqAI@2025";

  useEffect(() => {
    const savedPass = localStorage.getItem('siddiq_access');
    const savedCode = localStorage.getItem('siddiq_code');
    const savedMsgs = localStorage.getItem('siddiq_msgs');
    if (savedPass === MASTER_KEY) setIsAuthorized(true);
    if (savedCode) setGeneratedCode(savedCode);
    if (savedMsgs) setMessages(JSON.parse(savedMsgs));
  }, []);

  const handleLogin = () => {
    if (passInput.trim() === MASTER_KEY) {
      localStorage.setItem('siddiq_access', MASTER_KEY);
      setIsAuthorized(true);
    } else { alert("Wrong Code!"); }
  };

  const startNewProject = () => {
    if(confirm("Start new project? Clear history?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const saveToCloud = async () => {
    const { error } = await supabase.from('projects').insert([{ name: 'Siddiq AI v3.7', code: generatedCode, history: messages }]);
    if (error) alert("Error: " + error.message);
    else alert("Saved to Cloud! ☁️");
  };

  const generateWebsite = async () => {
    if (!prompt) return;
    setLoading(true);
    const newMsgs = [...messages, { role: 'user', content: prompt }];
    setMessages(newMsgs);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: newMsgs }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      const cleanCode = data.code.replace(/```html|```/g, '').trim();
      setGeneratedCode(cleanCode);
      localStorage.setItem('siddiq_code', cleanCode);
      const updatedHistory = [...newMsgs, { role: 'assistant', content: cleanCode }];
      setMessages(updatedHistory);
      localStorage.setItem('siddiq_msgs', JSON.stringify(updatedHistory));
      setPrompt(''); 
    } catch (err) { alert("AI Error!"); }
    setLoading(false);
  };

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-black flex items-center justify-center p-6 text-white font-sans text-center text-sm">
        <div className="w-full max-w-sm bg-gray-900 border border-white/10 p-10 rounded-[2rem] shadow-2xl">
          <h1 className="text-3xl font-black text-blue-500 mb-6 italic tracking-tighter">SIDDIQ AI</h1>
          <input type="password" placeholder="ACCESS CODE" className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-600 mb-4 text-white text-center font-bold tracking-[0.4em]" value={passInput} onChange={(e) => setPassInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          <button onClick={handleLogin} className="w-full bg-blue-600 p-4 rounded-xl font-bold uppercase tracking-widest">Unlock</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      
      {/* Sidebar */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-[#0a0a0a] z-30 shadow-xl">
        <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center">
          <h1 className="text-xl font-black text-blue-500 italic">SIDDIQ AI</h1>
          <div className="flex gap-4">
            <button onClick={startNewProject} title="New" className="text-gray-500 hover:text-white"><i className="fas fa-plus-circle"></i></button>
            <button onClick={saveToCloud} title="Save" className="text-gray-500 hover:text-blue-400"><i className="fas fa-cloud"></i></button>
            <button onClick={() => {localStorage.removeItem('siddiq_access'); window.location.reload();}} className="text-gray-500 hover:text-red-500"><i className="fas fa-power-off"></i></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.filter(m => m.role === 'user').map((m, i) => (
            <div key={i} className="p-3 rounded-xl bg-blue-600/20 border border-blue-600/30 text-[10px] text-blue-100 flex items-start gap-2">
              <i className="fas fa-comment-dots mt-1 opacity-50"></i> {m.content}
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#0a0a0a] border-t border-white/5 space-y-3">
          <textarea className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 outline-none h-24 text-sm text-white resize-none shadow-inner" placeholder="What to build?" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button onClick={generateWebsite} className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-xl font-bold shadow-lg disabled:opacity-50 text-xs" disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'UPDATE DESIGN'}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col bg-[#f1f5f9] overflow-hidden">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-20">
          <div className="flex gap-4">
            <button onClick={() => setView('preview')} className={`text-[10px] font-black uppercase ${view === 'preview' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Canvas</button>
            <button onClick={() => setView('code')} className={`text-[10px] font-black uppercase ${view === 'code' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Source</button>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg gap-1 border border-gray-200 shadow-inner">
            <button onClick={() => setPreviewSize('desktop')} className={`p-1.5 px-3 rounded-md text-xs ${previewSize === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}><i className="fas fa-desktop text-[10px]"></i></button>
            <button onClick={() => setPreviewSize('tablet')} className={`p-1.5 px-3 rounded-md text-xs ${previewSize === 'tablet' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}><i className="fas fa-tablet-alt text-[10px]"></i></button>
            <button onClick={() => setPreviewSize('mobile')} className={`p-1.5 px-3 rounded-md text-xs ${previewSize === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}><i className="fas fa-mobile-alt text-[10px]"></i></button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex justify-center items-start md:p-8 p-2 bg-[#e2e8f0]/50">
          <div style={{ width: previewSize === 'desktop' ? '100%' : previewSize === 'tablet' ? '768px' : '375px', height: previewSize === 'desktop' ? '100%' : '667px' }} className="transition-all duration-500 shadow-2xl bg-white overflow-hidden rounded-2xl border border-gray-300 mx-auto relative">
            {view === 'preview' ? (
              <iframe srcDoc={`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet"><style>body{margin:0;padding:0;overflow-x:hidden;font-family:sans-serif;}</style></head><body>${generatedCode || '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#cbd5e1;text-transform:uppercase;letter-spacing:5px;font-size:10px;font-weight:900;">Engine Ready</div>'}</body></html>`} className="w-full h-full border-none bg-white" />
            ) : (
              <div className="bg-[#0a0a0a] h-full p-6 overflow-auto text-blue-400 font-mono text-xs shadow-inner"><pre><code>{generatedCode}</code></pre></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}