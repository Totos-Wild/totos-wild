# TotosWild

## https://totos-wild.github.io/totos-wild/

## QR Code
![QR Code](images/qr-code.png "QR Code")

## Bilder hinzufügen
1. In GitHub den products/images ordner anklicken, Datei hinzufügen/Add File anklicken und Bild auswählen
2. Namen in der Excel Tabelle verwenden

## TODO
- SSR Umstellung
- E-Mail Automatisierung 
  - cd /pfad/zu/totos-wild-server
  - composer require phpmailer/phpmailer
  - App-Passwort bei web.de erstellen
  - App-Passwort permanent in ~/.bashrc oder /etc/environment hinzufügen
- bestellte Produkte auto reservieren

## Projektstruktur
Die Ordnerstruktur ist funktionsbasiert organisiert, mit einer bewussten Mischung aus deutschen und englischen Ordnernamen:
- **Deutsche Ordnernamen** für öffentliche URLs (`impressum/`, `datenschutz/`) - für deutsche Nutzer und SEO
- **Englische Ordnernamen** für Code-Bereiche (`base/`, `products/`, `cart/`, `mail/`, `overlays/`) - Standard in der Entwicklung