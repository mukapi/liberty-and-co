# Liberty & Co

Site vitrine avec animations GSAP pour Webflow.

**Ultra-simple : un seul fichier JavaScript, zéro dépendance npm.**

## 📂 Structure

```
liberty-and-co/
└── index.js          # Toutes les animations GSAP
```

## 🚀 Utilisation dans Webflow

Dans les paramètres de ton site Webflow, ajoute ce script dans la section **Custom Code** (avant `</body>`) :

### Option 1 : Depuis GitHub Pages

```html
<script defer src="https://TON-USERNAME.github.io/liberty-and-co/index.js"></script>
```

### Option 2 : Upload direct dans Webflow

1. Va dans **Settings → Custom Code**
2. Upload le fichier `index.js`
3. Ajoute le script :

```html
<script defer src="/index.js"></script>
```

## 🎨 Animations disponibles

Toutes les animations utilisent GSAP et ScrollTrigger (déjà inclus dans Webflow).

### Attributs data à ajouter sur tes éléments :

- **`data-animate="fade-up"`** - Fade in depuis le bas
- **`data-animate="fade-left"`** - Fade in depuis la gauche
- **`data-animate="fade-right"`** - Fade in depuis la droite
- **`data-animate="scale"`** - Scale + fade in
- **`data-animate-stagger`** - Container pour animation décalée
  - Ajoute `data-animate-item` sur chaque enfant
- **`data-parallax`** - Effet parallax
  - Ajoute `data-parallax-speed="0.5"` pour ajuster la vitesse

### Animation méthode (sections qui apparaissent 1 par 1)

Classes à utiliser dans Webflow :
- **`.method_list`** - Container principal (doit avoir position: sticky)
- **`.method_item`** - Chaque étape
- **`.method_line_inner`** - Lignes animées qui grandissent

**Note** : Cette animation fonctionne uniquement sur desktop (992px et plus).

## 📝 Comment ça marche ?

Le code utilise le pattern officiel Webflow pour s'assurer que les animations se chargent après l'initialisation de GSAP :

```javascript
window.Webflow ||= [];
window.Webflow.push(() => {
  // Animations initialisées ici
});
```

## 🛠️ Technologies

- JavaScript vanilla (ES6)
- GSAP + ScrollTrigger (fourni par Webflow)
- Aucune dépendance npm
