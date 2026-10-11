# PROJEKT VEKTOR – Der digitale Geschäftspartner

Arbeitsdokumentation für die Entwicklung von VEKTOR, dem intelligenten Kern der OKUN Business Suite.

> Status: **Phase 1 (strategische und technische Konzeption), Entwurf zur Abstimmung.** Es wurde noch kein Code geschrieben. Die hier beschriebenen Architekturentscheidungen sind Empfehlungen.
> Verbindlich werden sie erst, wenn die offenen Fragen in [04-offene-fragen.md](./04-offene-fragen.md) geklärt sind.

## Dokumente

| Nr. | Dokument | Inhalt |
| --- | --- | --- |
| 01 | [Ist-Analyse](./01-ist-analyse.md) | Was in diesem Repository (FRANK OS) bereits existiert und was davon für VEKTOR taugt |
| 02 | [Einschätzung & Architektur](./02-einschaetzung-architektur.md) | Stärken, Risiken, Modulschnitt, Model Gateway, Gedächtnis, Berechtigungen & Aktionen, Integrationen, Blueprint, Weg zu eigenen Modellen |
| 03 | [MVP & Roadmap](./03-mvp.md) | Was das erste produktionsfähige VEKTOR kann – und was bewusst nicht |
| 04 | [Offene Fragen](./04-offene-fragen.md) | Entscheidungen, die wir gemeinsam treffen müssen, jeweils mit meiner Empfehlung |

## Leitprinzipien

1. **Keine erfundenen Fakten.** Jede Aussage von VEKTOR ist auf eine Quelle zurückführbar oder als Annahme gekennzeichnet.
2. **Gedächtnis ist kuratiert, nicht protokolliert.** Gespeichert wird, was bestätigt oder ausdrücklich gewollt ist – mit Herkunft, Zeitpunkt und Status.
3. **Das Sprachmodell entscheidet nie allein über Aktionen.** Es *schlägt* Aktionen vor; ausgeführt wird ausschließlich durch eine Policy-Engine, die Berechtigungen, Risikostufe und Freigaben prüft.
4. **Mandantenfähig ab Tag 1.** Jede Zeile gehört genau einer Organisation. Nachträglich eingebaute Mandantentrennung ist teuer und riskant.
5. **OKUN-Produkte und Fremdsysteme über dieselbe Konnektor-Schnittstelle.** Eigene Produkte werden tiefer integriert, aber nicht an der Architektur vorbei.
6. **Relevanz vor Menge.** Proaktive Hinweise werden bewertet, gebündelt und nur bei echtem Nutzen zugestellt.
7. **Schrittweise Autonomie.** Stufe A (Verstehen) → B (Empfehlen/Vorbereiten) → C (Autorisiert handeln) – pro Aktionstyp und pro Organisation einzeln freischaltbar.
