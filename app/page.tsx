'use client';
import { useState, useEffect } from 'react';

export default function SiddiqAI() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const MASTER_KEY = "SiddiqAI@2025";

  useEffect(() => {
    const savedPass = localStorage.getItem('siddiq_access');
    if (savedPass === MASTER_KEY) setIsAuthorized(true);
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
    const newMsgs = [...messages, { role: 'user', content: prompt }];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: newMsgs }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      let finalCode = data.code.replace(/```html|```/g, '').trim();

      // MAGIC: Finding Placeholders and generating REAL AI Images
      const placeholders = finalCode.match(/AI_IMAGE_[A-Z]+/g);
      if (placeholders) {
        for (const placeholder of placeholders) {
          const keyword = placeholder.replace('AI_IMAGE_', '').toLowerCase();
          const imgRes = await fetch('/api/image', {
            method: 'POST',
            body: JSON.stringify({ prompt: keyword }),
          });
          const imgData = await imgRes.json();
          finalCode = finalCode.replace(placeholder, imgData.url);
        }
      }

      setGeneratedCode(finalCode);
      setMessages([...newMsgs, { role: 'assistant', content: finalCode }]);
      setPrompt(''); 
    } catch (err) { alert("AI Build Error!"); }
    setLoading(false);
  };

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-black flex items-center justify-center p-6 text-white font-sans text-center">
        <div className="w-full max-w-sm bg-gray-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <h1 className="text-3xl font-black text-blue-500 mb-6 italic tracking-tighter">SIDDIQ AI 4.0</h1>
          <input type="password" placeholder="ACCESS CODE" className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-600 mb-4 text-white text-center font-bold" value={passInput} onChange={(e) => setPassInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          <button onClick={handleLogin} className="w-full bg-blue-600 p-4 rounded-xl font-bold uppercase">Unlock Portal</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      
      {/* Sidebar */}
      <div className="w-full md:w-96 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-[#0a0a0a] z-30 shadow-xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h1 className="text-xl font-black text-blue-500 italic">SIDDIQ AI <span className="text-[10px] text-gray-500 ml-2">v4.0</span></h1>
          <button onClick={() => {localStorage.clear(); window.location.reload();}} className="text-gray-500 hover:text-red-500"><i className="fas fa-power-off"></i></button>
        </div>
        
        <div className="p-6 flex-1 flex flex-col gap-6">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Design Instruction</label>
            <textarea className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 outline-none h-48 text-sm text-white transition-all" placeholder="E.g. Create a luxury car rental page..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>
          <button onClick={generateWebsite} className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-black text-xs tracking-[0.2em] shadow-lg disabled:opacity-50" disabled={loading}>
            {loading ? <i className="fas fa-magic animate-spin mr-2"></i> : 'GENERATE WITH AI IMAGES'}
          </button>
          <p className="text-[10px] text-gray-600 text-center uppercase tracking-widest">Powered by DALL-E 3 Technology</p>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col bg-[#f1f5f9] overflow-hidden">
        <div className="flex-1 overflow-auto p-4 md:p-12">
          <div className="w-full h-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
            {generatedCode ? (
              <iframe srcDoc={`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet"><style>body{margin:0;padding:0;overflow-x:hidden;font-family:sans-serif;}</style></head><body>${generatedCode}</body></html>`} className="w-full h-full border-none" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-10">
                 <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mb-6">
                    <i className="fas fa-wand-sparkles text-3xl text-blue-600"></i>
                 </div>
                 <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter italic">Ready to Create</h2>
                 <p className="text-gray-500 max-w-xs text-sm">Describe your vision and I will generate the code and original AI images for you.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}