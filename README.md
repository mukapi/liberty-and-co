# Liberty & Co - Webflow Development

Starter template basé sur [Finsweet Developer Starter](https://github.com/finsweet/developer-starter).

## 🚀 Installation

```bash
pnpm install
```

## 💻 Développement

```bash
# Lance le dev server sur http://localhost:3000
pnpm dev
```

Ensuite, dans Webflow, ajoute ce script dans les paramètres du site :

```html
<script defer src="http://localhost:3000/index.js"></script>
```

Le live reload est activé par défaut - chaque fois que tu sauvegardes un fichier, le site se recharge automatiquement.

## 📦 Build Production

```bash
pnpm build
```

Les fichiers buildés seront dans le dossier `dist/`.

## 📂 Structure

```
liberty-and-co/
├── src/
│   ├── index.ts          # Point d'entrée principal
│   └── utils/
│       └── greet.ts      # Fonctions utilitaires
├── bin/
│   ├── build.js          # Configuration esbuild
│   └── live-reload.js    # Script de live reload
├── dist/                 # Fichiers buildés (généré)
└── package.json
```

## 🔧 Scripts disponibles

- `pnpm dev` - Lance le serveur de développement
- `pnpm build` - Build pour la production
- `pnpm lint` - Vérifie le code avec ESLint et Prettier
- `pnpm lint:fix` - Corrige automatiquement les problèmes
- `pnpm check` - Vérifie les erreurs TypeScript
- `pnpm format` - Formate le code avec Prettier

## 📝 Pattern Webflow

Le code utilise le pattern officiel Webflow pour l'initialisation :

```typescript
window.Webflow ||= [];
window.Webflow.push(() => {
  // Ton code ici
});
```

Cela garantit que ton code s'exécute après l'initialisation complète de Webflow.

## 🎯 Ajouter des fichiers multiples

Pour builder plusieurs fichiers, édite `bin/build.js` :

```javascript
const ENTRY_POINTS = [
  'src/index.ts',      // Global
  'src/home.ts',       // Page Home
  'src/contact.ts',    // Page Contact
];
```

