// src/app/page.tsx (v1.4 Update)
'use client';
import { useState, useEffect } from 'react';

export default function SiddiqAI() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [previewSize, setPreviewSize] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);

  useEffect(() => {
    const savedPass = localStorage.getItem('siddiq_access');
    if (savedPass === 'SiddiqAI2025') setIsAuthorized(true);
  }, []);

  const handleLogin = () => {
    if (passInput === 'SiddiqAI2025') {
      localStorage.setItem('siddiq_access', passInput);
      setIsAuthorized(true);
    } else {
      alert("Invalid Code");
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

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <h1 className="text-3xl font-black text-blue-500 mb-2 italic">SIDDIQ AI</h1>
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-10">Security Portal</p>
          <input 
            type="password" 
            placeholder="ACCESS CODE" 
            className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-600 transition-all text-center mb-4 text-sm tracking-widest"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full bg-blue-600 p-4 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">UNLOCK</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/10 p-6 flex flex-col bg-[#0a0a0a]">
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-blue-500 italic">SIDDIQ AI</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">PRO EDITION v1.4</p>
          </div>
          <button onClick={() => {localStorage.removeItem('siddiq_access'); setIsAuthorized(false);}} className="text-gray-700 hover:text-red-500 transition-colors">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Build Instruction</label>
            <textarea 
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 outline-none h-56 text-sm transition-all resize-none shadow-inner"
              placeholder="Describe your website..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <button 
            onClick={generateWebsite}
            className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Siddiq AI is Engineering...' : 'Build / Update'}
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex gap-8">
            <button onClick={() => setView('preview')} className={`text-xs font-bold uppercase tracking-widest transition-all ${view === 'preview' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Canvas</button>
            <button onClick={() => setView('code')} className={`text-xs font-bold uppercase tracking-widest transition-all ${view === 'code' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Code</button>
          </div>

          {/* Responsive Switcher */}
          <div className="flex bg-gray-200 p-1 rounded-xl gap-1">
            <button onClick={() => setPreviewSize('desktop')} className={`px-3 py-1 rounded-lg text-xs transition-all ${previewSize === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}><i className="fas fa-desktop"></i></button>
            <button onClick={() => setPreviewSize('tablet')} className={`px-3 py-1 rounded-lg text-xs transition-all ${previewSize === 'tablet' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}><i className="fas fa-tablet-alt"></i></button>
            <button onClick={() => setPreviewSize('mobile')} className={`px-3 py-1 rounded-lg text-xs transition-all ${previewSize === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}><i className="fas fa-mobile-alt"></i></button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex justify-center p-8 bg-gray-200">
          <div className={`transition-all duration-500 shadow-2xl bg-white overflow-hidden rounded-xl border border-gray-300 ${
            previewSize === 'desktop' ? 'w-full h-full' : 
            previewSize === 'tablet' ? 'w-[768px] h-[1024px]' : 
            'w-[375px] h-[667px]'
          }`}>
            {view === 'preview' ? (
              <iframe 
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <script src="https://cdn.tailwindcss.com"></script>
                      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
                    </head>
                    <body>${generatedCode || '<div class="flex items-center justify-center h-screen text-gray-400 italic">Siddiq AI Platform Ready</div>'}</body>
                  </html>
                `}
                className="w-full h-full border-none"
              />
            ) : (
              <div className="bg-[#0a0a0a] h-full p-10 overflow-auto">
                <pre className="text-blue-400 font-mono text-sm"><code>{generatedCode}</code></pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}