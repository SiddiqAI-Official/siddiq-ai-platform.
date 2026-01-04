'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function SiddiqAI() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [previewSize, setPreviewSize] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [messages, setMessages] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const MASTER_KEY = "SiddiqAI@2025";

  useEffect(() => {
    const savedPass = localStorage.getItem('siddiq_access');
    const savedCode = localStorage.getItem('siddiq_code');
    const savedMsgs = localStorage.getItem('siddiq_msgs');
    if (savedPass === MASTER_KEY) setIsAuthorized(true);
    if (savedCode) setGeneratedCode(savedCode);
    if (savedMsgs) setMessages(JSON.parse(savedMsgs));
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleLogin = () => {
    if (passInput.trim() === MASTER_KEY) {
      localStorage.setItem('siddiq_access', MASTER_KEY);
      setIsAuthorized(true);
    } else { alert("Access Denied!"); }
  };

  const generateWebsite = async () => {
    if (!prompt) return;
    setLoading(true);
    const newMsgs = [...messages, { role: 'user', content: prompt }];
    setMessages(newMsgs);

    try {
      const res = await fetch('/api/chat', { 
        method: 'POST', 
        body: JSON.stringify({ messages: newMsgs }), 
        headers: { 'Content-Type': 'application/json' } 
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server Overloaded");

      let html = data.code.replace(/```html|```/g, '').trim();
      setGeneratedCode(html);
      const updatedHistory = [...newMsgs, { role: 'assistant', content: html }];
      setMessages(updatedHistory);
      localStorage.setItem('siddiq_code', html);
      localStorage.setItem('siddiq_msgs', JSON.stringify(updatedHistory));
      setPrompt('');

      // LOAD IMAGES
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const imgs = doc.querySelectorAll('img');
      for (let img of Array.from(imgs)) {
        const alt = img.alt || "luxury branding";
        const imgRes = await fetch('/api/image', { method: 'POST', body: JSON.stringify({ prompt: alt }) });
        const imgData = await imgRes.json();
        if (imgData.url) {
          html = html.split(img.outerHTML).join(img.outerHTML.replace(/src="[^"]*"/, `src="${imgData.url}"`));
          setGeneratedCode(html);
        }
      }
    } catch (err: any) { 
      alert("System Status: " + err.message + ". Try a shorter prompt."); 
    }
    setLoading(false);
  };

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-black flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-gray-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <h1 className="text-3xl font-black text-blue-500 mb-6 italic uppercase">SIDDIQ AI</h1>
          <input type="password" placeholder="ACCESS CODE" className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-600 mb-4 text-white text-center font-bold" value={passInput} onChange={(e) => setPassInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          <button onClick={handleLogin} className="w-full bg-blue-600 p-4 rounded-xl font-bold uppercase text-white">Unlock Engine</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      
      <div className="w-full md:w-96 border-r border-white/10 flex flex-col bg-[#0a0a0a] z-30 shadow-xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h1 className="text-xl font-black text-blue-500 italic uppercase leading-none text-left">SIDDIQ AI <span className="text-[10px] text-gray-600">v15.0 PRO</span></h1>
          <div className="flex gap-4">
             <button onClick={() => {localStorage.clear(); window.location.reload();}} className="text-gray-500 hover:text-red-500"><i className="fas fa-power-off"></i></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.filter(m => m.role === 'user').map((m, i) => (
            <div key={i} className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-xl text-[10px] text-blue-300"><i className="fas fa-comment mr-2"></i> {m.content.substring(0, 100)}...</div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="p-6 border-t border-white/5 space-y-4">
          <textarea className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 outline-none h-32 text-sm text-white transition-all" placeholder="What to build?" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button onClick={generateWebsite} className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-black text-xs tracking-widest disabled:opacity-50 text-white uppercase" disabled={loading}>
            {loading ? 'PROCESSING...' : 'GENERATE GLOBAL TITAN'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#f1f5f9] overflow-hidden p-4 md:p-8">
        <div className="w-full h-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
            {generatedCode ? (
              <iframe srcDoc={`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet"></head><body style="margin:0;">${generatedCode}</body></html>`} className="w-full h-full border-none bg-white" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300 uppercase tracking-widest text-[10px] font-black">Engine v15.0 Ready</div>
            )}
        </div>
      </div>
    </div>
  );
}