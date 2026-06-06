'use client'

import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FileText, Plus, Eye, Heart, MessageCircle, Share2, Calendar, Clock } from 'lucide-react'

const contentItems = [
  {
    id: 1,
    title: '5 AI-Automatisierungen die jeder Gründer kennen sollte',
    platform: 'linkedin',
    type: 'article',
    status: 'published',
    scheduledAt: null,
    publishedAt: '4. Jun 2026',
    metrics: { likes: 234, views: 8420, comments: 47, shares: 89 },
    body: 'Als Gründer kämpfst du täglich gegen Zeitverlust durch repetitive Aufgaben. Ich habe 5 AI-Tools getestet die mir 15h/Woche sparen...',
  },
  {
    id: 2,
    title: 'OKUN Systems Milestone: 200+ Kunden erreicht! 🎉',
    platform: 'linkedin',
    type: 'post',
    status: 'published',
    scheduledAt: null,
    publishedAt: '2. Jun 2026',
    metrics: { likes: 421, views: 12800, comments: 83, shares: 156 },
    body: 'Heute feiern wir einen Meilenstein: 200+ aktive Kunden vertrauen OKUN Systems. Was ich dabei gelernt habe...',
  },
  {
    id: 3,
    title: 'Wie wir von 0 auf €38K MRR gewachsen sind — unsere Strategie',
    platform: 'linkedin',
    type: 'article',
    status: 'scheduled',
    scheduledAt: '8. Jun, 09:00 Uhr',
    publishedAt: null,
    metrics: null,
    body: 'Der Weg zu €38K MRR in 18 Monaten war nicht geradlinig. Ich teile die 3 entscheidenden Wendepunkte...',
  },
  {
    id: 4,
    title: 'Behind the Scenes: Ein Tag als AI-Startup Gründer',
    platform: 'instagram',
    type: 'reel',
    status: 'scheduled',
    scheduledAt: '9. Jun, 18:00 Uhr',
    publishedAt: null,
    metrics: null,
    body: 'Story-Format: 7:00 Uhr aufstehen bis 21:00 Uhr. Zeige echten Gründer-Alltag...',
  },
  {
    id: 5,
    title: 'Der häufigste Fehler bei B2B SaaS Pricing',
    platform: 'linkedin',
    type: 'post',
    status: 'draft',
    scheduledAt: null,
    publishedAt: null,
    metrics: null,
    body: 'Wir haben 3x unsere Preise falsch gesetzt. Hier ist was uns €30K Verlust gekostet hat und wie wir es gefixt haben...',
  },
  {
    id: 6,
    title: 'AI Tools für Gründer — Top 10 für 2026',
    platform: 'both',
    type: 'article',
    status: 'draft',
    scheduledAt: null,
    publishedAt: null,
    metrics: null,
    body: 'Ich habe 50+ AI Tools getestet. Hier sind die 10 die wirklich einen Unterschied machen...',
  },
]

const platformConfig = {
  linkedin: { color: '#0077b5', label: 'LinkedIn', Icon: FileText },
  instagram: { color: '#e1306c', label: 'Instagram', Icon: Heart },
  both: { color: '#8b5cf6', label: 'LinkedIn + Instagram', Icon: Share2 },
}

const statusConfig = {
  published: { color: '#22c55e', label: 'Veröffentlicht', badgeVariant: 'green' as const },
  scheduled: { color: '#f59e0b', label: 'Geplant', badgeVariant: 'gold' as const },
  draft: { color: '#64748b', label: 'Entwurf', badgeVariant: 'gray' as const },
}

const typeLabels: Record<string, string> = {
  article: 'Artikel',
  post: 'Post',
  reel: 'Reel',
  story: 'Story',
}

export default function ContentHubPage() {
  const published = contentItems.filter(c => c.status === 'published').length
  const scheduled = contentItems.filter(c => c.status === 'scheduled').length
  const drafts = contentItems.filter(c => c.status === 'draft').length
  const totalViews = contentItems.reduce((sum, c) => sum + (c.metrics?.views || 0), 0)

  return (
    <div>
      <Header
        title="Content Hub"
        subtitle="LinkedIn, Instagram & Brand Content — von der Idee bis zur Veröffentlichung"
      />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Veröffentlicht', value: published, color: '#22c55e' },
            { label: 'Geplant', value: scheduled, color: '#f59e0b' },
            { label: 'Entwürfe', value: drafts, color: '#64748b' },
            { label: 'Gesamte Views', value: totalViews.toLocaleString(), color: '#3b82f6' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
            Content Bibliothek ({contentItems.length})
          </h2>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Calendar size={12} />
              Content Kalender
            </Button>
            <Button variant="gold" size="sm">
              <Plus size={12} />
              Neuer Content
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {contentItems.map((item) => {
            const platform = platformConfig[item.platform as keyof typeof platformConfig]
            const status = statusConfig[item.status as keyof typeof statusConfig]
            const PlatformIcon = platform.Icon

            return (
              <div key={item.id} className="card p-4 card-hover">
                <div className="flex items-start gap-4">
                  <div
                    style={{
                      backgroundColor: `${platform.color}15`,
                      border: `1px solid ${platform.color}30`,
                      borderRadius: '8px',
                      padding: '8px',
                      flexShrink: 0,
                    }}
                  >
                    <PlatformIcon size={16} style={{ color: platform.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{item.title}</h3>
                      <Badge variant={status.badgeVariant}>{status.label}</Badge>
                      <span style={{ color: platform.color, fontSize: '10px', fontWeight: 500 }}>{platform.label}</span>
                      <span style={{ color: '#475569', fontSize: '10px' }}>{typeLabels[item.type]}</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.5 }} className="mb-2">
                      {item.body.slice(0, 120)}...
                    </p>

                    {/* Metrics */}
                    {item.metrics && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye size={11} style={{ color: '#475569' }} />
                          <span style={{ color: '#94a3b8', fontSize: '11px' }}>{item.metrics.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={11} style={{ color: '#ef4444' }} />
                          <span style={{ color: '#94a3b8', fontSize: '11px' }}>{item.metrics.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={11} style={{ color: '#3b82f6' }} />
                          <span style={{ color: '#94a3b8', fontSize: '11px' }}>{item.metrics.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 size={11} style={{ color: '#22c55e' }} />
                          <span style={{ color: '#94a3b8', fontSize: '11px' }}>{item.metrics.shares}</span>
                        </div>
                      </div>
                    )}

                    {/* Scheduled */}
                    {item.scheduledAt && (
                      <div className="flex items-center gap-1">
                        <Clock size={11} style={{ color: '#f59e0b' }} />
                        <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 500 }}>Geplant: {item.scheduledAt}</span>
                      </div>
                    )}

                    {item.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar size={11} style={{ color: '#475569' }} />
                        <span style={{ color: '#475569', fontSize: '11px' }}>Veröffentlicht: {item.publishedAt}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
