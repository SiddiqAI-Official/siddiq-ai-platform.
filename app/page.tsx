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
    } else {
      alert("Wrong Access Code!");
    }
  };

  const startNewProject = () => {
    if(confirm("Start new project? Current data will be cleared.")) {
      setGeneratedCode('');
      setMessages([]);
      localStorage.removeItem('siddiq_code');
      localStorage.removeItem('siddiq_msgs');
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
      const newHistory = [...historyWithUser, { role: 'assistant', content: cleanCode }];
      setMessages(newHistory);
      localStorage.setItem('siddiq_code', cleanCode);
      localStorage.setItem('siddiq_msgs', JSON.stringify(newHistory));
      setPrompt(''); 
      setView('preview');
    } catch (err) {
      alert("AI Error!");
    }
    setLoading(false);
  };

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-sans">
        <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <h1 className="text-3xl font-black text-blue-500 mb-6 italic">SIDDIQ AI</h1>
          <input 
            type="password" 
            placeholder="ACCESS CODE" 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-600 mb-4 text-center font-bold tracking-widest text-white"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full bg-blue-600 p-4 rounded-2xl font-bold uppercase tracking-widest">Unlock</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      
      {/* Sidebar */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-[#0a0a0a] z-30 shadow-xl">
        <div className="p-4 md:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-blue-500 italic leading-none">SIDDIQ AI</h1>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">v2.0 Final Stable</p>
          </div>
          <div className="flex gap-2">
            <button onClick={startNewProject} className="p-2 text-gray-500 hover:text-blue-400"><i className="fas fa-plus-circle"></i></button>
            <button onClick={() => {localStorage.removeItem('siddiq_access'); setIsAuthorized(false);}} className="p-2 text-gray-500 hover:text-red-500"><i className="fas fa-power-off"></i></button>
          </div>
        </div>
        
        <div className="p-4 md:p-6 flex-1 flex flex-col gap-4">
          <textarea 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 outline-none h-20 md:h-64 text-sm text-white transition-all"
            placeholder="Build your vision..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={generateWebsite}
            className="w-full bg-blue-600 hover:bg-blue-500 p-3 md:p-4 rounded-xl font-bold shadow-lg disabled:opacity-50 text-xs"
            disabled={loading}
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'UPDATE DESIGN'}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col bg-[#f1f5f9] overflow-hidden">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 shadow-sm">
          <div className="flex gap-6">
            <button onClick={() => setView('preview')} className={`text-[10px] font-black uppercase tracking-widest ${view === 'preview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}>Canvas</button>
            <button onClick={() => setView('code')} className={`text-[10px] font-black uppercase tracking-widest ${view === 'code' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}>Code</button>
          </div>

          {/* Fixed Device Switcher */}
          <div className="hidden md:flex bg-gray-100 p-1 rounded-xl gap-1 border border-gray-200">
            <button onClick={() => setPreviewSize('desktop')} className={`px-4 py-1 rounded-lg text-xs ${previewSize === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}><i className="fas fa-desktop"></i></button>
            <button onClick={() => setPreviewSize('tablet')} className={`px-4 py-1 rounded-lg text-xs ${previewSize === 'tablet' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}><i className="fas fa-tablet"></i></button>
            <button onClick={() => setPreviewSize('mobile')} className={`px-4 py-1 rounded-lg text-xs ${previewSize === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}><i className="fas fa-mobile-alt"></i></button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex justify-center items-start md:p-8 p-2">
          <div 
            className={`transition-all duration-500 shadow-2xl bg-white overflow-hidden md:rounded-3xl rounded-xl border border-gray-300 mx-auto ${
              previewSize === 'desktop' ? 'w-full h-full' : 
              previewSize === 'tablet' ? 'w-[768px] h-full' : 
              'w-[375px] h-[667px]'
            }`}
          >
            {view === 'preview' ? (
              <iframe 
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <script src="https://cdn.tailwindcss.com"></script>
                      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet">
                      <style>body{margin:0;padding:0;overflow-x:hidden;}</style>
                    </head>
                    <body>${generatedCode || '<div class="flex items-center justify-center h-screen text-gray-300 font-black text-[10px] uppercase tracking-[0.4em]">Engine Ready</div>'}</body>
                  </html>
                `}
                className="w-full h-full border-none"
              />
            ) : (
              <div className="bg-[#0a0a0a] h-full p-6 overflow-auto text-blue-400 font-mono text-xs"><pre><code>{generatedCode}</code></pre></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}