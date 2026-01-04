'use client';
import { useState, useEffect } from 'react';

export default function SiddiqAI() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);

  // Check if already logged in
  useEffect(() => {
    const savedPass = localStorage.getItem('siddiq_access');
    if (savedPass === 'SiddiqAI2025') { // APNA PASSWORD YAHAN LIKHEN
      setIsAuthorized(true);
    }
  }, []);

  const handleLogin = () => {
    if (passInput === 'SiddiqAI2025') { // APNA PASSWORD YAHAN LIKHEN
      localStorage.setItem('siddiq_access', passInput);
      setIsAuthorized(true);
    } else {
      alert("Wrong Access Code!");
    }
  };

  const generateWebsite = async () => {
    if (!prompt) return;
    setLoading(true);
    const userMessage = { role: 'user', content: prompt };
    const historyWithUser = [...messages, userMessage];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: historyWithUser }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      const cleanCode = data.code.replace(/```html|```/g, '').trim();
      setGeneratedCode(cleanCode);
      setMessages([...historyWithUser, { role: 'assistant', content: cleanCode }]);
      setPrompt(''); 
      setView('preview');
    } catch (err) {
      alert("Error!");
    }
    setLoading(false);
  };

  // LOGIN SCREEN
  if (!isAuthorized) {
    return (
      <div className="h-screen bg-black flex items-center justify-center font-sans p-6">
        <div className="w-full max-w-md bg-gray-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <h1 className="text-3xl font-black text-blue-500 mb-2 italic">SIDDIQ AI</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mb-10">Restricted Access</p>
          
          <input 
            type="password" 
            placeholder="Enter Access Code" 
            className="w-full bg-black border border-gray-800 p-4 rounded-2xl outline-none focus:border-blue-600 transition-all text-center mb-4"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 p-4 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/10"
          >
            Unlock Platform
          </button>
        </div>
      </div>
    );
  }

  // MAIN BUILDER SCREEN (AUTHORIZED)
  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <div className="w-80 border-r border-white/10 p-6 flex flex-col bg-[#0a0a0a]">
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-blue-500 italic leading-none">SIDDIQ AI</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">Intelligence v1.3</p>
          </div>
          <button onClick={() => {localStorage.removeItem('siddiq_access'); setIsAuthorized(false);}} className="text-gray-600 hover:text-red-500 transition-colors">
            <i className="fas fa-lock text-xs"></i>
          </button>
        </div>
        
        <div className="flex-1 space-y-4">
          <textarea 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 outline-none h-48 text-sm transition-all resize-none shadow-inner"
            placeholder="Build your vision..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={generateWebsite}
            className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Siddiq AI is Engineering...' : 'Update Website'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white text-black">
        <div className="h-14 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex gap-8">
            <button onClick={() => setView('preview')} className={`text-xs font-bold uppercase tracking-widest ${view === 'preview' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Preview</button>
            <button onClick={() => setView('code')} className={`text-xs font-bold uppercase tracking-widest ${view === 'code' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Code</button>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ai.globalsiddiq.com</div>
        </div>

        <div className="flex-1 bg-gray-100">
          <iframe 
            srcDoc={view === 'preview' ? `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                  <script src="https://cdn.tailwindcss.com"></script>
                  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
                </head>
                <body>${generatedCode || '<div class="flex items-center justify-center h-screen bg-gray-50 text-gray-400 italic font-sans text-sm tracking-widest">Siddiq AI Platform is Ready</div>'}</body>
              </html>
            ` : ''}
            className={`w-full h-full border-none shadow-2xl bg-white ${view === 'code' ? 'hidden' : 'block'}`}
          />
          {view === 'code' && (
            <div className="bg-[#0a0a0a] h-full p-10 overflow-auto">
              <pre className="text-blue-400 font-mono text-sm"><code>{generatedCode}</code></pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}