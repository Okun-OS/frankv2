import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding FRANK OS database...')

  // User
  await prisma.user.upsert({
    where: { id: 'user_felix' },
    update: {},
    create: {
      id: 'user_felix',
      name: 'Felix Okun',
      company: 'OKUN Systems',
      role: 'Founder & CEO',
    },
  })

  // KPIs
  const kpiData = [
    { name: 'Monthly Recurring Revenue', category: 'revenue', unit: '€', target: 45000, current: 38200, previous: 34000, trend: 'up', period: 'MTD' },
    { name: 'Annual Recurring Revenue', category: 'revenue', unit: '€', target: 540000, current: 458400, previous: 408000, trend: 'up', period: 'YTD' },
    { name: 'Neue Leads pro Woche', category: 'leads', unit: '', target: 80, current: 47, previous: 51, trend: 'down', period: 'Wöchentlich' },
    { name: 'Aktive Kunden', category: 'customers', unit: '', target: 300, current: 234, previous: 220, trend: 'up', period: 'Gesamt' },
    { name: 'Sales Conversion Rate', category: 'sales', unit: '%', target: 8, current: 3.2, previous: 3.8, trend: 'down', period: 'MTD' },
    { name: 'Customer NPS Score', category: 'quality', unit: '', target: 80, current: 74, previous: 68, trend: 'up', period: 'Monatlich' },
    { name: 'Churn Rate', category: 'retention', unit: '%', target: 1.5, current: 2.1, previous: 2.4, trend: 'up', period: 'MTD' },
    { name: 'Customer Acquisition Cost', category: 'efficiency', unit: '€', target: 100, current: 124, previous: 131, trend: 'up', period: 'MTD' },
  ]

  for (const kpi of kpiData) {
    await prisma.kPI.create({ data: kpi })
  }

  // Goals
  const goals = await prisma.goal.createMany({
    data: [
      { title: 'Revenue €720K ARR erreichen', category: 'revenue', status: 'active', priority: 1, targetValue: 720000, currentValue: 458400, unit: '€', progress: 63, deadline: new Date('2026-12-31') },
      { title: '300 Aktive Kunden', category: 'customers', status: 'active', priority: 2, targetValue: 300, currentValue: 234, progress: 78, deadline: new Date('2026-09-30') },
      { title: 'Series A Finanzierung sichern', category: 'growth', status: 'active', priority: 1, progress: 45, deadline: new Date('2026-09-01') },
      { title: 'Team auf 12 FTE ausbauen', category: 'team', status: 'active', priority: 3, targetValue: 12, currentValue: 7, unit: ' Personen', progress: 58, deadline: new Date('2026-12-31') },
    ],
  })

  // Bottlenecks
  await prisma.bottleneck.createMany({
    data: [
      { title: 'Sales Funnel Conversion zu niedrig', description: 'Lead-zu-Kunde Conversion bei 3.2% statt 8%', impact: 'critical', status: 'open', area: 'sales', duration: '12 Tage', actions: JSON.stringify(['Demo-Prozess optimieren', 'Follow-up automatisieren']) },
      { title: 'Manuelle Onboarding-Prozesse', description: 'Onboarding dauert 8 Tage, blockiert Team', impact: 'high', status: 'in_progress', area: 'operations', duration: '3 Wochen', actions: JSON.stringify(['Onboarding automatisieren', 'Self-Service Portal bauen']) },
      { title: 'LinkedIn Content Inkonsistenz', description: 'Posting-Frequenz von 5x auf 2x/Woche gesunken', impact: 'medium', status: 'open', area: 'marketing', duration: '5 Tage', actions: JSON.stringify(['Content-Kalender erstellen', 'Content-Agent aktivieren']) },
    ],
  })

  // Opportunities
  await prisma.opportunity.createMany({
    data: [
      { title: 'DACH Enterprise Partnership', description: '3 Enterprise-Kunden bereit für Partnership', potential: 'very_high', timeframe: '14 Tage', status: 'pursuing', area: 'partnership', actions: JSON.stringify(['Erstgespräch vereinbaren', 'Proposal erstellen']) },
      { title: 'LinkedIn Thought Leadership', description: 'Konkurrenten reduzieren Budget — perfekter Zeitpunkt', potential: 'high', timeframe: '7 Tage', status: 'identified', area: 'marketing', actions: JSON.stringify(['Content-Kalender Q3 erstellen']) },
      { title: 'Bestands-Kunden Upsell', description: '47 Kunden könnten auf Pro upgraden', potential: 'high', timeframe: '14 Tage', status: 'identified', area: 'sales', actions: JSON.stringify(['Upsell-Email-Sequenz schreiben']) },
    ],
  })

  // Alerts
  await prisma.alert.createMany({
    data: [
      { title: 'KPI-Warnung: Leads unter Ziel', description: 'Neue Leads 42% unter Monatsziel', severity: 'danger', category: 'kpi' },
      { title: 'Opportunity: LinkedIn-Kampagne', description: 'Zeitfenster für LinkedIn-Dominanz offen', severity: 'warning', category: 'opportunity' },
      { title: 'Weekly Review fällig', description: 'KW 23 Review nicht durchgeführt', severity: 'info', category: 'review' },
      { title: 'Ziel erreicht: 200+ Kunden', description: 'Meilenstein 234 aktive Kunden erreicht', severity: 'success', category: 'goal' },
    ],
  })

  // Agents
  await prisma.agent.createMany({
    data: [
      { name: 'Founder Agent', type: 'founder', status: 'active', lastRun: new Date() },
      { name: 'Strategy Agent', type: 'strategy', status: 'active', lastRun: new Date(Date.now() - 3600000) },
      { name: 'Sales Agent', type: 'sales', status: 'active', lastRun: new Date(Date.now() - 720000) },
      { name: 'Marketing Agent', type: 'marketing', status: 'active', lastRun: new Date(Date.now() - 1800000) },
      { name: 'Content Agent', type: 'content', status: 'active', lastRun: new Date(Date.now() - 7200000) },
      { name: 'Review Agent', type: 'review', status: 'active', lastRun: new Date(Date.now() - 10800000) },
      { name: 'Monitoring Agent', type: 'monitoring', status: 'active', lastRun: new Date(Date.now() - 120000) },
      { name: 'Opportunity Agent', type: 'opportunity', status: 'active', lastRun: new Date(Date.now() - 2700000) },
      { name: 'Planning Agent', type: 'planning', status: 'active', lastRun: new Date(Date.now() - 28800000) },
    ],
  })

  // Strategies
  await prisma.strategy.createMany({
    data: [
      { title: 'Product-Led Growth', description: 'Freemium-Modell für organisches Wachstum', type: 'strategy', status: 'active', priority: 1 },
      { title: 'Enterprise Outbound Sales', description: 'Direkter Outbound für DACH Enterprise', type: 'strategy', status: 'active', priority: 2 },
      { title: 'LinkedIn als primärer Akquisitionskanal', type: 'hypothesis', status: 'testing', priority: 1, hypothesis: 'Daily LinkedIn → +150% Inbound in 90 Tagen' },
    ],
  })

  // Reviews
  await prisma.review.createMany({
    data: [
      {
        weekNumber: 22,
        year: 2026,
        title: 'KW22 — Starkes Momentum trotz Lead-Rückgang',
        wins: JSON.stringify(['234 aktive Kunden (+14)', 'Investor Call erfolgreich', 'LinkedIn Reichweite +340%']),
        losses: JSON.stringify(['Leads 42% unter Ziel', 'Demo Conversion auf 3.2% gesunken']),
        learnings: JSON.stringify(['Enterprise braucht andere Kommunikation als SMB', 'Video perft 3x besser']),
        nextWeekFocus: 'Lead-Generierung priorisieren. LinkedIn täglich, Demo-Script optimieren.',
        kpiSnapshot: JSON.stringify({ revenue: 42800, leads: 47, customers: 234, nps: 74 }),
      },
    ],
  })

  // Memories
  await prisma.memory.createMany({
    data: [
      { title: 'Enterprise-Kunden sind 3x profitabler', content: 'LTV €8,400 vs €2,800 bei SMB. Churn 60% niedriger.', category: 'learning', tags: JSON.stringify(['enterprise', 'pricing']), importance: 5, source: 'weekly_review' },
      { title: 'Video-Content perft 3x besser auf LinkedIn', content: '8,420 Views vs 2,840 bei Text-Posts. Engagement 4.2% vs 1.8%', category: 'pattern', tags: JSON.stringify(['content', 'linkedin']), importance: 4, source: 'weekly_review' },
      { title: 'Follow-up nach Tag 3 entscheidend', content: 'Deals mit Follow-up nach 72h konvertierten 2.4x häufiger.', category: 'pattern', tags: JSON.stringify(['sales', 'follow-up']), importance: 5, source: 'agent' },
    ],
  })

  // Calendar Events
  await prisma.calendarEvent.createMany({
    data: [
      { title: 'Investor Call: Thomas Weber', startTime: new Date('2026-06-06T10:00:00'), endTime: new Date('2026-06-06T11:00:00'), type: 'call', color: '#f59e0b', location: 'Zoom' },
      { title: 'Product Demo: ACME GmbH', startTime: new Date('2026-06-06T14:00:00'), endTime: new Date('2026-06-06T15:00:00'), type: 'meeting', color: '#3b82f6', location: 'Google Meet' },
      { title: 'Partnership Talk', startTime: new Date('2026-06-06T16:00:00'), endTime: new Date('2026-06-06T16:30:00'), type: 'call', color: '#22c55e', location: 'Telefon' },
    ],
  })

  // Content Items
  await prisma.contentItem.createMany({
    data: [
      { title: '5 AI-Automatisierungen die jeder Gründer kennen sollte', platform: 'linkedin', type: 'article', status: 'published', body: 'Als Gründer kämpfst du täglich gegen Zeitverlust...', metrics: JSON.stringify({ likes: 234, views: 8420, comments: 47, shares: 89 }) },
      { title: 'OKUN Systems Milestone: 200+ Kunden erreicht!', platform: 'linkedin', type: 'post', status: 'published', body: 'Heute feiern wir einen Meilenstein...', metrics: JSON.stringify({ likes: 421, views: 12800, comments: 83, shares: 156 }) },
      { title: 'Wie wir von 0 auf €38K MRR gewachsen sind', platform: 'linkedin', type: 'article', status: 'scheduled', scheduledAt: new Date('2026-06-08T09:00:00'), body: 'Der Weg zu €38K MRR...' },
    ],
  })

  // Automations
  await prisma.automation.createMany({
    data: [
      { name: 'KPI Alert: Revenue unter Ziel', trigger: 'kpi_threshold', condition: 'Revenue < 80% des Monatsziels', action: 'Slack-Nachricht + FRANK Analyse', isActive: true },
      { name: 'Wöchentliches Review Reminder', trigger: 'time_based', condition: 'Jeden Freitag um 16:00', action: 'Email + Notification senden', isActive: true, lastRun: new Date('2026-05-30T16:00:00') },
      { name: 'Neuer Lead: Sofort qualifizieren', trigger: 'event_based', condition: 'Neuer Lead im CRM erstellt', action: 'Sales Agent starten', isActive: true, lastRun: new Date() },
      { name: 'Täglich: FRANK Morning Brief', trigger: 'time_based', condition: 'Täglich um 07:00', action: 'FRANK Daily Brief generieren', isActive: true, lastRun: new Date() },
    ],
  })

  // Integrations
  await prisma.integration.createMany({
    data: [
      { name: 'HubSpot CRM', type: 'crm', status: 'connected', lastSync: new Date() },
      { name: 'LinkedIn', type: 'linkedin', status: 'connected', lastSync: new Date(Date.now() - 7200000) },
      { name: 'Google Calendar', type: 'calendar', status: 'connected', lastSync: new Date(Date.now() - 600000) },
      { name: 'Slack', type: 'slack', status: 'connected', lastSync: new Date() },
      { name: 'Stripe', type: 'payment', status: 'connected', lastSync: new Date(Date.now() - 3600000) },
      { name: 'Instagram', type: 'instagram', status: 'disconnected' },
    ],
  })

  console.log('✓ FRANK OS database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
