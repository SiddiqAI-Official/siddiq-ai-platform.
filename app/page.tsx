'use client';
import { useState } from 'react';

export default function SiddiqAI() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'preview' | 'code'>('preview');
  
  // Memory/History ko store karne ke liye array
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);

  const generateWebsite = async () => {
    if (!prompt) return;
    setLoading(true);

    // User ka naya message history mein add karen
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
      // AI ka response bhi history mein add karen taake agli baar kaam aaye
      setMessages([...historyWithUser, { role: 'assistant', content: cleanCode }]);
      
      setPrompt(''); // Type karne wali jagah khali kar den
      setView('preview');
    } catch (err) {
      alert("Siddiq AI connection error!");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden font-sans">
      {/* Sidebar - LEFT */}
      <div className="w-80 border-r border-gray-800 p-6 flex flex-col bg-gray-900 shadow-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-blue-500 italic tracking-tighter">SIDDIQ AI</h1>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Dubai Intelligence v1.1</p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-2 uppercase">Your Instruction</label>
          <textarea 
            className="w-full p-4 bg-black border border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none h-48 text-sm transition-all resize-none shadow-inner"
            placeholder="e.g. Change the background to dark blue..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={generateWebsite}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Siddiq AI is Engineering...' : 'Update Website'}
          </button>
        </div>

        <div className="mt-auto p-4 bg-gray-800/50 rounded-xl border border-gray-700">
           <p className="text-[10px] text-gray-400 leading-relaxed">
             Siddiq AI is learning from your style. Every update makes the platform smarter.
           </p>
        </div>
      </div>

      {/* Main Preview - RIGHT */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="h-14 bg-gray-100 border-b border-gray-300 flex items-center justify-between px-6">
          <div className="flex gap-6">
            <button 
              onClick={() => setView('preview')} 
              className={`text-sm font-bold transition-all ${view === 'preview' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Live Canvas
            </button>
            <button 
              onClick={() => setView('code')} 
              className={`text-sm font-bold transition-all ${view === 'code' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Source Code
            </button>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>

        <div className="flex-1 relative">
          {view === 'preview' ? (
            <iframe 
              srcDoc={`
                <!DOCTYPE html>
                <html class="scroll-smooth">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
                  </head>
                  <body class="antialiased">${generatedCode || `
                    <div class="flex flex-col items-center justify-center h-screen bg-gray-50">
                      <div class="text-6xl mb-4">🚀</div>
                      <h2 class="text-2xl font-bold text-gray-800">Siddiq AI Ready</h2>
                      <p class="text-gray-500 italic">Describe your vision and click "Update Website"</p>
                    </div>
                  `}</body>
                </html>
              `}
              className="w-full h-full border-none"
            />
          ) : (
            <div className="bg-[#1e1e1e] h-full p-8 overflow-auto">
              <pre className="text-blue-300 font-mono text-sm leading-relaxed">
                <code>{generatedCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}