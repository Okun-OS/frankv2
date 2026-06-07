'use client'

import Header from '@/components/layout/Header'
import { Settings, User, Bell, Shield, Database, Bot, Save, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const sections = [
  { id: 'profile', label: 'Mein Profil', icon: User },
  { id: 'company', label: 'Unternehmen', icon: Settings },
  { id: 'ai', label: 'FRANK AI', icon: Bot },
  { id: 'data', label: 'Daten', icon: Database },
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

const inputStyle = {
  width: '100%',
  backgroundColor: '#0a0b0f',
  border: '1px solid #1e2130',
  borderRadius: '8px',
  padding: '9px 12px',
  color: '#f1f5f9',
  fontSize: '13px',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: '11px',
  fontWeight: 500,
  display: 'block',
  marginBottom: '6px',
}

export default function SettingsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('profile')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => {
        if (data.profile) setProfile(data.profile)
        else {
          // No profile yet — redirect to setup
          router.push('/setup')
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [router])

  function update(field: keyof Profile, value: string | number) {
    setProfile(prev => prev ? { ...prev, [field]: value } : prev)
  }

  async function save() {
    if (!profile) return
    setSaving(true)
    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      //
    } finally {
      setSaving(false)
    }
  }

  async function restartSetup() {
    setResetting(true)
    try {
      await fetch('/api/setup/reset')
      router.push('/setup')
    } catch {
      setResetting(false)
    }
  }

  return (
    <div>
      <Header title="Einstellungen" subtitle="Profil, Unternehmen und FRANK AI anpassen" />
      <div className="p-6">
        <div className="flex gap-6">

          {/* Sidebar */}
          <div className="w-44 flex-shrink-0">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                      color: isActive ? '#f59e0b' : '#94a3b8',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    <Icon size={13} />
                    {section.label}
                  </button>
                )
              })}

              {/* Reset button at bottom of sidebar */}
              <div style={{ paddingTop: '24px', borderTop: '1px solid #1e2130', marginTop: '16px' }}>
                <button
                  onClick={restartSetup}
                  disabled={resetting}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239,68,68,0.08)',
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.15)',
                    cursor: resetting ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 500,
                    opacity: resetting ? 0.6 : 1,
                  }}
                >
                  {resetting ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                  Setup neu starten
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="card p-8 flex items-center justify-center">
                <Loader2 size={20} className="animate-spin" style={{ color: '#475569' }} />
              </div>
            ) : (
              <>
                {/* Profile Section */}
                {activeSection === 'profile' && profile && (
                  <div className="card p-6 space-y-5">
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 700 }}>Mein Profil</h2>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Dein Name</label>
                        <input style={inputStyle} value={profile.founderName} onChange={e => update('founderName', e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Unternehmensname</label>
                        <input style={inputStyle} value={profile.companyName} onChange={e => update('companyName', e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Arbeitsstunden pro Tag</label>
                      <div className="flex gap-2">
                        {[4, 6, 8, 10, 12].map(h => (
                          <button
                            key={h}
                            onClick={() => update('workingHoursPerDay', h)}
                            style={{
                              padding: '7px 16px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 600,
                              background: profile.workingHoursPerDay === h ? '#f59e0b' : '#111318',
                              color: profile.workingHoursPerDay === h ? '#0a0b0f' : '#64748b',
                              border: `1px solid ${profile.workingHoursPerDay === h ? '#f59e0b' : '#1e2130'}`,
                              cursor: 'pointer',
                            }}
                          >
                            {h}h
                          </button>
                        ))}
                      </div>
                    </div>

                    <SaveBar saving={saving} saved={saved} onSave={save} />
                  </div>
                )}

                {/* Company Section */}
                {activeSection === 'company' && profile && (
                  <div className="card p-6 space-y-5">
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 700 }}>Unternehmen</h2>
                    <p style={{ color: '#64748b', fontSize: '12px', marginTop: '-12px' }}>
                      Diese Daten nutzt Frank für jede Analyse und Empfehlung.
                    </p>

                    <div>
                      <label style={labelStyle}>Was macht dein Unternehmen?</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                        value={profile.companyDescription}
                        onChange={e => update('companyDescription', e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Zielkunden</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
                        value={profile.targetCustomers}
                        onChange={e => update('targetCustomers', e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Angebote / Preise</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
                        value={profile.offers}
                        onChange={e => update('offers', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Aktueller Umsatz</label>
                        <input style={inputStyle} value={profile.currentRevenue ?? ''} onChange={e => update('currentRevenue', e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Aktive Kunden</label>
                        <input style={inputStyle} value={profile.currentCustomers ?? ''} onChange={e => update('currentCustomers', e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Akquisitionskanäle</label>
                      <input style={inputStyle} value={profile.acquisitionChannels} onChange={e => update('acquisitionChannels', e.target.value)} />
                    </div>

                    <div>
                      <label style={labelStyle}>Wichtigstes Ziel (3–6 Monate)</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
                        value={profile.biggestGoal}
                        onChange={e => update('biggestGoal', e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Größtes Problem / Nadelöhr</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
                        value={profile.biggestChallenge}
                        onChange={e => update('biggestChallenge', e.target.value)}
                      />
                    </div>

                    <SaveBar saving={saving} saved={saved} onSave={save} />
                  </div>
                )}

                {/* AI Section */}
                {activeSection === 'ai' && (
                  <div className="card p-6 space-y-4">
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 700 }}>FRANK AI</h2>
                    {[
                      { label: 'Modell', value: 'claude-sonnet-4-6', desc: 'Strategische Analysen & COO-Funktion' },
                      { label: 'Content-Modell', value: 'gpt-4o', desc: 'Kreative Texte, Hooks, Captions' },
                      { label: 'Sprache', value: 'Deutsch', desc: 'Frank kommuniziert immer auf Deutsch' },
                      { label: 'Tonalität', value: 'Direkt & sachlich', desc: 'Wie ein erfahrener COO — kein Motivationscoach' },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid #1e2130' }}>
                        <div>
                          <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 500 }}>{item.label}</p>
                          <p style={{ color: '#475569', fontSize: '11px' }}>{item.desc}</p>
                        </div>
                        <span style={{ background: '#0a0b0f', border: '1px solid #1e2130', borderRadius: '6px', padding: '4px 10px', color: '#94a3b8', fontSize: '11px' }}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Data Section */}
                {activeSection === 'data' && (
                  <div className="card p-6 space-y-4">
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 700 }}>Daten & Reset</h2>

                    <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '12px', padding: '20px' }}>
                      <div className="flex items-start gap-3 mb-4">
                        <AlertTriangle size={16} style={{ color: '#ef4444', marginTop: '2px', flexShrink: 0 }} />
                        <div>
                          <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Onboarding neu starten</p>
                          <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.6 }}>
                            Löscht dein aktuelles Profil und startet den Setup-Wizard neu. Deine KPIs, Ziele und anderen Daten bleiben erhalten.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={restartSetup}
                        disabled={resetting}
                        style={{
                          background: 'rgba(239,68,68,0.15)',
                          color: '#ef4444',
                          border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: resetting ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          opacity: resetting ? 0.6 : 1,
                        }}
                      >
                        {resetting ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                        {resetting ? 'Wird zurückgesetzt...' : 'Setup neu starten'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SaveBar({ saving, saved, onSave }: { saving: boolean; saved: boolean; onSave: () => void }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        onClick={onSave}
        disabled={saving}
        style={{
          background: saved ? '#22c55e' : '#f59e0b',
          color: '#0a0b0f',
          border: 'none',
          borderRadius: '8px',
          padding: '9px 20px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: saving ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
        {saving ? 'Speichert...' : saved ? 'Gespeichert ✓' : 'Speichern'}
      </button>
      {saved && <p style={{ color: '#22c55e', fontSize: '12px' }}>Frank nutzt die neuen Daten ab sofort.</p>}
    </div>
  )
}
