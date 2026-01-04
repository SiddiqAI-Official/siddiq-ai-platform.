'use client';
import { useState } from 'react';

export default function SiddiqAI() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);

  // Naya Project shuru karne ke liye function
  const startNewChat = () => {
    setMessages([]);
    setGeneratedCode('');
    setPrompt('');
    alert("New Project Started!");
  };

  // Website Download karne ke liye function
  const downloadWebsite = () => {
    const element = document.createElement("a");
    const file = new Blob([`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        </head>
        <body>${generatedCode}</body>
      </html>
    `], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = "siddiq-ai-website.html";
    document.body.appendChild(element);
    element.click();
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
      alert("Error!");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-85 border-r border-gray-800 p-6 flex flex-col bg-gray-900 shadow-2xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-blue-500 italic">SIDDIQ AI</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Dubai Intelligence v1.2</p>
          </div>
          <button onClick={startNewChat} title="New Project" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all text-blue-400">
             <i className="fas fa-plus"></i>
          </button>
        </div>
        
        <div className="flex-1">
          <textarea 
            className="w-full p-4 bg-black border border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none h-48 text-sm resize-none shadow-inner"
            placeholder="e.g. Create a luxury villa landing page..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={generateWebsite}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl font-bold shadow-lg disabled:opacity-50 transition-all"
            disabled={loading}
          >
            {loading ? 'Siddiq AI is Engineering...' : 'Update Website'}
          </button>
        </div>

        {generatedCode && (
          <button 
            onClick={downloadWebsite}
            className="mt-4 border border-blue-600 text-blue-400 p-3 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all text-sm"
          >
            <i className="fas fa-download mr-2"></i> Download HTML File
          </button>
        )}
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="h-14 bg-gray-100 border-b border-gray-300 flex items-center justify-between px-6">
          <div className="flex gap-6">
            <button onClick={() => setView('preview')} className={`text-sm font-bold ${view === 'preview' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Live Canvas</button>
            <button onClick={() => setView('code')} className={`text-sm font-bold ${view === 'code' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400'}`}>Source Code</button>
          </div>
        </div>

        <div className="flex-1 relative">
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
                  <body class="antialiased">${generatedCode || `<div class="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-500">
                    <h2 class="text-xl font-bold">Welcome Back, Siddiq Bhai!</h2>
                    <p class="italic">What are we building today?</p>
                  </div>`}</body>
                </html>
              `}
              className="w-full h-full border-none"
            />
          ) : (
            <div className="bg-[#1e1e1e] h-full p-8 overflow-auto text-blue-300 text-sm font-mono">
              <pre><code>{generatedCode}</code></pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}