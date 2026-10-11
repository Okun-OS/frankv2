# 04 – Offene Fragen vor der Finalisierung

Jede Frage mit meiner Empfehlung. Die mit ★ markierten blockieren den Start von Abschnitt 0.

## Produkt & Strategie

**F1 ★ Verhältnis FRANK ↔ VEKTOR und Ort des Codes.**
FRANK ist ein Single-User-Prototyp ohne Auth und Mandanten (siehe 01).
*Optionen:* (a) VEKTOR in diesem Repository neu aufbauen und FRANK-Funktionen migrieren, (b) neues Repository `vektor`, FRANK bleibt als internes Werkzeug bestehen, (c) FRANK schrittweise umbauen.
*Empfehlung:* (a) oder (b) mit sauberem neuem Schema. OKUN Systems wird Mandant Nr. 1. (c) nicht, weil jede Tabelle und Route angefasst werden müsste. Läuft FRANK aktuell produktiv und wird täglich genutzt? Dann (b), damit FRANK während des Aufbaus nicht ausfällt.

**F2 ★ Für wen ist das MVP?**
Nur intern (OKUN Systems), interne + 3–5 Agenturkunden als Pilot, oder sofort offener Self-Service?
*Empfehlung:* intern → 3–5 Pilotkunden aus dem Agenturumfeld (idealerweise mit Blueprint). Kein Self-Service im MVP.

**F3 ★ Zentrale OKUN-Identität.**
Haben Workforce, CRM, Mailroom/Mailwin und Deals heute eine Benutzerverwaltung? Welche (eigene, Auth.js, Clerk, Supabase, Keycloak …)?
*Empfehlung:* Eine gemeinsame Identität und Organisationsverwaltung für alle OKUN-Produkte festlegen, bevor ein weiteres Produkt eine eigene baut. Für VEKTOR eine selbst gehostete Bibliothek (EU-Datenhaltung, keine Kosten je Nutzer), Enterprise-SSO später über einen spezialisierten Anbieter ergänzbar.

**F4 Erste Integration: Google Workspace oder Microsoft 365?**
FRANK hat Google-Grundlagen. Im deutschen Mittelstand ist Microsoft 365 aber oft verbreiteter.
*Frage an Sie:* Was nutzen Ihre Pilotkandidaten tatsächlich?
*Empfehlung:* Google zuerst (vorhanden, OKUN nutzt es selbst), Microsoft als Nächstes, falls die Piloten es brauchen.

**F5 Gmail-Zugriff im Pilot.**
Lesender Gmail-Zugriff ist bei Google ein „restricted scope“: Für den produktiven Einsatz über Testnutzer hinaus ist eine Verifizierung mit Sicherheitsprüfung durch einen externen Prüfer nötig (Vorlauf von Wochen, Kosten). Bis dahin ist die Nutzung auf eine begrenzte Zahl von Testnutzern beschränkt.
*Empfehlung:* Pilot mit Testnutzer-Status starten und die Verifizierung parallel beantragen. Alternativ zuerst nur Metadaten/Entwürfe nutzen (andere Scopes). Den aktuellen Stand der Google-Anforderungen prüfe ich vor dem Start nach.

## Technik & Betrieb

**F6 ★ Hosting und Datenresidenz.**
Aktuell Railway. In welcher Region läuft FRANK? Gibt es Vorgaben (z. B. nur deutsche Rechenzentren)?
*Empfehlung:* Datenbank und Anwendung in der EU (Railway-EU-Region oder ein deutscher/europäischer Anbieter). LLM-Aufrufe möglichst mit EU-Datenverarbeitung, entweder über die EU-Angebote der Anbieter oder über Cloud-Plattformen mit EU-Regionen. Das entscheidet auch über die AVV-Kette.

**F7 Stand der übrigen OKUN-Produkte (Phase 2).**
Wo liegen die Repositories von Workforce, CRM, Mailroom/Mailwin, Deals und der Blueprint-Plattform? Welcher Stack, welche APIs, welcher Reifegrad (in Entwicklung / intern genutzt / bei Kunden)?
Ist **DealSky** (Webhook in FRANK) ein eigenes Produkt oder ein Fremdtool?
In dieser Sitzung habe ich nur Zugriff auf `okun-os/frankv2`. Für Phase 2 bräuchte ich Zugriff auf die übrigen Repositories.

**F8 Form der Blueprint-Daten heute.**
Liegen Blueprint-Ergebnisse strukturiert vor (Datenbank, JSON, Formulare) oder als Dokumente/Präsentationen? Gibt es ein Beispiel (anonymisiert), an dem wir das Company Model entwerfen können?

**F9 Team und Kapazität.**
Wer entwickelt neben mir mit? Wer reviewt Code und Sicherheitsfragen? Gibt es einen Zieltermin für den ersten Pilotkunden?
Davon hängen Reihenfolge und Umfang der Abschnitte in 03 ab.

**F10 Design-Grundlagen.**
Gibt es ein OKUN-Designsystem oder Markenrichtlinien (Farbwerte für Navy/Türkis, Schriften, Logo, Komponenten), die in anderen Produkten bereits genutzt werden? Dann übernehmen wir sie statt neu zu gestalten.

## Recht & Geschäftsmodell

**F11 Datenschutz-Verantwortung.**
Gibt es eine Datenschutzbeauftragte Person oder Beratung, die AVV, Verarbeitungsverzeichnis und eine mögliche Datenschutz-Folgenabschätzung (E-Mail- und Personaldaten) begleitet?
*Empfehlung:* vor dem ersten externen Pilotkunden klären.

**F12 Einwilligung zur Qualitätsverbesserung.**
Sollen Pilotverträge bereits eine optionale, getrennte Einwilligung enthalten, anonymisierte/aggregierte Nutzungsdaten für Evaluationen zu verwenden?
*Empfehlung:* ja, als Opt-in. Standard bleibt: keine Nutzung von Kundendaten für Training.

**F13 Ansprache und Sprache.**
Siezt VEKTOR (wie im Briefing-Beispiel) oder duzt er (wie FRANK)? Nur Deutsch im MVP?
*Empfehlung:* „Sie“ als Standard, pro Nutzer umstellbar; Deutsch im MVP, Struktur für weitere Sprachen.
