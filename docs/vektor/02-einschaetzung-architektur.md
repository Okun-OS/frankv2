# 02 – Einschätzung & Architektur

Dieses Dokument beantwortet die Fragen aus Abschnitt 19 des Master-Prompts. Es unterscheidet durchgehend:

- **[Existiert]**: im Code von `frankv2` nachweisbar
- **[MVP]**: Vorschlag für die erste Produktversion
- **[Später]**: bewusst verschoben
- **[Vision]**: langfristige Richtung, beeinflusst heute höchstens Schnittstellen

---

## 1. Ehrliche Einschätzung der Vision

### Was besonders stark ist

1. **Das Schwungrad Agentur → Blueprint → VEKTOR.** Das ist der eigentliche Wettbewerbsvorteil. Copilot, Gemini & Co. starten bei jedem Kunden bei null. VEKTOR kann mit einem *geprüften* Unternehmensmodell aus dem Blueprint starten, und die Agentur liefert Vertriebskanal, Implementierungsleistung und Domänenwissen gleich mit. Diese Kombination ist schwer zu kopieren.
2. **Die Stufen A/B/C und die Forderung nach Nachvollziehbarkeit.** Genau daran scheitern viele „Agenten“-Produkte im Mittelstand: am Vertrauen, nicht an der Technik.
3. **Gedächtnis mit Provenienz statt „alles speichern“.** Fachlich richtig und im europäischen Rechtsrahmen ein Verkaufsargument.
4. **Der ausdrückliche Verzicht auf Overengineering und auf eigenes Modelltraining jetzt.**

### Wo die größten Risiken liegen

| Risiko | Warum es ernst ist | Gegenmaßnahme |
| --- | --- | --- |
| **Fokus & Kapazität** | Agentur, mehrere SaaS-Produkte, Suite, VEKTOR und eigene Modelle sind zusammen die Agenda eines Konzerns. Das größte Risiko ist nicht technisch, sondern dass nichts davon fertig wird. | VEKTOR-MVP muss **ohne** die anderen OKUN-Produkte Nutzen stiften. Suite-Integration erst, wenn ein Produkt real im Einsatz ist. |
| **Austauschbarkeit** | „KI-Assistent mit Kalender, Aufgaben und Tagesbriefing“ bieten Microsoft Copilot, Google Gemini, Motion, Reclaim, Notion AI, HubSpot u. a. bereits an, teils im vorhandenen Abo des Kunden enthalten. | Differenzierung über **Unternehmenskontext + Zielbezug + Blueprint + Umsetzung durch die Agentur + DSGVO/EU-Betrieb**, nicht über Chat oder Kalenderplanung. |
| **Vertrauensverlust durch eine falsche Zahl** | Eine einzige halluzinierte Kennzahl im Briefing kann das Vertrauen dauerhaft zerstören. | Belegpflicht technisch erzwingen (siehe 5.4). Zahlen kommen nie aus dem Modell, sondern aus Abfragen. |
| **Prompt Injection** | VEKTOR liest E-Mails und Dokumente von Dritten. Eine präparierte Mail kann versuchen, Aktionen auszulösen. | Externe Inhalte sind „untrusted“. Aus ihnen abgeleitete Aktionen brauchen immer eine menschliche Freigabe (siehe 7). |
| **Integrationskosten** | Jeder Konnektor kostet dauerhaft Wartung (API-Änderungen, OAuth-Prüfungen, Rate Limits). Google-/Microsoft-Verifizierung für Mail-Scopes dauert Wochen und kann ein Sicherheitsaudit erfordern. | Wenige, tiefe Konnektoren statt vieler flacher. Verifizierungsprozess früh starten. |
| **Unklarer Stand der OKUN-Produkte** | Die Suite-Vision setzt Produkte voraus, deren Reifegrad ich nicht kenne. | Phase 2 prüft das. Bis dahin plane ich keine Abhängigkeit davon. |
| **Modellvision bindet Ressourcen** | Eigene Modelle (Stufen 3–5) sind eine andere Firma mit anderem Kapitalbedarf. | Heute nur das tun, was ohnehin gute Ingenieurspraxis ist: Gateway, Logging, Evaluationen. Siehe Abschnitt 9. |

---

## 2. Frage 1 – Architektonische Gesamtkonzeption

### Empfehlung: Modularer Monolith in TypeScript, PostgreSQL als einziges Datenfundament

Keine Microservices. Eine Codebasis, **zwei Prozesse**:

- **Web** (Next.js): Oberfläche + API
- **Worker** (derselbe Code, eigener Prozess): Synchronisation, Zeitpläne, Briefings, Insight-Erkennung, Aktionsausführung

Alles Weitere läuft über PostgreSQL:

| Bedarf | Lösung in Postgres | Statt |
| --- | --- | --- |
| Relationale Daten, Mandanten | Tabellen + `organization_id` + Row-Level Security | – |
| Semantische Suche | `pgvector` | eigene Vektor-DB |
| Job-Queue & Zeitpläne | `pg-boss` (oder vergleichbar) | Redis, Kafka |
| Audit-Log | Append-only-Tabelle | eigenes Log-System |

Das hält Betrieb, Kosten und Datenschutzdokumentation klein. Jede dieser Komponenten lässt sich später einzeln herauslösen, wenn Last oder Teamgröße es verlangen.

### Bewertung der vorgeschlagenen Funktionsbereiche A–H

Die Aufteilung ist als **Modulgrenzen** gut, als Services wäre sie verfrüht. Zwei Dinge fehlen, eines würde ich zusammenlegen:

- **Fehlt: Plattform-Kern** (Identität, Mandanten, Rollen, Abos/Entitlements, Audit). Ohne diesen Kern sind alle anderen Module unsicher.
- **Fehlt: Geschäftsdomäne** (Ziele, Initiativen, Aufgaben, Kennzahlen). „Planning“ ist eigentlich ein Teil davon. Ziele und Aufgaben sind Geschäftsdaten, keine KI-Funktion; sie müssen auch ohne KI funktionieren.
- **Zusammenlegen: Insights und Planning** im MVP. Beide werten Domänendaten aus und erzeugen Vorschläge.

Empfohlener Modulschnitt (je Modul ein Ordner mit öffentlicher Schnittstelle; Importe quer durch interne Dateien werden per Lint-Regel verboten):

```
src/vektor/
  platform/      Identität, Organisationen, Mitgliedschaften, Rollen, Entitlements, Audit
  domain/        Ziele, Initiativen, Aufgaben, Kennzahlen, Präferenzen (Planning lebt hier)
  memory/        Business Memory: Wissenseinträge, Provenienz, Kontextaufbau, semantischer Index
  connect/       Konnektor-Framework, Credentials, Sync, Webhooks, Konnektoren (google, …)
  actions/       Aktionskatalog, Policy-Engine, Freigaben, Ausführung, Rückgängig
  insights/      Signale → Detektoren → bewertete Hinweise, Briefing-Erzeugung
  intelligence/  Orchestrierung: Dialog, Tool-Aufrufe, Prompts je Aufgabe
  gateway/       Model Gateway: Anbieter-Adapter, Routing, Kosten-/Latenzmessung
src/app/         Interface (Next.js-Seiten)
```

Abhängigkeitsregel: `intelligence` darf `memory`, `domain`, `connect` (lesend) und `actions` (nur „vorschlagen“) nutzen. **Nur `actions` darf schreibend auf Konnektoren zugreifen.** `gateway` kennt keine Geschäftslogik.

---

## 3. Frage 2 – Grundlagen, die wir heute legen müssen

Das sind die Entscheidungen, die später teuer nachzuholen sind. Alles andere kann warten.

1. **Mandantenfähigkeit + Row-Level Security** in jeder Tabelle ab der ersten Migration.
2. **Eine zentrale OKUN-Identität** (ein Konto, eine Organisation über alle OKUN-Produkte). Wenn Workforce, CRM und VEKTOR je eigene Nutzerverwaltungen bekommen, kostet die spätere Zusammenführung Monate. Siehe Frage F3.
3. **Das gemeinsame Unternehmensmodell** („OKUN Company Model“), das Blueprint, Radar, Transformation Studio und VEKTOR teilen. Siehe Abschnitt 8.
4. **Provenienz und Erkenntnisstatus** an jedem Wissenseintrag (Quelle, Zeitpunkt, bestätigt/Annahme, Zweck).
5. **Aktions- und Audit-Modell** ab der ersten schreibenden Funktion, auch wenn es anfangs nur „Aufgabe anlegen“ ist.
6. **Model Gateway + Aufruf-Protokoll** (Modell, Prompt-Version, Tokens, Kosten, Latenz) ab dem ersten KI-Aufruf.
7. **Verschlüsselte Zugangsdaten** (Envelope Encryption) für OAuth-Tokens.
8. **Entitlements statt hart codierter Feature-Prüfungen.** `organization.can("connectors.max", 3)` statt `if (plan === "pro")`. Macht spätere Preismodelle zur Konfiguration.
9. **Internationalisierungsfähigkeit**: UI-Texte über Übersetzungsdateien, Zeitzonen und Währungen als Felder, Geldbeträge als Ganzzahl + ISO-Währung, Sprache pro Nutzer. Sonst nichts davon im MVP.
10. **EU-Datenhaltung** (Datenbank und Modellaufrufe in der EU), siehe Frage F6.

---

## 4. Frage 3 – Modellunabhängigkeit (OpenAI, Anthropic, eigene Modelle)

### Prinzip: Geschäftslogik spricht Aufgaben an, nicht Modelle

Jeder KI-Aufruf läuft über eine benannte **Aufgabe** mit festem Ein- und Ausgabevertrag:

```ts
// Geschäftslogik kennt nur das:
gateway.run("briefing.compose", { facts, signals, preferences })   // → BriefingDraft (Zod-validiert)
gateway.run("memory.extract",   { conversationTurn })              // → MemoryProposal[]
gateway.run("email.triage",     { message })                       // → Triage
gateway.chat("conversation",    { messages, tools })               // → Antwort + Tool-Aufrufe
```

Eine Routing-Konfiguration bestimmt, welches Modell welche Aufgabe erledigt:

```ts
{ "briefing.compose": { primary: "anthropic:<modell>", fallback: "openai:<modell>" },
  "email.triage":     { primary: "selfhosted:<kleines-modell>" } }   // [Später]
```

### Bausteine

| Baustein | MVP | Später |
| --- | --- | --- |
| Interne Schnittstelle (Nachrichten, Tools als JSON-Schema, strukturierte Ausgabe, Streaming) | ✔ | |
| Adapter: Anthropic, OpenAI | ✔ | |
| Adapter: „OpenAI-kompatibel“ (deckt vLLM, Ollama, viele EU-Hoster und selbst betriebene Open-Weight-Modelle ab) | ✔ (billig, da gleicher Code wie OpenAI) | |
| Prompts versioniert im Repo, je Aufgabe | ✔ | |
| Aufruf-Protokoll: Aufgabe, Modell, Prompt-Version, Tokens, Kosten, Latenz, Fehler (ohne Inhalte als Standard) | ✔ | |
| Evaluationssätze je Aufgabe (synthetisch + OKUN-eigene Daten) und Eval-Runner | ✔ klein (20–50 Fälle je Kernaufgabe) | wachsend |
| Fähigkeitsprofile je Modell (Tool-Use, Kontextlänge, strukturierte Ausgabe) | | ✔ |
| Automatisches Routing nach Kosten/Qualität | | ✔ |

**Bewusst nicht** im Geschäftscode: anbieterspezifische Features (z. B. besondere Caching- oder Agenten-Funktionen eines Anbieters). Wo sie Kosten sparen, gehören sie in den Adapter.

**Ob eigene Abstraktion oder Bibliothek** (z. B. Vercel AI SDK): Ich empfehle eine *dünne eigene Schnittstelle*, die intern anfangs ruhig eine solche Bibliothek nutzen darf. Damit hängen wir weder an einem Modellanbieter noch an einer Bibliothek.

**Ein Anbieterwechsel** ist dann: Routing ändern → Eval-Runner für die betroffenen Aufgaben laufen lassen → Qualität, Kosten, Latenz vergleichen → freigeben. Kein blinder Wechsel.

---

## 5. Frage 4 – Ein sicheres, strukturiertes Unternehmensgedächtnis

### 5.1 Drei Wissensarten, drei Speicherformen

| Wissensart | Beispiel | Speicherung |
| --- | --- | --- |
| **Kuratiertes Wissen** | „Wir wollen in 3 Jahren in 2 EU-Länder expandieren“, „Mittwochs keine internen Meetings“ | `memory_item`: strukturiert, mit Provenienz, versioniert |
| **Operative Live-Daten** | Termine, offene Angebote, ungelesene Mails, Umsatz | **Nicht** ins Gedächtnis kopiert. Zum Antwortzeitpunkt über Domäne/Konnektoren abgefragt; Synchronisationskopien tragen `synced_at`. |
| **Dokumentenwissen** | Angebotsvorlagen, Prozessbeschreibungen, Blueprint-Bericht | Semantischer Index (`pgvector`), Rechte werden **vor** der Suche gefiltert |

Gespräche selbst sind **kein** Gedächtnis. Sie haben eine begrenzte Aufbewahrungsfrist. Was aus einem Gespräch dauerhaft relevant ist, wird als **Vorschlag** extrahiert und erst nach Bestätigung zu kuratiertem Wissen. Das ist die verallgemeinerte Learning Queue aus FRANK [Existiert].

### 5.2 Aufbau eines Wissenseintrags

| Feld | Bedeutung | Deckt Anforderung ab |
| --- | --- | --- |
| `kind` | `company_fact`, `goal`, `preference`, `decision`, `plan`, `history_event`, `system_knowledge` | Stabile Infos, Ziele, Vorlieben, Historie, geplante Maßnahmen, offene Entscheidungen |
| `epistemic_status` | `observation`, `assumption`, `hypothesis`, `recommendation`, `confirmed`, `approved_measure`, `implemented` | Annahme vs. bestätigter Fakt; Blueprint-Trennung (Abschnitt 8) |
| `lifecycle` | `proposed`, `active`, `superseded`, `retracted` | Korrigieren und Aktualisieren ohne Geschichtsverlust |
| `scope` | Organisation, Team oder einzelner Nutzer | Persönliche Präferenzen sind nicht firmenweit sichtbar |
| `sensitivity` | `general`, `finance`, `hr`, `customer`, `strategy`, `personal` | Rollen- und KI-Zugriff |
| `allowed_purposes` | z. B. `assistant`, `analytics`, `model_improvement` | Zweckbindung, DSGVO |
| `source_type` / `source_ref` | `user_input`, `conversation`, `connector:google`, `blueprint:<id>@<version>`, `import` | Woher stammt es? |
| `captured_at`, `valid_from`, `valid_until`, `last_verified_at` | Zeitachsen | Wann erfasst, wie aktuell? |
| `confirmed_by`, `confirmed_at` | Person + Zeitpunkt | Wurde es bestätigt? |
| `supersedes_id` | Vorgängerversion | Nachvollziehbare Korrekturen |
| `content` (Text) + `data` (strukturiert, schemaabhängig vom `kind`) | Inhalt | |

**Löschen** ist echtes Löschen: Eintrag, Versionen, Einbettungen und daraus abgeleitete Zusammenfassungen. Im Audit-Log bleibt nur, *dass* gelöscht wurde.

### 5.3 Kontextaufbau („Context Builder“)

Vor jedem KI-Aufruf stellt `memory` den Kontext zusammen, und zwar **mit den Rechten des anfragenden Nutzers** und für einen **konkreten Zweck**. Das Modell sieht nie mehr, als der Nutzer sehen darf. Jedes Kontextelement bekommt eine Referenz-ID.

### 5.4 Belegpflicht technisch erzwingen

Briefings und Analysen werden als strukturierte Ausgabe erzeugt, in der jede Aussage Referenz-IDs auf Kontextelemente trägt. Ein Validator verwirft Aussagen ohne gültige Referenz oder markiert sie sichtbar als „Einschätzung“. **Zahlen werden nie vom Modell erzeugt**, sondern aus Abfragen eingesetzt. Die Oberfläche zeigt zu jeder Aussage die Quellen.

---

## 6. Frage 5 – Integrationsarchitektur (VEKTOR Connect)

### 6.1 Ein Konnektor-Vertrag für OKUN-Produkte und Fremdsysteme

Jeder Konnektor beschreibt sich über ein **Manifest**:

```ts
{
  id: "google-workspace",
  auth: { type: "oauth2", scopes: { calendar_read: [...], gmail_read: [...], gmail_draft: [...] } },
  objects: ["Event", "Message", "Contact"],            // kanonische Geschäftsobjekte
  reads:   [{ name: "calendar.listEvents", input: <JSON-Schema>, sensitivity: "personal" }],
  actions: [{ name: "gmail.createDraft",  risk: "R1", reversible: true },
            { name: "gmail.send",         risk: "R3", reversible: false }],
  sync:    { mode: "webhook+poll", objects: ["Event", "Message"] },
}
```

- **Lesefunktionen** stehen der Orchestrierung als Tools zur Verfügung (mit Nutzerrechten).
- **Aktionen** sind ausschließlich über `actions` (Policy-Engine) erreichbar.
- Tool-Definitionen als JSON-Schema sind kompatibel zum **Model Context Protocol (MCP)**. So können wir später VEKTOR-Konnektoren als MCP-Server anbieten oder externe MCP-Server anbinden, ohne das Modell neu zu bauen. MCP als *Pflicht-Transport* würde ich im MVP nicht einführen.

### 6.2 Kanonische Geschäftsobjekte (bewusst schlank)

`Organization`, `Person`, `Company`, `Deal/Offer`, `Task`, `Event`, `Message`, `Project`, `Employee`, `Shift`, `Invoice`, `Metric`. Kein vollständiges ERP-Modell: nur das, was VEKTOR systemübergreifend verknüpfen muss (z. B. „Angebot ohne Antwort“ = Deal + Message + Event). Jedes Objekt behält `source_system` + `external_id`.

### 6.3 OKUN-Produkte: enger, aber nicht an der Architektur vorbei

Empfehlung für einen **OKUN Integration Contract**, den jedes eigene Produkt erfüllt:

1. Gemeinsame Identität (eine Organisation, ein Login, siehe F3)
2. REST-API mit OpenAPI-Beschreibung für die kanonischen Objekte
3. Ausgehende Webhooks/Events für Änderungen
4. Ein Aktionskatalog mit Risikoklassen

Damit ist ein OKUN-Produkt für VEKTOR einfach ein besonders gut ausgestatteter Konnektor (Echtzeit-Events, tiefere Aktionen, keine OAuth-Hürde). **Keine gemeinsame Datenbank** zwischen den Produkten. Sonst sind sie nicht mehr einzeln verkäuflich und nicht unabhängig weiterentwickelbar.

---

## 7. Sicherheit und Berechtigungen (Abschnitt 10)

| Ebene | MVP | Später |
| --- | --- | --- |
| Mandantentrennung | `organization_id` überall + Postgres RLS; Tests, die Fremdzugriffe aktiv versuchen | eigene Datenbank pro Enterprise-Kunde (optional) |
| Rollen | `owner`, `admin`, `member` + Sensitivitätsklassen je Rolle | feingranulare Rollen, Abteilungsrechte |
| KI-Zugriff | KI handelt immer **im Namen eines Nutzers**, mit dessen Rechten, für einen Zweck | Service-Identitäten für Hintergrund-Agenten mit eigenem Rechteprofil |
| Zugangsdaten | Envelope Encryption, Schlüssel außerhalb der DB, minimale OAuth-Scopes je Funktion | KMS/HSM, Kunden-eigene Schlüssel |
| Prompt Injection | Externe Inhalte als „untrusted“ markiert, nie im System-Prompt; Aktionen aus untrusted Kontext ≥ R2 brauchen Freigabe | Klassifizierer für Injection-Muster |
| Audit | Append-only: wer/was (Nutzer oder VEKTOR), welche Daten genutzt, welche Aktion, welches Ergebnis | Export, Aufbewahrungsrichtlinien je Kunde |
| DSGVO | AVV-Vorlage, Verzeichnis der Verarbeitungstätigkeiten, Löschkonzept, EU-Hosting, Auskunftsexport | EU-AI-Act-Dokumentation je nach Einstufung |

### Aktionssystem (VEKTOR Actions)

**Risikoklassen:**

| Klasse | Beispiel | Höchste mögliche Autonomie |
| --- | --- | --- |
| R0 Lesen | Termine abrufen | automatisch |
| R1 Intern vorbereiten | Entwurf, Aufgabenvorschlag | automatisch |
| R2 Umkehrbar schreiben | Aufgabe anlegen, Kalenderblock setzen, CRM-Feld ändern | Freigabe oder Auto mit Limits |
| R3 Außenwirkung | E-Mail versenden, Termin mit Externen | Freigabe; Auto nur für explizit freigegebene Vorlagen |
| R4 Kritisch | Zahlung, Vertrag, Personalentscheidung, Massenänderung | **immer** Freigabe durch berechtigte Person, ggf. Vier-Augen-Prinzip; nie autonom |

**Policy pro Organisation und Aktionstyp:** `aus` → `nur vorschlagen` → `nach Freigabe ausführen` → `automatisch (mit Limits)`.

**Lebenszyklus einer Aktion:** `vorgeschlagen → freigegeben/abgelehnt → in Ausführung → erledigt/fehlgeschlagen → (rückgängig)`, idempotent, vollständig protokolliert. Das Modell erzeugt nur Vorschläge; ausgeführt wird von deterministischem Code nach Policy-Prüfung.

---

## 8. Frage 6 – Verbindung zu Radar, Blueprint, Solution Engine und Transformation Studio

### Empfehlung: Ein gemeinsames, versioniertes „OKUN Company Model“

Ein JSON-Schema (z. B. `okun.company-model/v1`), das alle Werkzeuge verwenden: Unternehmensstammdaten, Organisationseinheiten, Prozesse (IST/SOLL), Systeme, Datenflüsse, Engpässe, Potenziale, Ziele, Maßnahmen, Roadmap.

- Radar erzeugt einen dünnen Ausschnitt davon, der Blueprint einen vollständigen, das Transformation Studio *liest* ihn, die Solution Engine ergänzt `recommendation`-Einträge, VEKTOR *importiert und begleitet* ihn.
- Jedes Element trägt den **Erkenntnisstatus** aus 5.2. Damit ist die geforderte Trennung strukturell gelöst:

| Prompt-Begriff | `epistemic_status` |
| --- | --- |
| Analysedaten | `observation` (mit Analysedatum) |
| Hypothesen | `hypothesis` / `assumption` |
| Empfehlungen | `recommendation` |
| Bestätigte Unternehmensinformationen | `confirmed` (nur durch den Kunden) |
| Freigegebene Maßnahmen | `approved_measure` |
| Umgesetzte Veränderungen | `implemented` (mit Nachweis/Datum) |

- **Import** = Snapshot speichern (`blueprint_snapshot`, unveränderlich) + Einträge mit `lifecycle: proposed` und `source_ref: blueprint:<id>@<version>` erzeugen. Der Kunde bestätigt im Onboarding, was übernommen wird. **Nichts wird automatisch zur Unternehmenswahrheit.**
- Roadmap-Maßnahmen werden zu `Initiativen` in der Domäne; VEKTOR verfolgt deren Fortschritt und meldet Abweichungen [Später].

**[MVP]:** Nur Erkenntnisstatus + Quelltyp im Datenmodell und ein erster Entwurf des Schemas. **Kein** automatischer Importer. Bei Pilotkunden, die einen Blueprint haben, erfolgt die Übernahme halbautomatisch durch OKUN (Import-Skript + Bestätigung durch den Kunden). Das validiert das Schema an echten Fällen, bevor wir eine Schnittstelle bauen.

Voraussetzung: Ich muss sehen, in welcher Form Blueprint-Daten heute vorliegen (Frage F8). FRANK erwähnt eine „Cloud Code (OKUN Blueprint Platform)“, die nicht in diesem Repository liegt.

---

## 9. Frage 8 – Was ich kritisch hinterfrage oder anders umsetzen würde

1. **„Proaktiv“ zuerst als ruhiger Rhythmus, nicht als Echtzeit-Benachrichtigung.** MVP: ein tägliches Briefing und eine wöchentliche Zielbilanz. Echtzeit-Hinweise erst, wenn wir aus dem Feedback zu Briefings wissen, was Nutzer wirklich relevant finden. Das verhindert die „nervige Benachrichtigungssoftware“ strukturell.
2. **Business Intelligence, Voice und Business Overview mit vielen KPIs: später.** Ohne angebundene Finanz- oder CRM-Daten wären diese Ansichten leer oder (schlimmer) mit Platzhaltern gefüllt.
3. **„Unternehmer allgemein“ ist als Zielgruppe zu breit.** Ich würde mit Geschäftsführern von KMU (10–100 Mitarbeitende) aus dem Agentur-Kundenkreis starten. Dort haben wir Zugang, Vertrauen und idealerweise Blueprint-Daten.
4. **Aufgabenverwaltung nicht neu erfinden.** Ein vollständiges Aufgabensystem konkurriert mit Asana, Todoist, Planner usw. VEKTOR braucht eine schlanke eigene Aufgabenliste (für eigene Vorschläge und Nutzer ohne Tool) und liest perspektivisch bestehende Tools.
5. **Die Suite-Erzählung nicht vor der Suite verkaufen.** VEKTOR muss allein überzeugen. Jedes angebundene OKUN-Produkt ist dann ein Upsell, keine Voraussetzung.
6. **Modellstufen 4–5 sind eine eigene Unternehmensentscheidung.** Sie sollten die heutige Architektur nicht stärker prägen als durch Gateway, Evaluationen und saubere Datenrechte.
7. **Name „VEKTOR“:** vor größerer Investition in Marke/Domain eine Marken- und Kollisionsrecherche durchführen (es gibt bestehende Softwareprodukte mit ähnlichen Namen). Das ist keine Rechtsberatung, nur ein Hinweis auf ein vermeidbares Risiko.

---

## 10. Frage 9 – Der Weg vom KI-Anwender zum Modellbetreiber

| Stufe | Was konkret | Auslöser, um sie zu beginnen |
| --- | --- | --- |
| 1 – APIs nutzen | Anthropic/OpenAI über das Gateway, EU-Region wo verfügbar | jetzt |
| 2 – Modellunabhängigkeit | Aufgaben-Routing, Eval-Runner, Kostenmessung | jetzt, im MVP angelegt |
| 3 – Selbst betrieben | **Kleine, eng umrissene Aufgaben zuerst** (E-Mail-Triage, Klassifikation, Extraktion, Embeddings) mit Open-Weight-Modellen über OpenAI-kompatible Endpunkte bei einem EU-GPU-Anbieter | messbarer Kosten- oder Datenschutzvorteil bei gleicher Eval-Qualität |
| 4 – Spezialisierte Modelle | Feinabstimmung kleiner Modelle für einzelne Aufgaben mit synthetischen, OKUN-eigenen oder **ausdrücklich freigegebenen** Kundendaten | ausreichende, rechtlich saubere Daten + nachweisbarer Qualitätsgewinn |
| 5 – Eigene KI-Plattform | Externe API, ggf. eigene Grundlagenmodelle | eigene Finanzierung und eigenes Team; strategische Einzelentscheidung |

Was heute dafür getan wird und nichts extra kostet:

- **Datenrechte vertraglich vorbereiten:** AVV/AGB mit optionaler, getrennter Einwilligung zur Qualitätsverbesserung. Ohne Einwilligung werden Kundendaten nie für Training genutzt; Mandanten bleiben getrennt.
- **Eval-Datensätze als Firmenvermögen behandeln.** Langfristig ist der verteidigbare Wert weniger das Modellgewicht als Evaluationsdaten, Workflows, Unternehmensmodell und Kundenzugang.
- **Feedback strukturiert erfassen** (Hinweis hilfreich/nicht hilfreich, Entwurf übernommen/geändert). Das ist zugleich Produktmetrik und künftiges Trainingssignal.

---

## 11. Was uns später besonders viel Geld oder Aufwand spart

1. Mandantenfähigkeit + RLS ab der ersten Migration
2. Zentrale OKUN-Identität für alle Produkte
3. Gemeinsames Company Model mit Erkenntnisstatus (Blueprint ↔ VEKTOR)
4. Postgres-only-Stack (pgvector, Queue, Audit) statt fünf Infrastrukturdiensten
5. Model Gateway mit Aufgaben-Routing + Eval-Runner ab dem ersten KI-Aufruf
6. Aktions-/Policy-/Audit-Modell, bevor die erste schreibende Funktion existiert
7. Entitlements statt hart codierter Tarife
8. i18n-Texte, Zeitzonen, Währungsfelder ab Tag 1 (Übersetzungen selbst später)
9. Google-/Microsoft-OAuth-Verifizierung früh beantragen (Vorlaufzeit)
10. EU-Hosting von Anfang an (spätere Migration von Kundendaten ist teuer und erklärungsbedürftig)
