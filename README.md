# Café Morgenlicht — statische Website

Eine einseitige, rein statische Website für ein kleines Café. Sie zeigt den
Namen des Cafés mit Leitsatz im Kopfbereich, eine Speisekarte, die
Öffnungszeiten mit live berechnetem Status, eine Anfahrt-Sektion und ein
Kontaktformular mit clientseitiger Prüfung. Die Website kommt ohne Framework,
ohne Bundler und ohne Build-Schritt aus und läuft über einen einfachen
statischen Server.

## Tech-Stack

- **Markup**: HTML5, eine einzige `index.html`
- **Styling**: CSS3 in getrennten Dateien (`styles.css`, `responsive.css`, `css/*.css`)
- **Logik**: Vanilla JavaScript (ES2020) als native ES-Module unter `js/`
- **Daten**: `data/menu.json`, per `fetch` geladen (Speisekarten-Ticket)
- **Betrieb**: statischer Server, kein Build-Schritt, kein Bundler
- **Tests**: `node --test` für die reinen Logikfunktionen

## Voraussetzungen

- Node.js (nur für die Tests; die Website selbst braucht kein Node)
- Ein statischer Webserver. `file://` funktioniert **nicht**, weil ES-Module
  und `fetch()` über `file://` vom Browser blockiert werden. Die Seite muss
  über HTTP ausgeliefert werden.

## Installieren

Es gibt keine Abhängigkeiten und keinen Build-Schritt. Es ist nichts zu
installieren.

## Starten (Entwicklung und Produktion)

Die Seite wird direkt aus dem Repository-Wurzelverzeichnis ausgeliefert. Der
mitgelieferte kleine statische Server startet genau so, wie es `RUN.json`
beschreibt:

```bash
node server.mjs --port 8000
```

Der Port kann auch über die Umgebungsvariable `PORT` gesetzt werden (Standard
8000). Alternativ tut es jeder andere statische Server, zum Beispiel:

```bash
python -m http.server 8000
```

Danach im Browser öffnen:

```
http://localhost:8000/
```

Ein separater Produktions-Build existiert nicht — die Dateien werden genau so
ausgeliefert, wie sie im Repository liegen.

`RUN.json` beschreibt denselben Start: der Dienst `web` (Stack `web-vite`) im
Wurzelverzeichnis (`dir: "./"`), Startbefehl `node server.mjs --port ${PORT}`,
Health-Pfad `/` und dem Port aus `PORT`. Es werden keine Geheimnisse oder
sonstigen Umgebungsvariablen benötigt.

## Bedienung

Die Seite ist eine einzige, durchgehend scrollbare Seite:

- Die **Navigation** im Kopfbereich springt per Anker zu den Abschnitten
  *Speisekarte*, *Öffnungszeiten*, *Anfahrt* und *Kontakt*.
- Der Link **Speisekarte** lädt die Gerichte aus `data/menu.json`.
- Der Abschnitt **Öffnungszeiten** listet alle sieben Wochentage und zeigt den
  Status `jetzt geöffnet` bzw. `geschlossen`.
- Der Abschnitt **Anfahrt** nennt Adresse und Hinweise und öffnet über einen
  Link eine Kartenansicht in einem neuen Tab.
- Das **Kontaktformular** prüft Name, E-Mail und Nachricht im Browser. Es wird
  nichts an einen Server gesendet; die Eingaben verlassen den Browser nicht.
- Der **Fußbereich** nennt Adresse, Telefonnummer und Kontaktadresse sowie
  Verweise auf Impressum und Datenschutz.

## Funktionen

- Kopfbereich mit Café-Name und Leitsatz (Anker-Navigation)
- Speisekarte aus JSON, nach Kategorien gruppiert, mit Fehlermeldung bei
  Ladefehler
- Öffnungszeiten mit hervorgehobenem heutigen Tag und Live-Status
- Anfahrt mit vollständiger Adresse und Kartenlink (`rel="noopener noreferrer"`)
- Kontaktformular mit clientseitiger Prüfung, ohne Versand
- Datenschutzfreundlich: keine Cookies, kein Tracking, keine Übertragung von
  Formulareingaben
- Responsive: einspaltig auf Handybreite, zentriert und mehrspaltig ab 1024px

## Tests

```bash
node --test
```

Die Tests prüfen die Struktur der `index.html` (Navigationsanker, Container,
Modul-Einbindung) und die Exporte der Feature-Module. Sie berühren kein
Netzwerk und starten keinen Server.
