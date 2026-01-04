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

  // Constant Access Code (Matches your Environment Variable)
  const ACCESS_CODE = "SiddiqAI2025";

  useEffect(() => {
    const savedPass = localStorage.getItem('siddiq_access');
    if (savedPass === ACCESS_CODE) setIsAuthorized(true);
  }, []);

  const handleLogin = () => {
    if (passInput.trim() === ACCESS_CODE) {
      localStorage.setItem('siddiq_access', ACCESS_CODE);
      setIsAuthorized(true);
    } else {
      alert("Incorrect Access Code!");
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
      alert("AI Build Failed!");
    }
    setLoading(false);
  };

  // 1. LOGIN SCREEN (SECURE PORTAL)
  if (!isAuthorized) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center p-6 font-sans">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/30">
             <i className="fas fa-shield-halved text-2xl text-white"></i>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 italic">SIDDIQ AI</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-10">Restricted Access</p>
          
          <input 
            type="password" 
            placeholder="ENTER CODE" 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-600 transition-all text-center mb-4 text-white placeholder:text-gray-600 font-bold tracking-widest"
            style={{ color: 'white' }} // Explicitly setting text color to white
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full bg-blue-600 p-4 rounded-2xl font-bold hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20 text-white">UNLOCK PLATFORM</button>
        </div>
      </div>
    );
  }

  // 2. MAIN APP SCREEN (BUILDER)
  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      
      {/* Sidebar - Build Controls */}
      <div className="w-80 border-r border-white/10 p-6 flex flex-col bg-[#0a0a0a]">
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-blue-500 italic leading-none">SIDDIQ AI</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">Global v1.5 Stable</p>
          </div>
          <button onClick={() => {localStorage.removeItem('siddiq_access'); setIsAuthorized(false);}} title="Logout" className="text-gray-600 hover:text-red-500 transition-all p-2">
            <i className="fas fa-power-off text-sm"></i>
          </button>
        </div>
        
        <div className="flex-1 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Build Instruction</label>
            <textarea 
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-600 outline-none h-56 text-sm transition-all resize-none text-white shadow-inner"
              placeholder="E.g. Create a professional Dubai Realtor page..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <button 
            onClick={generateWebsite}
            className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 text-white"
            disabled={loading}
          >
            {loading ? <i className="fas fa-circle-notch animate-spin"></i> : 'Update Project'}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col bg-[#f1f5f9]">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex gap-8">
            <button onClick={() => setView('preview')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${view === 'preview' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Canvas</button>
            <button onClick={() => setView('code')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${view === 'code' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Code</button>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl gap-1 border border-gray-200">
            <button onClick={() => setPreviewSize('desktop')} title="Desktop View" className={`px-4 py-1.5 rounded-lg text-xs transition-all ${previewSize === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><i className="fas fa-desktop"></i></button>
            <button onClick={() => setPreviewSize('tablet')} title="Tablet View" className={`px-4 py-1.5 rounded-lg text-xs transition-all ${previewSize === 'tablet' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><i className="fas fa-tablet"></i></button>
            <button onClick={() => setPreviewSize('mobile')} title="Mobile View" className={`px-4 py-1.5 rounded-lg text-xs transition-all ${previewSize === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><i className="fas fa-mobile-alt"></i></button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex justify-center p-8">
          <div className={`transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white overflow-hidden rounded-3xl border border-gray-300 ${
            previewSize === 'desktop' ? 'w-full h-full' : 
            previewSize === 'tablet' ? 'w-[768px] h-full' : 
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
                      <style>
                        ::-webkit-scrollbar { width: 4px; }
                        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                        body { margin: 0; padding: 0; }
                      </style>
                    </head>
                    <body>${generatedCode || '<div class="flex items-center justify-center h-screen bg-white text-gray-300 font-black text-xs uppercase tracking-[0.4em]">Engine Ready</div>'}</body>
                  </html>
                `}
                className="w-full h-full border-none"
              />
            ) : (
              <div className="bg-[#0a0a0a] h-full p-10 overflow-auto">
                <pre className="text-blue-400 font-mono text-sm leading-relaxed"><code>{generatedCode}</code></pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}