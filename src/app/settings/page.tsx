'use client'

import Header from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Settings, User, Bell, Shield, Palette, Globe, Database, Bot, Save, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const sections = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'notifications', label: 'Benachrichtigungen', icon: Bell },
  { id: 'security', label: 'Sicherheit', icon: Shield },
  { id: 'appearance', label: 'Design', icon: Palette },
  { id: 'language', label: 'Sprache & Region', icon: Globe },
  { id: 'data', label: 'Daten & Export', icon: Database },
  { id: 'ai', label: 'FRANK AI', icon: Bot },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <Header
        title="Settings"
        subtitle="FRANK OS konfigurieren und personalisieren"
      />
      <div className="p-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-48 flex-shrink-0">
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
                    <Icon size={14} />
                    {section.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === 'profile' && (
              <div className="card p-6 space-y-6">
                <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 700 }}>Profil-Einstellungen</h2>

                <div className="flex items-center gap-4 pb-6" style={{ borderBottom: '1px solid #1e2130' }}>
                  <div
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <span style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>FO</span>
                  </div>
                  <div>
                    <p style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600 }}>Felix Okun</p>
                    <p style={{ color: '#64748b', fontSize: '12px' }}>Founder & CEO · OKUN Systems</p>
                    <button style={{ color: '#f59e0b', fontSize: '11px', marginTop: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      Foto ändern
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Vorname', value: 'Felix' },
                    { label: 'Nachname', value: 'Okun' },
                    { label: 'E-Mail', value: 'felix@okun.systems' },
                    { label: 'Telefon', value: '+49 170 1234567' },
                    { label: 'Unternehmen', value: 'OKUN Systems' },
                    { label: 'Position', value: 'Founder & CEO' },
                  ].map((field) => (
                    <div key={field.label}>
                      <label style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                        {field.label}
                      </label>
                      <input
                        defaultValue={field.value}
                        style={{
                          width: '100%',
                          backgroundColor: '#0a0b0f',
                          border: '1px solid #1e2130',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          color: '#f1f5f9',
                          fontSize: '12px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  ))}
                </div>

                <Button variant="gold" onClick={handleSave}>
                  <Save size={13} />
                  {saved ? 'Gespeichert ✓' : 'Änderungen speichern'}
                </Button>
              </div>
            )}

            {activeSection === 'ai' && (
              <div className="card p-6 space-y-6">
                <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 700 }}>FRANK AI Einstellungen</h2>

                <div className="space-y-4">
                  {[
                    { label: 'AI Modell', description: 'Das Claude-Modell das FRANK verwendet', value: 'claude-sonnet-4-6' },
                    { label: 'Sprache', description: 'FRANK kommuniziert in dieser Sprache', value: 'Deutsch (DE)' },
                    { label: 'Tonalität', description: 'Wie FRANK mit dir spricht', value: 'Direkt & professionell' },
                    { label: 'Anthropic API Key', description: 'Dein persönlicher API-Schlüssel', value: 'sk-ant-...' },
                  ].map((setting) => (
                    <div key={setting.label} style={{ borderBottom: '1px solid #1e2130', paddingBottom: '16px' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 500 }}>{setting.label}</p>
                          <p style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>{setting.description}</p>
                        </div>
                        <div
                          style={{
                            backgroundColor: '#0a0b0f',
                            border: '1px solid #1e2130',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            color: '#94a3b8',
                            fontSize: '11px',
                          }}
                        >
                          {setting.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest mb-3">
                    FRANK Kontext
                  </h3>
                  <div
                    style={{
                      backgroundColor: '#0a0b0f',
                      border: '1px solid #1e2130',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  >
                    <textarea
                      defaultValue="Ich bin Felix Okun, Founder & CEO von OKUN Systems. Wir bauen AI-Automatisierungslösungen für DACH-KMUs. Unser Team hat 7 Personen. Wir sind pre-Series A mit €38K MRR. Fokus: Enterprise-Kunden, PLG-Wachstum, LinkedIn als Hauptkanal."
                      rows={6}
                      style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        color: '#f1f5f9',
                        fontSize: '12px',
                        lineHeight: 1.6,
                        outline: 'none',
                        border: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                  <p style={{ color: '#475569', fontSize: '10px', marginTop: '6px' }}>
                    Dieser Kontext wird FRANK bei jeder Interaktion übergeben für personalisierte Antworten.
                  </p>
                </div>

                <Button variant="gold" onClick={handleSave}>
                  <Save size={13} />
                  {saved ? 'Gespeichert ✓' : 'Einstellungen speichern'}
                </Button>
              </div>
            )}

            {activeSection !== 'profile' && activeSection !== 'ai' && (
              <div className="card p-6">
                <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 700 }} className="mb-4">
                  {sections.find(s => s.id === activeSection)?.label} Einstellungen
                </h2>
                <p style={{ color: '#64748b', fontSize: '13px' }}>
                  Diese Einstellungen werden in Kürze verfügbar sein.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
