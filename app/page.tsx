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
    } catch (err) {
      alert("System Busy. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      
      {!isAuthorized ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-black">
          <div className="w-full max-w-sm bg-gray-900 p-10 rounded-[2.5rem] border border-white/10 text-center shadow-2xl">
            <h1 className="text-2xl font-black text-blue-500 mb-6 italic uppercase">Siddiq AI Portal</h1>
            <input type="password" placeholder="ENTER CODE" className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-600 mb-4 text-center text-white font-bold" value={passInput} onChange={(e) => setPassInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
            <button onClick={handleLogin} className="w-full bg-blue-600 p-4 rounded-xl font-bold uppercase text-xs">Unlock</button>
          </div>
        </div>
      ) : (
        <>
          {/* Sidebar */}
          <div className="w-full md:w-96 border-r border-white/10 flex flex-col bg-[#0a0a0a] p-6 shadow-xl z-30">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-xl font-black text-blue-500 italic">SIDDIQ AI <span className="text-[10px] text-gray-600">v4.2</span></h1>
              <button onClick={() => {localStorage.clear(); window.location.reload();}} className="text-gray-600 hover:text-red-500"><i className="fas fa-power-off"></i></button>
            </div>
            <textarea className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 outline-none h-48 text-sm text-white transition-all mb-4" placeholder="Describe your vision..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <button onClick={generateWebsite} className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-black text-xs tracking-widest disabled:opacity-50" disabled={loading}>
              {loading ? 'BUILDING CODE...' : 'GENERATE WEBSITE'}
            </button>
            <p className="mt-4 text-[10px] text-gray-600 uppercase tracking-tighter text-center">AI images will load automatically after the code is built.</p>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col bg-[#f1f5f9] overflow-hidden p-4 md:p-10">
            <div className="w-full h-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
              {generatedCode ? (
                <iframe 
                  id="preview-frame"
                  srcDoc={`
                    <!DOCTYPE html><html><head><meta charset="UTF-8"><script src="https://cdn.tailwindcss.com"></script></head><body style="margin:0;">
                    ${generatedCode}
                    <script>
                      // SCRIPT TO FETCH AI IMAGES ONE BY ONE
                      async function loadAIImages() {
                        const images = document.querySelectorAll('img[data-ai-prompt]');
                        for (const img of images) {
                          const prompt = img.getAttribute('data-ai-prompt');
                          try {
                            const res = await fetch('/api/image', {
                              method: 'POST',
                              body: JSON.stringify({ prompt: prompt }),
                              headers: { 'Content-Type': 'application/json' }
                            });
                            const data = await res.json();
                            if (data.url) img.src = data.url;
                          } catch (e) { console.error(e); }
                        }
                      }
                      window.onload = loadAIImages;
                    </script>
                    </body></html>
                  `} 
                  className="w-full h-full border-none" 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 uppercase tracking-widest text-xs font-bold">Waiting for your vision...</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}