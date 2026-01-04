'use client';
import { useState, useEffect } from 'react';

export default function SiddiqAI() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);

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
      // 1. Get HTML from AI
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat API failed");
      
      let finalCode = data.code.replace(/```html|```/g, '').trim();

      // 2. Look for AI_IMAGE Placeholders
      const placeholders = finalCode.match(/AI_IMAGE_[A-Z_]+/g);
      if (placeholders) {
        for (const placeholder of placeholders) {
          const keyword = placeholder.replace('AI_IMAGE_', '').toLowerCase().replace('_', ' ');
          
          try {
            const imgRes = await fetch('/api/image', {
              method: 'POST',
              body: JSON.stringify({ prompt: keyword }),
            });
            const imgData = await imgRes.json();
            if (imgData.url) {
              finalCode = finalCode.split(placeholder).join(imgData.url);
            }
          } catch (e) {
             console.log("Image generation skipped for one placeholder");
          }
        }
      }

      setGeneratedCode(finalCode);
      localStorage.setItem('siddiq_code', finalCode);
      setPrompt(''); 
    } catch (err: any) {
      alert("System Busy: Please try again in a moment.");
    }
    setLoading(false);
  };

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-black flex items-center justify-center p-6 text-white font-sans text-center">
        <div className="w-full max-w-sm bg-gray-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <h1 className="text-3xl font-black text-blue-500 mb-6 italic uppercase">Siddiq AI</h1>
          <input type="password" placeholder="ENTER CODE" className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-600 mb-4 text-white text-center font-bold" value={passInput} onChange={(e) => setPassInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          <button onClick={handleLogin} className="w-full bg-blue-600 p-4 rounded-xl font-bold uppercase">Unlock Portal</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      <div className="w-full md:w-96 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-[#0a0a0a] z-30 shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-black text-blue-500 italic leading-none">SIDDIQ AI</h1>
          <button onClick={() => {localStorage.clear(); window.location.reload();}} className="text-gray-600 hover:text-red-500"><i className="fas fa-power-off"></i></button>
        </div>
        <textarea className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 outline-none h-48 text-sm text-white transition-all mb-4" placeholder="Describe your vision..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button onClick={generateWebsite} className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-black text-xs tracking-widest disabled:opacity-50" disabled={loading}>
          {loading ? 'PROCESSING AI IMAGES...' : 'GENERATE DESIGN'}
        </button>
      </div>

      <div className="flex-1 flex flex-col bg-[#f1f5f9] overflow-hidden p-4 md:p-12">
        <div className="w-full h-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
          {generatedCode ? (
            <iframe srcDoc={`<!DOCTYPE html><html><head><meta charset="UTF-8"><script src="https://cdn.tailwindcss.com"></script></head><body style="margin:0;">${generatedCode}</body></html>`} className="w-full h-full border-none" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-300 uppercase tracking-widest text-xs font-bold text-center p-6">
              <i className="fas fa-wand-sparkles text-4xl mb-4 opacity-20"></i>
              <p>Ready to build with original images</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}