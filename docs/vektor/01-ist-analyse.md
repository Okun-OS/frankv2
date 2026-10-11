# 01 – Ist-Analyse: FRANK OS als Vorläufer von VEKTOR

> Umfang: Geprüft wurde **nur dieses Repository** (`okun-os/frankv2`). Andere OKUN-Produkte (Workforce, CRM, Mailroom/Mailwin, Deals, Blueprint-Plattform) sind in dieser Sitzung nicht zugänglich und wurden **nicht** geprüft. Die vollständige Infrastruktur-Prüfung ist Phase 2 und folgt nach Freigabe.

Dieses Repository (`frankv2`) enthält **FRANK OS**, einen KI-gestützten „digitalen COO“ für Felix Okun / OKUN Systems.
FRANK ist faktisch ein früher Prototyp dessen, was VEKTOR werden soll – allerdings für genau *einen* Nutzer und *ein* Unternehmen gebaut.

## Technischer Stand

| Bereich | Stand |
| --- | --- |
| Framework | Next.js 16.2 (App Router), React 19, Tailwind 4, TypeScript |
| Datenbank | PostgreSQL via Prisma 5, Migrationen vorhanden |
| Hosting | Railway (Nixpacks, `prisma migrate deploy` vor Deploy) |
| KI | Anthropic SDK (Chat, Briefing, E-Mail-Klassifikation), OpenAI (Bildgenerierung im Content-Bereich) |
| Integrationen | Google OAuth (Gmail, Calendar, Sheets), LinkedIn OAuth, Webhooks für DealSky, LinkedIn, Instagram |
| Umfang | ~25 Seiten, ~30 API-Routen, ~25 Datenmodelle |

## Was bereits in Richtung VEKTOR zeigt

| FRANK-Funktion | Datei(en) | Relevanz für VEKTOR |
| --- | --- | --- |
| Chat mit Live-Kontext (KPIs, Ziele, Engpässe, Alerts, Profil) | `src/app/api/frank/route.ts` | Grundmuster für Stufe A. Kontext wird aber pauschal in den System-Prompt kopiert, ohne Quellen und ohne Tool-Use. |
| Executive Briefing | `src/app/api/frank/briefing/route.ts` | Direkter Vorläufer des „täglichen Geschäftsbriefs“. Ausgabe ist JSON, aber ohne Belege – das Modell kann Aussagen frei formulieren. |
| Zielhierarchie im Prompt (Vision → Jahr → Quartal → … → Aufgabe) | `frank/route.ts` | Gute fachliche Logik, gehört aber ins Datenmodell, nicht nur in den Prompt. |
| Learning Queue (Vorschlag → Bestätigen/Ablehnen → Memory) | `src/app/api/learning/route.ts` | **Genau das richtige Muster** für ein kontrolliertes Unternehmensgedächtnis. Wird in VEKTOR verallgemeinert. |
| Founder-Profil / Setup-Onboarding | `FounderProfile`, `src/app/setup` | Vorläufer des strukturierten Unternehmenskontexts. Freitextfelder, keine Herkunft, keine Versionierung. |
| Verfügbarkeiten & Tagesplanung | `Availability`, `DailyPlan`, `/planung` | Vorläufer der Arbeitskontext- und Präferenzmodellierung. |
| Gmail-Sync mit KI-Klassifikation | `src/app/api/sync/gmail/route.ts` | Vorläufer eines Konnektors – aber fest verdrahtet. |
| Webhook-Eingang mit Event-Log | `WebhookEvent`, `/api/webhooks/*` | Gutes Muster für Signal-Eingang der proaktiven Engine. |

## Strukturelle Lücken (die VEKTOR zwingend schließen muss)

1. **Keine Authentifizierung.** Alle API-Routen sind öffentlich erreichbar. Die Middleware prüft nur, ob das Setup abgeschlossen ist. Für ein Produkt mit Kundendaten ist das ein Ausschlusskriterium.
2. **Keine Mandantenfähigkeit.** Kein Modell hat eine `organizationId`. `User` hat Default-Werte „Felix Okun / OKUN Systems“. `OAuthToken` wird per `findFirst({ provider: 'google' })` geladen – bei zwei Kunden würde jeder die Mails des anderen sehen.
3. **OAuth-Tokens im Klartext** in der Datenbank.
4. **Gedächtnis ohne Herkunft und Status.** `Memory` kennt nur `source` als Freitext; kein Zeitpunkt der Gültigkeit, keine Bestätigung, keine Korrektur-Historie, keine Zweckbindung. Die Memory-Seite zeigt zudem teilweise statische Beispieldaten.
5. **Kein Aktions- oder Freigabemodell.** `Automation` und `Agent` sind reine Anzeige-Datensätze (Strings für Trigger/Action), es gibt keine Ausführung mit Berechtigungsprüfung und kein Audit-Log.
6. **Keine Hintergrundverarbeitung.** Sync und Briefing laufen nur, wenn eine Seite sie per HTTP anstößt. Proaktivität braucht Jobs/Zeitpläne.
7. **Keine Belegpflicht für KI-Aussagen.** Das Briefing kann Prioritäten und Risiken formulieren, die nicht aus Daten stammen.
8. **Stringly-typed Daten.** Viele Felder sind JSON-in-String (`tags`, `metadata`, `config`). Erschwert Abfragen und Validierung.
9. **Unternehmenswissen hart im Code.** Der FRANK-System-Prompt enthält OKUN-spezifische Fakten (Pakete, Preise, Zielkunden). In VEKTOR müssen diese aus dem Unternehmensgedächtnis der jeweiligen Organisation kommen.

## Fazit

FRANK ist inhaltlich ein wertvoller Prototyp: Die fachlichen Muster (Zielhierarchie, Briefing, Learning Queue, Verfügbarkeiten) sind richtig und sollten übernommen werden.
Technisch ist FRANK aber ein Single-User-Werkzeug. VEKTOR braucht ein **neues Fundament** (Auth, Mandanten, Gedächtnis mit Provenienz, Policy-Engine, Jobs, Konnektor-Framework).

Empfehlung: FRANK nicht „umbauen“, sondern VEKTOR mit sauberem Fundament neu aufsetzen und FRANKs Funktionen schrittweise darauf migrieren. OKUN Systems wird dabei **Mandant Nr. 1** und nutzt VEKTOR selbst (Dogfooding). Ob das in diesem Repository oder in einem neuen geschieht, ist Frage F1 in [04-offene-fragen.md](./04-offene-fragen.md).
