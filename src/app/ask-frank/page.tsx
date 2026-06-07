'use client'
import { useState, useEffect, useRef } from 'react'
import { Send, Brain, User, Zap } from 'lucide-react'

const quickPrompts = [
  { label: 'Ich habe heute 4 Stunden', prompt: 'Ich habe heute 4 Stunden verfügbar. Erstelle mir einen optimalen Tagesplan.' },
  { label: 'Wo stehen wir?', prompt: 'Wo steht OKUN Systems aktuell? Was ist unser größtes Problem?' },
  { label: 'Was stoppt uns?', prompt: 'Was ist aktuell unser größtes Nadelöhr und wie beheben wir es?' },
  { label: 'Beste Chance heute', prompt: 'Was ist aktuell die beste Chance die wir nutzen sollten?' },
  { label: 'Mehr Termine', prompt: 'Wie erreichen wir mehr qualifizierte Termine diese Woche?' },
  { label: 'Wochenplan', prompt: 'Erstelle mir einen strategischen Plan für diese Woche.' },
]

interface Message { role: 'user' | 'assistant'; content: string }

export default function AskFrankPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return
    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/frank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.message || 'Fehler beim Abrufen der Antwort.' }])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Verbindungsfehler. Bitte versuche es erneut.' }])
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: '#0a0b0f' }}>

      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: '#1e2130' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#f59e0b20', border: '2px solid #f59e0b40' }}>
            <Brain size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <h1 className="font-bold text-lg" style={{ color: '#f1f5f9' }}>Ask Frank</h1>
            <p className="text-xs" style={{ color: '#64748b' }}>Dein digitaler COO — mit vollem Unternehmenswissen</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#f59e0b15', border: '2px solid #f59e0b30' }}>
              <Brain size={28} style={{ color: '#f59e0b' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Wie kann ich dir helfen?</h2>
            <p className="text-sm mb-8" style={{ color: '#64748b' }}>Ich habe Zugriff auf alle deine Unternehmensdaten, Ziele, KPIs und Strategien.</p>

            {/* Quick prompts */}
            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
              {quickPrompts.map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => sendMessage(qp.prompt)}
                  className="p-3 rounded-xl text-sm text-left transition-all"
                  style={{ background: '#111318', border: '1px solid #1e2130', color: '#94a3b8', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f59e0b40'; (e.currentTarget as HTMLElement).style.color = '#f1f5f9' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1e2130'; (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
                >
                  <Zap size={12} style={{ color: '#f59e0b', display: 'inline', marginRight: '6px' }} />
                  {qp.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: '#f59e0b20', border: '1px solid #f59e0b40' }}>
                <Brain size={14} style={{ color: '#f59e0b' }} />
              </div>
            )}
            <div
              className="max-w-2xl p-4 rounded-2xl text-sm leading-relaxed"
              style={msg.role === 'user'
                ? { background: '#f59e0b15', border: '1px solid #f59e0b30', color: '#f1f5f9' }
                : { background: '#111318', border: '1px solid #1e2130', color: '#e2e8f0' }
              }
            >
              {msg.content.split('\n').map((line, j) => (
                <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>
              ))}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: '#1e2130' }}>
                <User size={14} style={{ color: '#94a3b8' }} />
              </div>
            )}
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: '#f59e0b20', border: '1px solid #f59e0b40' }}>
              <Brain size={14} style={{ color: '#f59e0b' }} />
            </div>
            <div className="p-4 rounded-2xl" style={{ background: '#111318', border: '1px solid #1e2130' }}>
              <div className="flex gap-1">
                {[0, 150, 300].map(delay => (
                  <div key={delay} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#f59e0b', animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t" style={{ borderColor: '#1e2130' }}>
        <div className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
            placeholder="Frank, was ist heute meine wichtigste Aufgabe?"
            className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: '#111318', border: '1px solid #1e2130', color: '#f1f5f9' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
            style={{ background: input.trim() && !loading ? '#f59e0b' : '#1e2130', color: input.trim() && !loading ? '#0a0b0f' : '#475569', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed' }}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs mt-2 text-center" style={{ color: '#475569' }}>Frank hat Zugriff auf deine KPIs, Ziele, Engpässe und Strategien</p>
      </div>
    </div>
  )
}
