# Gutschein NFT Marktplatz

Im Rahmen meiner Bachelorarbeit habe ich folgenden NFT Marktplatz programmiert:

https://youtu.be/sJQ6pgSlcDA

## Inhalte der Bachelorarbeit reproduzieren:

### Metamask installieren und Account erstellen

Metamask Browser Extension:
https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn

### Projekt lokal klonen

Das Repository lokal klonen
> git clone https://github.com/mariusschroeter/gutschein-nft-marktplatz \n
> npm install

### Funktionalität testen

> npx hardhat test

### Lokale Blockchain erstellen und Test-Accounts (10000 Eth) erhalten

> npx hardhat node

privaten Schlüssel eines Accounts kopieren und bei Metamask importieren

### Hardhat Konfigurationsdatei einsehen

hardhat.config.js hat die Informationen über die zu verwendeten Netzwerke

### Smart Contracts finden

Unter Contracts findet man den NFT Contract und den Marktplatz Contract.

### Smart Contracts deployen

> npm run hardhat-localhost

### Plattform lokal starten

> npm run dev

Weiteres Vorgehen sollte durch das oben verlinkte Video deutlich werden.
