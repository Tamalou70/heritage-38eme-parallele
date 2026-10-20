# L’Héritage du 38ème Parallèle

Bande dessinée interactive en français : **10 planches, 40 illustrations et 60 séquences parlées**.

Les illustrations, bordures, bulles et textes sont séparés en HTML, CSS et JavaScript. Les voix sont des MP3 locaux, sans service externe nécessaire à la lecture.

## Lire la BD

- **Lecture auto** : écouter la phrase affichée, puis avancer à la fin de chaque piste.
- **Pause** ou **Échap** : arrêter la voix et l’avancement.
- **Espace** : écouter la première phrase, puis avancer aux suivantes.
- **Flèches gauche/droite** : revenir ou avancer.

Le son démarre uniquement après une action du lecteur. Changer d’onglet met la lecture en pause. La position est mémorisée dans le navigateur.

## Développement

Site statique sans étape de compilation. Ouvrir `index.html` ou lancer :

```sh
python -m http.server 8000
```

- `story.js` : planches, illustrations et textes.
- `voices.js` : association des phrases avec leurs rôles, timbres et MP3.
- `app.js` : navigation et synchronisation audio.
- `style.css` : mise en page et bulles.
- `illustrations/` : images de la BD.
- `audio/` : 60 fichiers MP3.

## Voix

Narrateur : 33 séquences françaises générées avec Chatterbox, avec la voix validée. Personnages : les 27 séquences Qwen3-TTS Base 1.7B restent inchangées. Les timbres synthétiques originaux ont été conçus avec Qwen VoiceDesign dans Voicebox. Six timbres pour dix-neuf rôles ; certains personnages secondaires partagent un timbre. Le narrateur lit aussi l’annonce de quarantaine.

## Publication

GitHub Pages publie la racine de la branche `main`. Le fichier `.nojekyll` permet la diffusion directe des fichiers statiques.
