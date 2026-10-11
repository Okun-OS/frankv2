# 03 – MVP & Roadmap

## 1. Bewertung des vorgeschlagenen MVP (Abschnitt 14)

Die zehn Funktionen sind **richtig ausgewählt, aber als Produkt noch zu allgemein**. Für sich genommen beschreiben sie einen KI-Planungsassistenten, wie ihn Motion, Reclaim, Copilot oder Gemini bereits anbieten.

| Kriterium | Bewertung des Vorschlags |
| --- | --- |
| Kundennutzen | mittel: Onboarding, Präferenzen und Ziele sind Voraussetzung, aber noch kein spürbarer Nutzen. Der Nutzen entsteht erst durch Briefing + Integration + vorbereitete Aktionen. |
| Technischer Aufwand | angemessen, *wenn* die Integration nicht in die Breite geht |
| Differenzierung | **schwach**, solange der Fokus auf Kalender- und Aufgabenplanung liegt |
| Vermarktbarkeit | schwer als eigenständiges Abo („noch ein Assistent“), gut als Teil eines Agentur-Engagements |
| Skalierbarkeit | gut, wenn das Fundament aus 02 steht |
| Wiederkehrender Nutzungsanreiz | nur über das tägliche Briefing; das muss deshalb das Herzstück sein |
| Anschlussfähigkeit an die Suite | gut |

## 2. Mein Gegenvorschlag: Gleiche Bausteine, schärferer Kern

### „VEKTOR Pilot – Fokus und Follow-up für Geschäftsführer“

Ein täglicher Kreislauf, der in einer Woche spürbar ist und messbar Geld bringt:

1. **Morgens:** Ein belegtes Briefing: Termine und freie Zeitfenster, die drei wichtigsten Prioritäten mit Zielbezug, **liegengebliebene geschäftliche Vorgänge** (z. B. versendete Angebote ohne Antwort, unbeantwortete wichtige Mails, nahende Fristen).
2. **Direkt daraus:** Vorbereitete Aktionen im Action Center: Follow-up-Entwurf in Gmail, Aufgabe anlegen, Fokusblock im Kalender setzen. **Alles nach Freigabe.**
3. **Wöchentlich:** Zielbilanz: Was hat auf welches Ziel eingezahlt, wo gibt es Abweichungen, was sollte nächste Woche Vorrang haben?

**Warum dieser Kern stärker ist:**

- **Messbarer Nutzen:** „Follow-ups, die sonst liegen geblieben wären“ ist in Euro übersetzbar. Ein Kalenderplan ist das nicht.
- **Differenzierung:** Verbindung von Zielen + Unternehmenskontext + Kommunikation, nicht nur Zeitplanung.
- **Vertrieb:** Erste Kunden sind OKUN Systems selbst und 3–5 Agenturkunden, idealerweise mit Blueprint. VEKTOR wird als Bestandteil der Betreuung nach dem Blueprint eingeführt. Das testet zugleich die Blueprint-Übernahme an echten Fällen.
- **Anschluss:** Der Follow-up-Kreislauf ist genau der Fall „CRM + Mailroom + Deals“ aus der Vision, zunächst nur auf Basis von Gmail und Kalender.

### Zuordnung zu Ihren zehn Funktionen

| Ihre Funktion | Im Pilot | Anmerkung |
| --- | --- | --- |
| 1 Unternehmens-Onboarding | ✔ | Geführt, kurz; bei Blueprint-Kunden vorbefüllt (halbautomatisch, mit Bestätigung) |
| 2 Arbeitspräferenzen | ✔ | Als Wissenseinträge `kind: preference`, im Dialog erfassbar |
| 3 Ziele verwalten | ✔ | Ziel → Initiative → Aufgabe; Zielbilanz wöchentlich |
| 4 Kalenderintegration | ✔ | Google Calendar lesend; Fokusblöcke schreibend nach Freigabe |
| 5 Aufgabenpriorisierung | ✔ schlank | Eigene schlanke Aufgabenliste; Priorisierung mit Begründung und Zielbezug |
| 6 Tägliches Briefing | ✔ **Herzstück** | Belegpflicht, Feedback je Hinweis |
| 7 Kontextbezogener Dialog | ✔ | Stufe A mit Quellenangaben; Gedächtnisvorschläge aus dem Gespräch |
| 8 Erste reale Integration | ✔ | **Google Workspace (Calendar + Gmail)**; FRANK hat dafür bereits OAuth-Grundlagen. Alternative M365, siehe F4 |
| 9 Kontrollierbares Gedächtnis | ✔ | Ansehen, korrigieren, löschen; Herkunft sichtbar |
| 10 Vorbereitete Aktionen | ✔ | Gmail-Entwurf (R1), Aufgabe (R2), Kalenderblock (R2), alle mit Freigabe. **Kein Versand von E-Mails im Pilot.** |

### Bewusst nicht im Pilot

E-Mail-Versand durch VEKTOR · Echtzeit-Benachrichtigungen · KPI-Dashboards aus Finanz-/CRM-Systemen · Business Intelligence · Microsoft 365 (falls nicht F4 anders entscheidet) · Anbindung von OKUN Workforce/CRM/Mailroom/Deals · automatischer Blueprint-Import · Abrechnung/Abos (nur Entitlement-Struktur) · Spracheingabe · Mehrsprachigkeit (nur Struktur) · selbst betriebene Modelle.

## 3. Roadmap in überprüfbaren Abschnitten

Jeder Abschnitt endet mit etwas Nutzbarem und einem Abnahmekriterium. Reihenfolge ist verbindlich, Dauer hängt von F9 (Kapazität) ab.

| # | Abschnitt | Nutzen | Abnahme |
| --- | --- | --- | --- |
| 0 | **Fundament:** Auth, Organisationen, Rollen, RLS, Audit-Log, verschlüsselte Credentials, Worker + Queue, Model Gateway (2 Adapter), Aufruf-Protokoll, Eval-Runner, CI | Sichere Basis | Automatisierte Tests: Nutzer aus Org A kann auf keinem Weg (API, KI-Kontext, Suche) Daten aus Org B lesen. Gateway-Wechsel per Konfiguration. |
| 1 | **Onboarding, Ziele, Gedächtnis v1** | VEKTOR kennt Unternehmen, Ziele und Präferenzen | Eintrag anlegen/korrigieren/löschen inkl. Versionshistorie und Herkunftsanzeige |
| 2 | **Dialog (Stufe A)** mit Context Builder, Quellen und Gedächtnisvorschlägen | Erster echter Gesprächsnutzen | Eval-Satz: keine Aussage über Unternehmensdaten ohne Quelle; Gedächtnis wird nur nach Bestätigung geändert |
| 3 | **Google Calendar** (lesen) + Tagesansicht mit freien Zeitfenstern und Präferenzen | Planung auf echten Terminen | Echte Termine eines Testkontos, Präferenz „Mittwochs keine internen Meetings“ wird berücksichtigt |
| 4 | **Tägliches Briefing v1** (geplant im Worker, belegt, Feedback-Buttons) | Täglicher Nutzungsanreiz | Jede Aussage verlinkt eine Quelle; Zahlen stammen nachweislich aus Abfragen |
| 5 | **Gmail (lesen, eingeschränkt) + Follow-up-Erkennung + Action Center** mit Entwurf/Aufgabe/Kalenderblock nach Freigabe | Messbarer Geschäftsnutzen | Injection-Testfälle (präparierte Mails) lösen keine Aktion ohne Freigabe aus; jede Aktion im Audit-Log |
| 6 | **Wöchentliche Zielbilanz + Pilot-Härtung** (Monitoring, Fehlertracking, DSGVO-Unterlagen, Löschkonzept, Datenexport) | Pilotfähigkeit | Interner Einsatz bei OKUN Systems ≥ 2 Wochen, danach erste Pilotkunden |

### Erfolgsmessung im Pilot

- Briefing an ≥ 4 von 5 Werktagen geöffnet
- Anteil der Briefing-Hinweise, die als hilfreich markiert werden
- Anteil übernommener Entwürfe/Aktionen
- Anzahl erkannter Follow-ups, die zu einer Reaktion geführt haben
- 0 unbelegte Zahlen in Eval und Stichproben
- Kosten pro aktivem Nutzer und Tag (LLM + Infrastruktur)
