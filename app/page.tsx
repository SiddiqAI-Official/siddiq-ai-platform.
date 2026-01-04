'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function SiddiqAI() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewSize, setPreviewSize] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [messages, setMessages] = useState<any[]>([]);

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
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: prompt }] }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      let html = data.code.replace(/```html|```/g, '').trim();
      
      setGeneratedCode(html);
      setMessages([...messages, { role: 'user', content: prompt }, { role: 'assistant', content: html }]);
      
      // STEP 2: LOAD IMAGES MANUALLY (The Fix)
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const imgs = doc.querySelectorAll('img');
      
      for (let img of Array.from(imgs)) {
        const alt = img.alt || "luxury property";
        const imgRes = await fetch('/api/image', {
          method: 'POST',
          body: JSON.stringify({ prompt: alt }),
        });
        const imgData = await imgRes.json();
        if (imgData.url) {
          html = html.split(img.outerHTML).join(img.outerHTML.replace('src=""', `src="${imgData.url}"`).replace(/src="[^"]*"/, `src="${imgData.url}"`));
          setGeneratedCode(html); // Update UI for each image
          localStorage.setItem('siddiq_code', html);
        }
      }
      setPrompt('');
    } catch (err) { alert("AI Error! Check OpenAI Balance."); }
    setLoading(false);
  };

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-black flex items-center justify-center p-6 text-white text-center">
        <div className="w-full max-w-sm bg-gray-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <h1 className="text-3xl font-black text-blue-500 mb-6 italic uppercase">Siddiq AI 10.0</h1>
          <input type="password" placeholder="ACCESS CODE" className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-600 mb-4 text-white text-center font-bold tracking-[0.5em]" value={passInput} onChange={(e) => setPassInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          <button onClick={handleLogin} className="w-full bg-blue-600 p-4 rounded-xl font-bold uppercase tracking-widest text-sm">Unlock</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      
      {/* Sidebar */}
      <div className="w-full md:w-96 border-r border-white/10 flex flex-col bg-[#0a0a0a] z-30 shadow-xl p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-black text-blue-500 italic">SIDDIQ AI <span className="text-[10px] text-gray-600 uppercase">v10.0 Master</span></h1>
          <button onClick={() => {localStorage.clear(); window.location.reload();}} className="text-gray-600 hover:text-red-500"><i className="fas fa-power-off"></i></button>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {messages.filter(m => m.role === 'user').map((m, i) => (
            <div key={i} className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-xl text-[10px] text-blue-300">
              <i className="fas fa-comment mr-2"></i> {m.content}
            </div>
          ))}
        </div>

        <textarea className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 outline-none h-40 text-sm text-white transition-all mb-4" placeholder="Describe your vision..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button onClick={generateWebsite} className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-black text-xs tracking-widest disabled:opacity-50" disabled={loading}>
          {loading ? 'DALL-E 3 GENERATING...' : 'GENERATE MASTER DESIGN'}
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col bg-[#f1f5f9] overflow-hidden">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-center gap-6 shadow-sm z-20">
          <button onClick={() => setPreviewSize('desktop')} className={`p-2 rounded-lg ${previewSize === 'desktop' ? 'text-blue-600' : 'text-gray-400'}`}><i className="fas fa-desktop"></i></button>
          <button onClick={() => setPreviewSize('tablet')} className={`p-2 rounded-lg ${previewSize === 'tablet' ? 'text-blue-600' : 'text-gray-400'}`}><i className="fas fa-tablet-alt"></i></button>
          <button onClick={() => setPreviewSize('mobile')} className={`p-2 rounded-lg ${previewSize === 'mobile' ? 'text-blue-600' : 'text-gray-400'}`}><i className="fas fa-mobile-alt"></i></button>
        </div>

        <div className="flex-1 overflow-auto flex justify-center items-start md:p-8 p-2 bg-[#e2e8f0]/50">
          <div style={{ width: previewSize === 'desktop' ? '100%' : previewSize === 'tablet' ? '768px' : '375px', height: previewSize === 'desktop' ? '100%' : '667px' }} className="transition-all duration-500 shadow-2xl bg-white overflow-hidden rounded-2xl border border-gray-300 mx-auto">
            <iframe srcDoc={`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet"><style>body{margin:0;padding:0;overflow-x:hidden;font-family:sans-serif;}</style></head><body>${generatedCode || '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#ccc;text-transform:uppercase;letter-spacing:5px;font-size:10px;font-weight:bold;">Siddiq Master Ready</div>'}</body></html>`} className="w-full h-full border-none bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}