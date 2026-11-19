# Port Néon

Jeu d'action en monde ouvert en 3D, jouable dans le navigateur, en multijoueur.

**Jouer :** https://oskar59.github.io/port-neon/

## Multijoueur
- Tout le monde arrive dans la salle publique et partage la même ville, l'heure et la météo.
- Salle privée entre amis : ajoute `#salle-nom` à l'adresse, par exemple https://oskar59.github.io/port-neon/#salle-potes
- Chat : touche T. Commandes : `/nom TonPseudo`, `/salle nom`.
- Les échanges passent par le serveur de partie (Cloudflare Worker, dossier `server/`), avec des serveurs MQTT publics en secours.
- Redéployer le serveur : `cd server && npm install && npx wrangler deploy`.

Textures : Poly Haven (CC0) et Three.js (MIT). Moteur : Three.js r160. Réseau : MQTT.js.
