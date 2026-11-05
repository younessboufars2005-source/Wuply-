# Aperçu Astro en un clic

1. Ouvrir le dossier `wearable-store` dans VS Code.
2. Cliquer sur **Exécuter et déboguer** dans la barre latérale (triangle avec un insecte, ou `Ctrl+Maj+D`).
3. Choisir **Astro — Aperçu dans VS Code** dans la liste du haut, puis cliquer sur le triangle vert. Ensuite, `F5` suffit.

Le serveur Astro démarre sur 4321 puis le navigateur intégré ouvre `/fr/`. Les sauvegardes déclenchent le rechargement à chaud d'Astro. Aucun serveur HTML statique ni extension supplémentaire.

Un serveur de développement de ce même checkout déjà actif est réutilisé. Le lanceur vérifie le client HMR et le fichier package.json de ce chemin précis avant de le réutiliser. Un autre service sur le port 4321 provoque un message d'erreur, sans arrêter ce service ni basculer discrètement vers 4322.

Le bouton rouge **Arrêter** ferme la session navigateur. Le serveur lancé en tâche de fond reste disponible pour les prochains F5. Pour l'arrêter volontairement : **Terminal → Terminer la tâche → Astro : démarrer ou réutiliser le serveur**. Un serveur préexistant n'est jamais arrêté par cette configuration.

Windows : tâche de type `process` lançant directement Node, sans `npm.ps1` ni dépendance à la politique PowerShell. Le navigateur intégré `editor-browser` est fourni avec le VS Code 1.145 installé. Démarrage neuf et réutilisation testés sur un port temporaire ; réutilisation du serveur actuel vérifiée sur 4321 ; conflit avec un autre serveur testé sans l'arrêter. La configuration ne change aucune page, donnée ou règle commerciale.
