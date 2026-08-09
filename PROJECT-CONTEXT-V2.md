# Contexte projet — Cockpit Copywriting

> Document de briefing complet pour Claude Code (ou toute IA qui intervient sur ce repo).
> Contient : qui a construit l'outil, pourquoi, à partir de quoi, comment il fonctionne,
> ce que contient le cours source, et ce qui est prévu ensuite.
> Dernière mise à jour : 08/08/2026.

---

## 1. L'auteur

**Christian Legrand Zafindraharo** — marketing digital, audiovisuel, création graphique, sites web, applications, e-commerce Shopify, pédagogie, contenu, copywriting. Travaille en duo avec **Andy** (associé, e-commerce, réseaux sociaux). Actuellement **chef de projet marketing digital chez YAS**.

---

## 2. Pourquoi cet outil a été construit

### Le problème de départ

Christian a **donné une formation de copywriting** en 4 modules / 29 chapitres. Cette formation couvre tout ce qu'il faut savoir pour écrire du contenu qui convertit — avatars, PVU, différenciation, storytelling, formules de rédaction, psychologie de persuasion, titres, garantie, ancrage prix, etc.

Le problème : **savoir ne suffit pas**. Quand on lance un produit ou un service, les 29 chapitres du cours ne se lisent pas dans l'ordre du cours — ils s'*appliquent* dans un ordre précis, dicté par la logique du lancement. Certains chapitres servent en amont (collecter la matière), d'autres au milieu (rédiger), d'autres à la fin (contrôler). Et dans le feu d'un lancement, on oublie des étapes.

### La solution

Construire un **cockpit web** qui réorganise les 29 chapitres non pas dans l'ordre pédagogique du cours, mais dans **l'ordre chronologique d'un lancement** — avec pour chaque chapitre : les questions à se poser, les champs pour noter ses réponses, et une jauge de couverture pour ne rien oublier.

L'outil ne remplace pas le cours. Il est le **plan de chantier** qui dit : à cette étape du lancement, ouvre ce chapitre, réponds à ces questions, remplis ces champs, puis passe à la suivante.

### Ce que ça donne concrètement

Pour chaque lancement (un produit, une formation, une offre de service), l'utilisateur :
1. Crée un projet dans le cockpit
2. Définit ses avatars (le cockpit supporte plusieurs avatars par projet)
3. Remplit les chapitres phase par phase — certains champs sont communs à tout le projet (`fixed`), d'autres se déclinent par avatar (`avatar`), d'autres existent en plusieurs instances (`multi` — ex. plusieurs versions d'une landing page ou de plusieurs accroches)
4. Le cockpit garde tout en mémoire (localStorage) et affiche la progression
5. Quand la matière est remplie, le **Générateur de contenu** l'utilise pour produire des prompts ou des briefs prêts à rédiger, déclinés par plateforme et format

---

## 3. Le cours source — les 29 chapitres

Le cours de copywriting de Christian est structuré en **4 modules** :

| Module | Thème général |
|---|---|
| Module 1 | Fondamentaux de la persuasion |
| Module 2 | Positionnement et marché |
| Module 3 | Structure du message |
| Module 4 | Techniques avancées |

Le cockpit réorganise ces 29 chapitres en **5 phases de lancement**. Voici le mapping complet :

---

### Phase 0 — Recherche & matière première
*Objectif : Tu ne rédiges rien. Tu collectes. 80 % du copywriting se joue ici.*

| Code | Chapitre du cours | Badge | Ce que ça produit |
|---|---|---|---|
| `2-3` | Avatar client | 👤 avatar | Une personne précise, incarnée, qui devient la boussole de tous tes messages |
| `2-3bis` | Recherche terrain (méthode avatar) | 👤 avatar | Des verbatims réels + les regroupements psychographiques du marché |
| `1-4` | Douleur, plaisir et motivation | 👤 avatar | L'équation douleur immédiate / plaisir immédiat / bénéfice futur / douleur de l'inaction |
| `1-7` | Les objections | 👤 avatar | La liste exhaustive des objections + une réponse pour chacune |
| `1-5` | La crédibilité | ⬜ projet | Ta banque de preuves, prête à placer dans le texte |

---

### Phase 1 — Stratégie & architecture
*Objectif : Tu décides. Pas encore un mot de vente : d'abord les choix de structure et de niveau.*

| Code | Chapitre du cours | Badge | Ce que ça produit |
|---|---|---|---|
| `2-1` | PVU — Proposition de valeur unique | 👤 avatar | Ta PVU en une seule phrase, validée par checklist |
| `2-2` | Exemples de PVU (calibrage) | ⬜ projet | 3 PVU modèles pour calibrer la tienne |
| `2-4` | Différenciation | ⬜ projet | Ton avantage compétitif + la stratégie de différenciation retenue |
| `2-5` | Recontextualisation | 👤 avatar | Le nouveau « jeu » dans lequel tu places ton offre |
| `2-6` | Mécanisation | ⬜ projet | Ton mécanisme unique, nommé et incarné |
| `2-7` | Storytelling (matière brute) | ⬜ projet | Ta structure narrative en 6 temps |
| `1-3` | Les niveaux de persuasion | 👤 avatar | Le niveau visé (raison / émotion / identité) + l'ordre d'attaque |
| `1-6` | Le paradoxe du choix | ⬜ projet | Le nombre d'options + le CTA prioritaire unique |
| `1-8` | Page longue ou courte | 🔁 multi | Le format retenu, dérivé des questions du prospect |

---

### Phase 2 — Rédaction
*Objectif : Tu écris, dans l'ordre de lecture. Chaque brique s'appuie sur la matière de la Phase 0.*

| Code | Chapitre du cours | Badge | Ce que ça produit |
|---|---|---|---|
| `3-1` | La formule AIDA | 🔁 multi | Le squelette AIDA du message |
| `3-5` | Problème – Aggraver – Résoudre (PAS) | 🔁 multi | Le squelette PAS quand la douleur porte la vente |
| `3-2` | Le toboggan glissant | ⬜ projet | Le principe de fluidité à tenir sur toute la rédaction |
| `1-9` | Créativité et copywriting | ⬜ projet | Le tri : où appliquer les formules, où innover vraiment |
| `3-3` | Le titre — les 4 U et les power words | 🔁 multi | Ton titre principal, choisi parmi 10 versions minimum |
| `3-4` | Pattern interrupt + effet miroir | 🔁 multi | L'accroche qui arrête le scroll + la reconnaissance immédiate |
| `1-1` | WIIFM — ouverture centrée prospect | 👤 avatar | Une ouverture qui parle de LUI, pas de toi |
| `1-2` | Les 6 principes de Cialdini | 🔁 multi | Les 6 leviers placés et répartis sur toute la page |
| `3-6` | Les bullets qui tuent | 👤 avatar | Tes bullets bénéfices, avec twist et couche émotionnelle |

---

### Phase 3 — Finition & contrôle
*Objectif : Le texte est écrit. Contrôle avant publication. Tant que tout n'est pas coché, tu ne publies pas.*

| Code | Chapitre du cours | Badge | Ce que ça produit |
|---|---|---|---|
| `4-1` | L'histoire de super-héros | ⬜ projet | Ton histoire d'origine, montée en récit |
| `4-2` | Inclusion / Exclusion | ⬜ projet | « C'est pour toi si… / ce n'est pas pour toi si… » |
| `4-3` | La boule de cristal | 👤 avatar | La projection sensorielle de la vie après achat |
| `4-4` | L'ancrage | 🔁 multi | La présentation du prix avec sa référence haute |
| `4-5` | La garantie excessive | 🔁 multi | Le renversement de risque, rendu impossible à ignorer |
| `3-7` | Mise en page — la lisibilité avant la beauté | ⬜ projet | Une page scannable et lisible |
| `QA-1` | Ratio je/vous vérifié | ⬜ QA | Le « vous » domine largement le « je / nous » |
| `QA-2` | Chaque objection a sa réponse | ⬜ QA | Aucune objection de la Phase 0 laissée sans réponse |
| `QA-3` | Chaque promesse est prouvée | ⬜ QA | Aucune affirmation nue |
| `QA-4` | Un seul CTA, clair et répété | ⬜ QA | L'action attendue est évidente |

---

### Les 3 portées de champs

Chaque chapitre a une portée qui détermine comment ses données sont stockées :

| Portée | Icône | Signification | Exemples |
|---|---|---|---|
| `fixed` | ⬜ | Unique au projet — une seule valeur quelle que soit l'avatar | Crédibilité, différenciation, storytelling, mise en page |
| `avatar` | 👤 | Décliné par avatar — une valeur différente par persona | Avatar client, douleurs, objections, PVU, bullets |
| `multi` | 🔁 | Multi-instance — plusieurs versions possibles | Landing page (plusieurs formats), AIDA (plusieurs messages), ancrage (plusieurs offres) |

---

## 4. Le détail de chaque chapitre — champs et questions

### [2-3] Avatar client — *avatar*
**Champs :** identite (Identité de surface) · technique (Compétences / rapport technique) · actuel (Situation actuelle) · besoin_rat (Besoin rationnel) · besoin_emo (Besoin émotionnel) · besoin_id (Besoin identitaire) · peur (Peur principale) · langage (Comment il parle)

### [2-3bis] Recherche terrain — *avatar*
**Champs :** verbatims (Phrases exactes de tes cibles) · groupes (Regroupements psychographiques) · vocab (Vocabulaire client à réutiliser)

### [1-4] Douleur, plaisir et motivation — *avatar*
**Champs :** douleur (Douleur immédiate) · plaisir (Plaisir immédiat) · futur (Bénéfice futur) · inaction (Douleur de l'inaction)

### [1-7] Les objections — *avatar*
**Champs :** obj (Objection → réponse, format liste)

### [1-5] La crédibilité — *projet*
**Champs :** preuve (Preuves sociales / chiffres) · autorite (Autorité / médias / légitimité) · engagement (Relation & engagement préalable)

### [2-1] PVU — *avatar*
**Champs :** probleme (Problème spécifique résolu) · reel (Preuve que le problème est réel) · alternatives (Alternatives actuelles du marché) · ecart (Écart de valeur) · pvu (PVU en une phrase)

### [2-2] Exemples de PVU — *projet*
**Champs :** modele (PVU modèle + ce qui la rend forte, liste)

### [2-4] Différenciation — *projet*
**Champs :** avantage (Avantage et sur quel pilier) · solidite (Temps nécessaire pour te copier) · strategie (Stratégie retenue) · relation (Levier relation)

### [2-5] Recontextualisation — *avatar*
**Champs :** jeu (Le jeu actuel du marché) · cache (Le besoin caché) · pivot (Phrase pivot) · extension (Où l'étendre dans toute la communication)

### [2-6] Mécanisation — *projet*
**Champs :** promesse (Promesse principale) · pourquoi (Pourquoi ça fonctionne) · nom (Nom du mécanisme) · visuel (Visuel / analogie) · autorite (Autorité qui l'adosse)

### [2-7] Storytelling — *projet*
**Champs :** ennemi (L'ennemi) · protagoniste (Le protagoniste) · initiale (Situation initiale) · perturbateur (Élément perturbateur) · climax (Péripéties & climax) · finale (Situation finale)

### [1-3] Les niveaux de persuasion — *avatar*
**Champs :** diagnostic (Diagnostic des arguments actuels) · emotion (Émotion à activer) · identite (Signal identitaire) · justif (Justifications rationnelles, liste)

### [1-6] Le paradoxe du choix — *projet*
**Champs :** offres (Nombre d'offres proposées) · cta (CTA principal unique) · supprime (Ce qu'on supprime)

### [1-8] Page longue ou courte — *multi*
**Champs :** questions (Questions du prospect, chacune = une section) · format (Format retenu + justification)

### [3-1] La formule AIDA — *multi*
**Champs :** action (Action finale visée) · a1 (A — Attention) · i (I — Intérêt / le problème) · d (D — Désir) · a2 (A — Action)

### [3-5] PAS (Problème – Aggraver – Résoudre) — *multi*
**Champs :** vraiprobleme (Le vrai problème dans ses mots) · phrase (Le problème en une phrase) · aggravation (Aggravation — scènes et conséquences, liste) · solution (Transition vers la solution)

### [3-2] Le toboggan glissant — *projet*
**Champs :** charnieres (Charnières à renforcer, liste)

### [1-9] Créativité et copywriting — *projet*
**Champs :** applique (Ce qu'on applique sans réinventer) · angle (Où on prend un vrai risque créatif)

### [3-3] Le titre — *multi*
**Champs :** titres (Versions de titre, 10 minimum, liste) · retenu (Titre retenu + score 4U)

### [3-4] Pattern interrupt + effet miroir — *multi*
**Champs :** schema (Schéma mental à interrompre) · interrupt (Élément d'interruption) · miroir (Effet miroir — description viscérale)

### [1-1] WIIFM — *avatar*
**Champs :** probleme_vecu (Le problème en expérience vécue) · ouverture (Ouverture rédigée) · ratio (Ratio je/vous constaté)

### [1-2] Les 6 principes de Cialdini — *multi*
**Champs :** preuve_sociale · reciprocite · rarete · appreciation · autorite · coherence (pour chacun : où on l'active)

### [3-6] Les bullets qui tuent — *avatar*
**Champs :** bullets (Bullets rédigées : bénéfice + twist + émotion, liste) · ordre (Ordre et emplacement retenus)

### [4-1] L'histoire de super-héros — *projet*
**Champs :** declencheur (Le vrai déclencheur) · scene (Situation initiale — détails sensoriels) · bascule (La bascule) · lien (Lien explicite avec le produit) · histoire (Histoire d'origine rédigée)

### [4-2] Inclusion / Exclusion — *projet*
**Champs :** pourtoi (C'est pour toi si…, liste) · pasfaite (Ce n'est pas pour toi si…, liste) · intensite (Niveau d'intensité 1-3)

### [4-3] La boule de cristal — *avatar*
**Champs :** moments (5 moments post-achat, scènes sensorielles, liste) · geste (Premier geste, 15 premières minutes) · materialisation (Matérialisation visuelle du produit)

### [4-4] L'ancrage — *multi*
**Champs :** reference (Prix de référence naturel du prospect) · ancre (Ancre haute + justification) · methode (Méthode d'ancrage retenue) · raison (Raison pour laquelle le prix est bas)

### [4-5] La garantie excessive — *multi*
**Champs :** conviction (Niveau de conviction réel) · forme (Forme de garantie retenue) · resultat (Résultat mesurable garanti) · process (Processus de remboursement) · bonus (Bonus / inversion qui surprend)

### [3-7] Mise en page — *projet*
**Champs :** notes (Points de mise en page à corriger, liste) · visuels (Visuels prévus)

---

## 5. Ce que le cockpit fait en plus du pipeline

### Enquête Terrain (vue pleine page, avant Phase 0)

Un module dédié à la collecte de matière brute *avant* même de remplir les chapitres avatar. Structure :

- **Entretiens** : 3 canaux (en personne, téléphone, mail) — prise de notes + synthèse
- **Sondage** : réponses brutes, tri automatique, surligneur d'ultra-répondants (~15 % les plus engagés)
- **Sources passives** : forums, avis, commentaires — avec tags
- **Vocabulaire** : agrégateur de mots et expressions clients à réutiliser tels quels
- **Groupes psychographiques** : regroupement des profils par motivation/comportement

### Formule Strike (vue pleine page, après Phase 3)

56 formules d'accroche issues du copywriting professionnel, organisées en 6 catégories :

| Catégorie | Mécanique | Nombre |
|---|---|---|
| Douleur / Problème | Attaque par la frustration | 12 |
| Résultat / Promesse | Attaque par le bénéfice | 12 |
| Audience ciblée | Identification immédiate | 8 |
| Autorité / Preuve sociale | Validation externe | 9 |
| Différenciation / Repositionnement | Contre la concurrence | 8 |
| Transition / Invitation à l'action | CTA intégré | 7 |

Pour chaque catégorie : un **guide d'utilisation** (✓ où l'utiliser / ✗ où éviter, positionnement dans le funnel) + un **instanciateur de variables** (tu remplis les blancs, la formule se génère).

### Générateur de contenu (modal)

Après avoir rempli les chapitres, l'utilisateur génère des contenus déclinés pour les réseaux sociaux. Le flux :

1. **Plateforme** → 2. **Format natif** → 3. **Avatar** → 4. **Schéma** → 5. **Ingrédients** → 6. **Prompt ou brief**

**248 schémas** répartis sur 6 plateformes / 22 formats, chacun avec :
- Un `axis` (Awareness / Conversion / Nurture)
- Un `desc` (description de la mécanique)
- Des `beats` (ossature narrative à suivre)
- Des `needs` (types d'ingrédients requis)

**Le sélecteur d'ingrédients** est la fonctionnalité clé : quand un schéma déclare `needs: ["douleur", "objection"]`, le cockpit va lire les champs correspondants dans les chapitres `1-4` et `1-7`, filtre sur l'avatar sélectionné, et affiche uniquement les valeurs que l'utilisateur a réellement remplies. Le prompt généré contient donc la matière réelle du projet — pas des placeholders génériques.

**16 ingrédients mappés** dans `INGREDIENT_MAP` :

| Ingrédient | Chapitre source | Champ(s) |
|---|---|---|
| douleur | 1-4 | douleur |
| inaction | 1-4 | inaction |
| futur | 1-4 | futur |
| plaisir | 1-4 | plaisir |
| objection | 1-7 | obj |
| credibilite | 1-5 | preuve, autorite, engagement |
| pvu | 2-1 | pvu |
| differentiation | 2-4 | avantage, strategie, relation |
| recontextualisation | 2-5 | pivot, cache, jeu |
| mecanisme | 2-6 | nom, promesse, pourquoi, visuel |
| histoire | 4-1 | histoire |
| resultat | 4-3 | moments, geste, materialisation |
| garantie | 4-5 | forme, resultat, process, bonus |
| ancrage | 4-4 | ancre, methode, raison, reference |
| inclusion | 4-2 | pourtoi, pasfaite |
| storytelling | 2-7 | ennemi, protagoniste, initiale, perturbateur, climax, finale |

---

## 6. Architecture technique

**Stack** : React 18 + Vite, JavaScript pur, CSS 100 % custom (pas de Tailwind, pas de lib UI), `localStorage` (clés `cw4_*`).

**Fichier** : monolithique par choix — tout dans `cockpit-copywriting_9.jsx` (~4 300 lignes). Le monolithique facilite les itérations dans Claude sans gérer des imports inter-fichiers.

**Structure de données par projet** :
```js
{
  avatars: [{ id, name }],   // liste des avatars nommés
  fixed:   { "2-4": { notes: {}, lists: {} } },    // chapitres projet
  avatar:  { "1-4": { "av-id": { notes:{}, lists:{} } } }, // chapitres par avatar
  multi:   { "4-4": [{ id, label, notes:{}, lists:{} }] }, // chapitres multi-instance
  checks:  { "2-3": true },  // cases cochées
  ui:      { multi: {} },    // état UI local (collapsed, etc.)
  terrain: { entretiens:{}, sondage:[], autres:[], vocabulaire:[], regroupements:[] }
}
```

**Navigation** : sidebar avec trois zones distinctes —
- Outil "Enquête terrain" (avant le pipeline, style bouton card)
- Pipeline P0 → P4 (phases de lancement)
- Outil "Formule Strike" (après le pipeline, style bouton card)

Le Générateur de contenu est la seule modale — s'ouvre par un bouton en bas de sidebar.

**Persistance** : `window.storage` en artefact Claude, `localStorage` en local (via `src/storage.js` pour le portage).

---

## 7. Inventaire de la v9 (version actuelle)

| Élément | Valeur |
|---|---|
| Lignes de code | 4 313 |
| Phases de lancement | 5 (P0 → P4) |
| Étapes du pipeline | 33 (29 chapitres + 4 QA) |
| Plateformes dans le générateur | 6 |
| Formats | 22 |
| Schémas | 248 |
| Formules Strike | 56 |
| Catégories Strike | 6 |
| Ingrédients mappés | 16 |
| Composants React | 17 |
| Classes CSS | ~260 |

---

## 8. Fichiers du projet

| Fichier | Rôle |
|---|---|
| `cockpit-copywriting_9.jsx` | Source de vérité v9 — vierge (sans données) |
| `cockpit-test.jsx` | Variante avec seed Growth Circle pré-rempli (5 avatars, 29 chapitres) — clés `gct_*` |
| `PROMPT-CLAUDE-CODE.md` | Instructions de portage local (Vite + localStorage) |
| `PROJECT-CONTEXT.md` | Version courte du contexte (deprecated → utiliser ce fichier) |
| `PROJECT-CONTEXT-V2.md` | Ce fichier — contexte complet |

---

## 9. Règles de développement

### Invariants — ne jamais toucher

- **Pas de refactoring** sans raison explicite — monolithique par choix
- **Pas de Tailwind**, pas de lib UI — CSS custom dans la constante `CSS` en bas du fichier
- **Pas de TypeScript** — JS pur
- **Pas de `<React.StrictMode>`** — provoque un double montage, crée des projets en double au lancement
- **Pas de données pré-remplies** dans le fichier de base — l'app démarre avec un projet vide « Mon premier lancement »
- **Pas de `window.storage`** en local — remplacé par `src/storage.js` sur localStorage

### Règles pour les ajouts

1. **Tout ajout de schéma** nécessite : un `id` unique (format `plateforme-format-slug`), un `axis` valide (Awareness/Conversion/Nurture), au moins 3 `beats`, des `needs` tous présents dans `INGREDIENT_MAP`
2. **Tout ajout d'ingrédient** dans `INGREDIENT_MAP` doit pointer vers un `code` de chapitre réel ET des `fields` qui existent réellement dans ce chapitre — valider avec le script d'audit
3. **Tout nouveau chapitre** doit avoir un `badge` cohérent avec son usage (fixed/avatar/multi)
4. **Le générateur de contenu reste une modale** — pas une vue pleine page
5. **La navigation latérale** accueille les outils principaux (Terrain + Strike) — les modales sont pour les actions ponctuelles (Générateur, Export brief)

### Script de validation (à exécuter avant tout commit)

```js
// Vérifie : 0 doublon d'id, tous les needs mappés, tous les champs existent
// Voir le script complet dans /tmp/v3.mjs ou le reconstruire depuis cockpit-copywriting_9.jsx
node check.mjs
```

Les valeurs de référence à vérifier :

| Contrôle | Valeur attendue v9 |
|---|---|
| Schémas (axis:) | 248 |
| ids dupliqués | 0 |
| needs sans mapping | 0 |
| ingrédients sans usage | 0 |
| Plateformes | 6 |
| Formats | 22 |
| Formules Strike | 56 |
| Étapes pipeline | 33 |

---

## 10. Ce que le cockpit n'est PAS

- Ce n'est pas un éditeur de texte — les champs servent à noter la *matière*, pas à rédiger le contenu final
- Ce n'est pas un outil collaboratif — conçu pour un usage solo, stockage local
- Ce n'est pas un CMS ou un outil de publication — il prépare le brief, l'utilisateur rédige ailleurs
- Ce n'est pas un cours interactif — le cours est séparé, le cockpit est le plan de chantier pour *appliquer* le cours

---

## 11. Ce qui est planifié

### Validé — à développer

- **Portage local (Vite + localStorage)** — voir `PROMPT-CLAUDE-CODE.md`
- **Hébergement** — Lovable (ou équivalent), accès depuis n'importe quel navigateur

### Évoqué — non décidé, ne pas implémenter sans validation

- Connexion API Claude dans le générateur (générer le contenu directement, sans copier-coller le prompt)
- Export brief vers Notion / Google Docs
- Calendrier éditorial intégré
- Versioning des projets
- Instance dédiée Growth Circle (cockpit pré-configuré avec la charte éditoriale comme fondation permanente)

### Hors scope — jamais

- Authentification / comptes utilisateurs
- Mode collaboratif multi-utilisateurs
- Monétisation de l'outil lui-même
