# Qualitätskatalog

## Erledigt

- Punktesystem: Masse ist die Grundlage; Kombos und schnelle Siege geben begrenzte Boni.
- Hall of Fame pro Schwierigkeit, dauerhaft per Vercel/Redis gespeichert, mit lokalem Fallback.
- Zuletzt gewählte Schwierigkeit wird beim nächsten Start vorausgewählt.
- KI navigiert aktiv von Rändern und Ecken zurück ins Spielfeld.
- Bosse haben dezente Erkennungsringe und deutlich sichtbare Fähigkeitszustände.
- Sehr schwer: Void Rift verstärkt Jäger und Eliten zeitlich begrenzt.
- Browser-Branding, Mini-Impressum und Vercel-Konfiguration.

## Einmaliger Veröffentlichungs-Schritt

In Vercel über **Storage → Create Database** eine Upstash-Redis-Datenbank verbinden und anschließend neu deployen. Die Zugangsdaten werden automatisch gesetzt.
