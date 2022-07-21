# Gutschein NFT Marktplatz

Im Rahmen meiner Bachelorarbeit habe ich folgenden NFT Marktplatz programmiert:

https://youtu.be/sJQ6pgSlcDA

## Lokal ausprobieren (Voraussetung Node.js v14, v16)

1. Metamask Browser Extension installieren und gegebenenfalls eine Wallet erstellen:
https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn
2. Den Code klonen / herunterladen
3. **npm** install
4. **npx** hardhat test (falls es hier Fehler gibt Node.js Version checken; https://hardhat.org/tutorial)
5. **npx** hardhat node -> Ausgabe gibt Test-Accounts mit 10 000 Ether
6. privaten Schlüssel eines Accounts kopieren und bei Metamask **Localhost8545** Netzwerk importieren <img width="689" alt="Bildschirmfoto 2022-07-21 um 14 28 07" src="https://user-images.githubusercontent.com/43613156/180213502-52c3ede6-9758-4e08-906a-910a8084ebe3.png"> <img width="353" alt="Bildschirmfoto 2022-07-21 um 14 31 57" src="https://user-images.githubusercontent.com/43613156/180214111-85151641-5c41-4931-80d6-fc6a08f0caa1.png">
7. In einem neuen Terminal: npm run hardhat-localhost -> Ausgabe gibt NFT-Adresse und Marktplatz-Adresse <img width="612" alt="Bildschirmfoto 2022-07-21 um 14 33 06" src="https://user-images.githubusercontent.com/43613156/180214340-32929abf-e7c0-4240-87bd-4a333616988b.png">
8. Gegebenenfalls diese Adressen in der config.js Datei erstetzen (falls nicht dieselben Adressen wie Ausgabe aus 6.)
9. **npm** run dev
10. Falls das Minten von Token nicht funktioniert: Metamask Account zurücksetzen (Einstellungen -> Erweitert -> Account zurücksetzen)

### Hardhat Konfigurationsdatei einsehen

hardhat.config.js hat die Informationen über die zu verwendeten Netzwerke

### Smart Contracts finden

Unter Contracts findet man den NFT Contract (NFT.sol) und den Marktplatz Contract (NFTMarketplace.sol)
