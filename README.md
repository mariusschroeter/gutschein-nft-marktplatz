# Gutschein NFT Marktplatz

Im Rahmen meiner Bachelorarbeit habe ich folgenden NFT Marktplatz programmiert:

https://youtu.be/sJQ6pgSlcDA

## Lokal ausprobieren

1. Metamask Browser Extension:
https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn

2. Den Code klonen / herunterladen
3. npm install
4. npx hardhat test
5. npx hardhat node -> Ausgabe gibt Test-Accounts mit 10 000 Ether
6. privaten Schlüssel eines Accounts kopieren und bei Metamask importieren
6. npm run hardhat-localhost -> Ausgabe gibt NFT-Adresse und Marktplatz-Adresse
7. Diese Adressen in der config.js Datei erstetzen
8. npm run dev

Bei Problemen hilft die Dokumentation von hardhat 
https://hardhat.org/tutorial

### Hardhat Konfigurationsdatei einsehen

hardhat.config.js hat die Informationen über die zu verwendeten Netzwerke

### Smart Contracts finden

Unter Contracts findet man den NFT Contract (NFT.sol) und den Marktplatz Contract (NFTMarketplace.sol)
