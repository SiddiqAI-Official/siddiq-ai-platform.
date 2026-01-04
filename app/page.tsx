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
    } catch (err) { alert("System busy, please try again."); }
    setLoading(false);
  };

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-black flex items-center justify-center p-6 text-white font-sans text-center">
        <div className="w-full max-w-sm bg-gray-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <h1 className="text-3xl font-black text-blue-500 mb-6 italic uppercase">Siddiq AI</h1>
          <input type="password" placeholder="ACCESS CODE" className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-600 mb-4 text-white text-center font-bold" value={passInput} onChange={(e) => setPassInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          <button onClick={handleLogin} className="w-full bg-blue-600 p-4 rounded-xl font-bold uppercase">Unlock</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      
      <div className="w-full md:w-96 border-r border-white/10 flex flex-col bg-[#0a0a0a] p-6 shadow-xl z-30">
        <h1 className="text-xl font-black text-blue-500 mb-8 italic uppercase leading-none">Siddiq AI <span className="text-[10px] text-gray-600">v7.0 PRO</span></h1>
        <textarea className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 outline-none h-48 text-sm text-white transition-all mb-4" placeholder="Describe your vision..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button onClick={generateWebsite} className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-black text-xs tracking-widest disabled:opacity-50" disabled={loading}>
          {loading ? 'BUILDING DESIGN...' : 'GENERATE WITH DALL-E 3'}
        </button>
      </div>

      <div className="flex-1 flex flex-col bg-[#f1f5f9] overflow-hidden p-4 md:p-10">
        <div className="w-full h-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
          {generatedCode ? (
            <iframe 
              srcDoc={`
                <!DOCTYPE html><html><head><meta charset="UTF-8"><script src="https://cdn.tailwindcss.com"></script></head><body style="margin:0;">
                ${generatedCode}
                <script>
                  async function loadImages() {
                    const imgs = document.querySelectorAll('img');
                    for (const img of imgs) {
                      const altText = img.alt || "luxury property";
                      img.src = "https://placehold.co/800x600?text=Generating+with+DALL-E+3...";
                      try {
                        const res = await fetch('/api/image', {
                          method: 'POST',
                          body: JSON.stringify({ prompt: altText }),
                          headers: { 'Content-Type': 'application/json' }
                        });
                        const data = await res.json();
                        if (data.url) img.src = data.url;
                      } catch (e) { console.error(e); }
                    }
                  }
                  window.onload = loadImages;
                </script>
                </body></html>
              `} 
              className="w-full h-full border-none" 
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 uppercase tracking-widest text-[10px] font-black">Engine Ready</div>
          )}
        </div>
      </div>
    </div>
  );
}