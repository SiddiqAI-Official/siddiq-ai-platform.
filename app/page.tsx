'use client';
import { useState } from 'react';

export default function SiddiqAI() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);

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

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <div className="w-80 border-r border-white/10 p-6 flex flex-col bg-[#0a0a0a]">
        <div className="mb-10">
          <h1 className="text-2xl font-black tracking-tighter text-blue-500 italic">SIDDIQ AI</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">Global Intelligence v1.3</p>
        </div>
        
        <div className="flex-1 space-y-4">
          <textarea 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 outline-none h-48 text-sm transition-all resize-none"
            placeholder="What should I build?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={generateWebsite}
            className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Building...' : 'Update Website'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white text-black">
        <div className="h-14 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex gap-8">
            <button onClick={() => setView('preview')} className={`text-xs font-bold uppercase tracking-widest ${view === 'preview' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Preview</button>
            <button onClick={() => setView('code')} className={`text-xs font-bold uppercase tracking-widest ${view === 'code' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Code</button>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ai.globalsiddiq.com</div>
        </div>

        <div className="flex-1 bg-gray-100 relative">
          {view === 'preview' ? (
            <iframe 
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
                  </head>
                  <body>${generatedCode || '<div class="flex items-center justify-center h-screen text-gray-400 italic">Ready for your prompt...</div>'}</body>
                </html>
              `}
              className="w-full h-full border-none shadow-2xl bg-white"
            />
          ) : (
            <div className="bg-[#0a0a0a] h-full p-10 overflow-auto">
              <pre className="text-blue-400 font-mono text-sm"><code>{generatedCode}</code></pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}