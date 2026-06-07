'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, ArrowRight, ArrowLeft, Check, Link, Loader2, Building2, Target, User, Zap } from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Willkommen', icon: Brain },
  { id: 2, title: 'Über dich', icon: User },
  { id: 3, title: 'Dein Unternehmen', icon: Building2 },
  { id: 4, title: 'Deine Ziele', icon: Target },
  { id: 5, title: 'Integrationen', icon: Link },
]

interface Profile {
  founderName: string
  companyName: string
  companyDescription: string
  targetCustomers: string
  offers: string
  currentRevenue: string
  currentCustomers: string
  acquisitionChannels: string
  biggestGoal: string
  biggestChallenge: string
  workingHoursPerDay: number
}

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [linkedinConnected, setLinkedinConnected] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    founderName: '',
    companyName: '',
    companyDescription: '',
    targetCustomers: '',
    offers: '',
    currentRevenue: '',
    currentCustomers: '',
    acquisitionChannels: '',
    biggestGoal: '',
    biggestChallenge: '',
    workingHoursPerDay: 8,
  })

  // Check if already connected (from OAuth redirects)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('google') === 'connected') setGoogleConnected(true)
    if (params.get('linkedin') === 'connected') setLinkedinConnected(true)

    // Check token status
    fetch('/api/integrations/status').then(r => r.json()).then(data => {
      const hasGoogle = data.tokens?.some((t: { provider: string }) => t.provider === 'google')
      const hasLinkedin = data.tokens?.some((t: { provider: string }) => t.provider === 'linkedin')
      if (hasGoogle) setGoogleConnected(true)
      if (hasLinkedin) setLinkedinConnected(true)
    }).catch(() => {})
  }, [])

  function update(field: keyof Profile, value: string | number) {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  async function finish() {
    setSaving(true)
    try {
      await fetch('/api/setup/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      })
      router.push('/')
    } catch (err) {
      console.error(err)
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: '#161921',
    border: '1px solid #1e2130',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#f1f5f9',
    fontSize: '14px',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#94a3b8',
    marginBottom: '8px',
  }

  const canProceed = () => {
    if (step === 2) return profile.founderName.trim() && profile.companyName.trim()
    if (step === 3) return profile.companyDescription.trim() && profile.targetCustomers.trim() && profile.offers.trim()
    if (step === 4) return profile.biggestGoal.trim() && profile.biggestChallenge.trim()
    return true
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0b0f' }}>
      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg" style={{ background: '#f59e0b', color: '#0a0b0f' }}>F</div>
            <div>
              <div className="font-black tracking-wider" style={{ color: '#f1f5f9', fontSize: '20px' }}>FRANK OS</div>
              <div className="text-xs tracking-widest" style={{ color: '#64748b' }}>FOUNDER OPERATING SYSTEM</div>
            </div>
          </div>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: step > s.id ? '#22c55e' : step === s.id ? '#f59e0b' : '#1e2130',
                  color: step >= s.id ? '#0a0b0f' : '#475569',
                }}
              >
                {step > s.id ? <Check size={14} /> : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-8 h-0.5" style={{ background: step > s.id ? '#22c55e' : '#1e2130' }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl" style={{ background: '#111318', border: '1px solid #1e2130' }}>

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: '#f59e0b20', border: '2px solid #f59e0b40' }}>
                <Brain size={36} style={{ color: '#f59e0b' }} />
              </div>
              <h1 className="text-2xl font-bold mb-3" style={{ color: '#f1f5f9' }}>Hallo, ich bin FRANK.</h1>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#94a3b8' }}>
                Dein digitaler COO. Ich analysiere dein Unternehmen, erkenne Engpässe, identifiziere Chancen und sage dir jeden Tag, was die wichtigste Aufgabe ist.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: '🎯', text: 'Erkenne was wirklich wichtig ist' },
                  { icon: '🚧', text: 'Identifiziere Engpässe sofort' },
                  { icon: '🚀', text: 'Nutze Chancen strategisch' },
                ].map(item => (
                  <div key={item.text} className="p-4 rounded-xl text-sm" style={{ background: '#161921', color: '#64748b' }}>
                    <div className="text-2xl mb-2">{item.icon}</div>
                    {item.text}
                  </div>
                ))}
              </div>
              <p className="text-sm" style={{ color: '#475569' }}>
                Ich stelle dir jetzt ein paar Fragen, damit ich dein Unternehmen wirklich verstehe.
              </p>
            </div>
          )}

          {/* Step 2: About you */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Wer bist du?</h2>
              <p className="text-sm mb-6" style={{ color: '#64748b' }}>Damit Frank dich und dein Unternehmen kennt.</p>
              <div className="space-y-4">
                <div>
                  <label style={labelStyle}>Dein Name *</label>
                  <input
                    style={inputStyle}
                    placeholder="z.B. Felix Okun"
                    value={profile.founderName}
                    onChange={e => update('founderName', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Name deines Unternehmens *</label>
                  <input
                    style={inputStyle}
                    placeholder="z.B. OKUN Systems"
                    value={profile.companyName}
                    onChange={e => update('companyName', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Deine Rolle</label>
                  <input
                    style={inputStyle}
                    placeholder="z.B. Founder & CEO"
                    defaultValue="Founder & CEO"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Wie viele Stunden arbeitest du typischerweise pro Tag?</label>
                  <div className="flex gap-2 flex-wrap">
                    {[4, 6, 8, 10, 12].map(h => (
                      <button
                        key={h}
                        onClick={() => update('workingHoursPerDay', h)}
                        className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: profile.workingHoursPerDay === h ? '#f59e0b' : '#161921',
                          color: profile.workingHoursPerDay === h ? '#0a0b0f' : '#94a3b8',
                          border: `1px solid ${profile.workingHoursPerDay === h ? '#f59e0b' : '#1e2130'}`,
                        }}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Company */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Dein Unternehmen</h2>
              <p className="text-sm mb-6" style={{ color: '#64748b' }}>Je mehr Frank weiß, desto präziser seine Empfehlungen.</p>
              <div className="space-y-4">
                <div>
                  <label style={labelStyle}>Was macht dein Unternehmen genau? *</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    placeholder="z.B. Wir entwickeln individuelle Unternehmenssysteme zur Prozessoptimierung und Automatisierung für KMUs."
                    value={profile.companyDescription}
                    onChange={e => update('companyDescription', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Wer sind deine Zielkunden? *</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
                    placeholder="z.B. Hausverwaltungen, Pflegedienste, Personaldienstleister, Versicherungsvermittler, Agenturen"
                    value={profile.targetCustomers}
                    onChange={e => update('targetCustomers', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Was sind deine Angebote / Preise? *</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
                    placeholder="z.B. Kleines Paket: 7.500€, Großes Paket: 15.000€, Retainer: monatlich"
                    value={profile.offers}
                    onChange={e => update('offers', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>Aktueller Umsatz (ca.)</label>
                    <input
                      style={inputStyle}
                      placeholder="z.B. 8.000€/Monat"
                      value={profile.currentRevenue}
                      onChange={e => update('currentRevenue', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Aktive Kunden (ca.)</label>
                    <input
                      style={inputStyle}
                      placeholder="z.B. 5 Kunden"
                      value={profile.currentCustomers}
                      onChange={e => update('currentCustomers', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Welche Kanäle nutzt du für Kundengewinnung?</label>
                  <input
                    style={inputStyle}
                    placeholder="z.B. LinkedIn Outreach (DealSky), E-Mail-Outreach, Empfehlungen"
                    value={profile.acquisitionChannels}
                    onChange={e => update('acquisitionChannels', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Deine Ziele & Herausforderungen</h2>
              <p className="text-sm mb-6" style={{ color: '#64748b' }}>Frank priorisiert danach jeden Tag deine Aufgaben.</p>
              <div className="space-y-4">
                <div>
                  <label style={labelStyle}>Was ist dein wichtigstes Ziel für die nächsten 3-6 Monate? *</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    placeholder="z.B. 10 qualifizierte Termine pro Woche erreichen und 3 neue Kunden pro Monat gewinnen."
                    value={profile.biggestGoal}
                    onChange={e => update('biggestGoal', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Was ist aktuell dein größtes Problem / Nadelöhr? *</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    placeholder="z.B. Zu wenig qualifizierte Termine. Die Antwortquote im Outreach ist zu niedrig."
                    value={profile.biggestChallenge}
                    onChange={e => update('biggestChallenge', e.target.value)}
                  />
                </div>
                <div className="p-4 rounded-xl" style={{ background: '#f59e0b10', border: '1px solid #f59e0b30' }}>
                  <div className="flex items-start gap-3">
                    <Brain size={16} style={{ color: '#f59e0b', marginTop: '2px' }} />
                    <p className="text-sm" style={{ color: '#94a3b8' }}>
                      Frank nutzt diese Informationen um jeden Morgen zu analysieren: Was ist heute das wichtigste, was muss ich tun? Und warum?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Integrations */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Verbinde deine Systeme</h2>
              <p className="text-sm mb-6" style={{ color: '#64748b' }}>Frank liest deine E-Mails, Kalender und LinkedIn — und erkennt was wichtig ist.</p>

              <div className="space-y-3 mb-6">
                {/* Google */}
                <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: '#161921', border: `1px solid ${googleConnected ? '#22c55e40' : '#1e2130'}` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#ffffff10' }}>G</div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: '#f1f5f9' }}>Google (Gmail + Kalender)</p>
                      <p className="text-xs" style={{ color: '#64748b' }}>E-Mails klassifizieren, Termine synchronisieren</p>
                    </div>
                  </div>
                  {googleConnected ? (
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#22c55e' }}>
                      <Check size={14} />
                      <span>Verbunden</span>
                    </div>
                  ) : (
                    <a
                      href="/api/auth/google"
                      className="px-4 py-2 rounded-xl text-sm font-medium"
                      style={{ background: '#3b82f6', color: '#fff' }}
                    >
                      Verbinden
                    </a>
                  )}
                </div>

                {/* LinkedIn */}
                <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: '#161921', border: `1px solid ${linkedinConnected ? '#22c55e40' : '#1e2130'}` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#0077b515' }}>in</div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: '#f1f5f9' }}>LinkedIn</p>
                      <p className="text-xs" style={{ color: '#64748b' }}>Posts, Metriken und Outreach-Daten</p>
                    </div>
                  </div>
                  {linkedinConnected ? (
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#22c55e' }}>
                      <Check size={14} />
                      <span>Verbunden</span>
                    </div>
                  ) : (
                    <a
                      href="/api/auth/linkedin"
                      className="px-4 py-2 rounded-xl text-sm font-medium"
                      style={{ background: '#0077b5', color: '#fff' }}
                    >
                      Verbinden
                    </a>
                  )}
                </div>
              </div>

              <p className="text-xs text-center" style={{ color: '#475569' }}>
                Du kannst Integrationen auch später unter Einstellungen → Integrationen verbinden.
              </p>
            </div>
          )}

        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm"
              style={{ background: '#111318', border: '1px solid #1e2130', color: '#94a3b8' }}
            >
              <ArrowLeft size={14} />
              Zurück
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: canProceed() ? '#f59e0b' : '#1e2130',
                color: canProceed() ? '#0a0b0f' : '#475569',
                cursor: canProceed() ? 'pointer' : 'not-allowed',
              }}
            >
              Weiter
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ background: '#f59e0b', color: '#0a0b0f' }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              {saving ? 'Frank wird vorbereitet...' : 'Frank starten!'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
