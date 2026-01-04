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

  const MASTER_KEY = "SiddiqAI@2025";

  useEffect(() => {
    const savedPass = localStorage.getItem('siddiq_access');
    if (savedPass === MASTER_KEY) setIsAuthorized(true);
  }, []);

  const handleLogin = () => {
    if (passInput.trim() === MASTER_KEY) {
      localStorage.setItem('siddiq_access', MASTER_KEY);
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
      alert("Build Failed!");
    }
    setLoading(false);
  };

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center p-6 font-sans text-white">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl text-center">
          <h1 className="text-3xl font-black mb-1 italic text-blue-500">SIDDIQ AI</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-10">Secure Portal</p>
          <input 
            type="password" 
            placeholder="ACCESS CODE" 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-600 transition-all text-center text-white font-bold tracking-widest mb-4"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full bg-blue-600 p-4 rounded-xl font-bold hover:bg-blue-500 transition-all text-sm uppercase tracking-widest">Unlock</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      
      {/* SIDEBAR / HEADER */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-[#0a0a0a] z-30 shadow-xl">
        <div className="p-4 md:p-6 flex flex-row md:flex-col justify-between items-center md:items-start border-b border-white/5 md:border-0">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-blue-500 italic leading-none">SIDDIQ AI</h1>
            <p className="hidden md:block text-[8px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">v1.8 Perfected</p>
          </div>
          <button onClick={() => {localStorage.removeItem('siddiq_access'); setIsAuthorized(false);}} className="text-gray-600 hover:text-red-500 p-2">
            <i className="fas fa-power-off text-sm"></i>
          </button>
        </div>
        
        <div className="p-4 md:p-6 flex-1 flex flex-col gap-4">
          <textarea 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 outline-none h-20 md:h-64 text-sm transition-all resize-none text-white"
            placeholder="Type your vision..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={generateWebsite}
            className="w-full bg-blue-600 hover:bg-blue-500 p-3 md:p-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 text-xs uppercase"
            disabled={loading}
          >
            {loading ? <i className="fas fa-spinner animate-spin"></i> : 'Update Design'}
          </button>
        </div>
      </div>

      {/* MAIN CANVAS */}
      <div className="flex-1 flex flex-col bg-[#f1f5f9] overflow-hidden">
        <div className="h-12 md:h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 z-20 shadow-sm">
          <div className="flex gap-4 md:gap-8">
            <button onClick={() => setView('preview')} className={`text-[10px] font-black uppercase tracking-widest ${view === 'preview' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Canvas</button>
            <button onClick={() => setView('code')} className={`text-[10px] font-black uppercase tracking-widest ${view === 'code' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Code</button>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg gap-1 border border-gray-200">
            <button onClick={() => setPreviewSize('desktop')} className={`p-1.5 px-3 rounded-md text-xs ${previewSize === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}><i className="fas fa-desktop"></i></button>
            <button onClick={() => setPreviewSize('tablet')} className={`p-1.5 px-3 rounded-md text-xs ${previewSize === 'tablet' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}><i className="fas fa-tablet"></i></button>
            <button onClick={() => setPreviewSize('mobile')} className={`p-1.5 px-3 rounded-md text-xs ${previewSize === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}><i className="fas fa-mobile-alt"></i></button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex justify-center items-start md:p-8 bg-[#e2e8f0]/50 p-2">
          <div className={`transition-all duration-500 shadow-2xl bg-white overflow-hidden md:rounded-3xl rounded-xl border border-gray-300 ${
            previewSize === 'desktop' ? 'w-full h-full' : 
            previewSize === 'tablet' ? 'w-[768px] h-full' : 
            'w-[375px] h-[667px]'
          }`}>
            {view === 'preview' ? (
              <iframe 
                srcDoc={`
                  <!DOCTYPE html>
                  <html class="h-full">
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <script src="https://cdn.tailwindcss.com"></script>
                      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
                      <style>body { margin:0; padding:0; overflow-x:hidden; }</style>
                    </head>
                    <body>${generatedCode || '<div class="flex items-center justify-center h-screen bg-white text-gray-300 font-black text-[10px] uppercase tracking-[0.4em]">Engine Ready</div>'}</body>
                  </html>
                `}
                className="w-full h-full border-none"
              />
            ) : (
              <div className="bg-[#0a0a0a] h-full p-6 overflow-auto text-blue-400 font-mono text-xs">
                <pre><code>{generatedCode}</code></pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}