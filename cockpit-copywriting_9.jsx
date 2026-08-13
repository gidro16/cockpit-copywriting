import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

// Données PIPELINE — extraites du cours source (4 modules, 29 chapitres + 4 QA)
const PIPELINE = [
  {
    id: "p0", tag: "Phase 0", name: "Recherche & matière première",
    goal: "Tu ne rédiges rien. Tu collectes. 80 % du copywriting se joue ici : c'est la matière que tu vas assembler ensuite.",
    steps: [
      {
        code: "2-3", type: "chap", title: "Avatar client", badge: "avatar",
        produces: "Une personne précise, incarnée, qui devient la boussole de tous tes messages",
        when: "Toujours en premier. Tu n'écris rien tant que cet avatar n'existe pas.",
        concept: "Plus tu écris pour un large public, moins tu touches quelqu'un. Plus tu écris pour une personne précise, plus tu touches un grand nombre. L'avatar est un personnage imaginaire mais incarné avec une précision extrême. Une fois qu'il existe dans ta tête, ton écriture devient automatiquement précise, personnelle et émotionnelle — sans effort supplémentaire. Attention : un avatar n'est pas une cible publicitaire. La cible sert à afficher tes pubs ; l'avatar sert à écrire tes messages.",
        q: [
          "Identité : prénom, âge, situation pro (poste, secteur, taille), situation perso.",
          "Rapport à la technique, aux chiffres, expérience dans ton domaine.",
          "Situation actuelle : son quotidien, ses succès, ses frustrations, ce qu'il a déjà essayé.",
          "Besoin profond sur 3 niveaux : rationnel (ce qu'il cherche) / émotionnel (ce qu'il ressent) / identitaire (qui il veut devenir).",
          "Peur profonde : pire scénario redouté, ce dont il a honte, ce qui l'empêche de dormir.",
          "Objections : pourquoi il hésiterait, ce qu'il a raté avant, ce que son entourage lui dirait.",
          "Langage : ses mots à lui, le jargon qu'il connaît, les mots qui le braquent.",
        ],
        errors: [
          "Rester dans les critères sociodémographiques — l'âge, le sexe, la ville ne suffisent pas à écrire une phrase.",
          "Utiliser « les PME » ou « les entrepreneurs » comme avatar — c'est un marché, pas une personne.",
          "Construire un avatar depuis ton bureau sans avoir parlé à personne — tu projettes tes propres biais.",
          "N'avoir qu'un seul avatar quand ton produit en a plusieurs — tu perds les 2/3 de ta cible réelle.",
          "Aller trop en surface — « augmenter ses ventes » ne dit rien de la psychologie derrière.",
          "Ne pas différencier rationnel, émotionnel et identitaire — les trois doivent apparaître.",
        ],
        linked: ["2-3bis", "1-4", "3-4"],
        fields: [
          { k: "identite", label: "Identité de surface", ph: "Prénom fictif · âge · poste précis (pas « entrepreneur » — « fondateur d'une agence SEO de 3 personnes ») · secteur · situation perso (célibataire, 2 enfants, etc.) — assez de détails pour le visualiser dans une pièce" },
          { k: "technique", label: "Compétences / rapport technique", ph: "Il se débrouille seul ou il délègue tout ? Il connaît déjà les bases ou il part de zéro ? A-t-il déjà acheté une formation sur ce sujet ? Quel est son niveau de confort avec les chiffres, les outils, le jargon du domaine ?" },
          { k: "actuel", label: "Situation actuelle", ph: "À quoi ressemble sa journée type ? Qu'est-ce qui l'énerve le plus en ce moment ? Qu'a-t-il déjà essayé pour régler le problème — et pourquoi ça n'a pas marché ?" },
          { k: "besoin_rat", label: "Besoin rationnel", ph: "Ce qu'il cherche concrètement : un résultat mesurable, un chiffre, un délai. Ex : « passer de 2k à 5k€/mois d'ici 6 mois sans recruter »" },
          { k: "besoin_emo", label: "Besoin émotionnel", ph: "Ce qu'il ressent en ce moment et ce qu'il veut ne plus ressentir. Ex : « la honte de ne pas réussir à vivre de son activité » ou « la fatigue de travailler autant pour si peu »" },
          { k: "besoin_id", label: "Besoin identitaire", ph: "Qui il veut devenir — pas juste ce qu'il veut avoir. Ex : « être quelqu'un que son entourage considère comme un expert » ou « ne plus avoir à se justifier de son choix de vie »" },
          { k: "peur", label: "Peur profonde", ph: "Le pire scénario qu'il s'imagine la nuit. Ce dont il a honte et qu'il ne dit pas à voix haute. Ce qui le paralyse au moment de passer à l'action. Ex : « investir encore et que ça ne marche toujours pas »" },
          { k: "langage", label: "Son langage exact", ph: "Les mots précis qu'il utilise pour décrire son problème — pas ton jargon d'expert, le sien. Les expressions qui le braquent (« tunnel de vente », « scalable »…). Les mots qui le font se reconnaître immédiatement." },
        ],
      },
      {
        code: "2-3bis", type: "chap", title: "Recherche terrain (méthode avatar)", badge: "avatar",
        produces: "Des verbatims réels + les regroupements psychologiques de ton marché",
        when: "Juste après l'avatar. Va chercher SES mots exacts, pas les tiens.",
        concept: "80 % du travail de copywriting, c'est de construire la proposition de valeur — et une grande partie de ce travail, c'est d'aller chercher l'information dans le cerveau de ton prospect. Presque personne ne le fait correctement. C'est précisément pour ça que tu peux te tailler une place, même sur un marché saturé, si tu vas plus profond que tes concurrents dans la compréhension de ta cible. Le vocabulaire que tu récoltes est ton actif copywriting le plus précieux.",
        q: [
          "Parle à 10-15 personnes du marché : 3 questions ouvertes, laisse parler, enregistre si possible.",
          "Lance un sondage : 3 questions ouvertes maximum, une contrepartie raisonnable, objectif 100-300 réponses.",
          "Analyse : tague les répondants, identifie 2 à 4 regroupements psychologiques distincts.",
          "Extrait le vocabulaire client mot pour mot. Repère les ultra-répondants (ceux qui écrivent des pavés).",
        ],
        errors: [
          "Poser des questions fermées sur un petit échantillon — tu n'apprendras rien d'utile.",
          "Demander « seriez-vous intéressé » sans jamais tester une vraie décision d'achat.",
          "Utiliser ton jargon d'expert au lieu du vocabulaire de ton marché.",
          "Poser trop de questions dans un sondage — plus tu en mets, moins tu apprends.",
          "Tirer des conclusions sur 5 réponses — en dessous de 100 répondants, sois humble.",
          "Offrir une contrepartie trop attractive — tu attires des non-qualifiés qui polluent tes données.",
          "Oublier d'archiver le vocabulaire récolté — c'est ton actif le plus précieux.",
        ],
        linked: ["2-3"],
        fields: [
          { k: "verbatims", label: "Verbatims — phrases exactes de tes cibles", ph: "Colle la phrase mot pour mot, telle qu'elle a été dite ou écrite. Pas de reformulation, pas d'amélioration. Ex : « j'ai l'impression de faire du sur-place depuis 2 ans malgré tout ce que j'essaie »", repeat: true, min: 5 },
          { k: "groupes", label: "Regroupements psychologiques (2 à 4)", ph: "Un profil psychologique distinct par ligne — pas des critères démographiques, mais une posture mentale. Ex : « les expérimentés qui ont tout essayé et ne croient plus en rien » · « les débutants motivés qui manquent de méthode »", repeat: true, min: 2 },
          { k: "vocab", label: "Vocabulaire client à réutiliser", ph: "Mots et tournures récurrents dans leurs réponses — à réinjecter tels quels dans tes textes. Ex : « galérer à », « en avoir marre de », « enfin comprendre »", repeat: true, min: 3 },
        ],
      },
      {
        code: "1-4", type: "chap", title: "Douleur, plaisir et motivation", badge: "avatar",
        produces: "L'équation douleur immédiate / plaisir immédiat / bénéfice futur",
        when: "Une fois l'avatar connu. Cartographie ce qui le fait bouger.",
        concept: "Toute action humaine repose sur deux moteurs : obtenir du plaisir, éviter la douleur. Mais ce n'est pas la réalité qui décide — c'est la perception immédiate. Et cette perception se joue presque toujours dans le présent. Ton prospect ressent la douleur du présent (le prix, l'effort) beaucoup plus fort que les bénéfices futurs. Ton travail : rendre le futur concret, augmenter la douleur de l'inaction, réduire la douleur d'achat, amplifier le plaisir immédiat.",
        q: [
          "Quelle est la douleur immédiate ? (ce qu'il doit donner ou faire maintenant : prix, effort, temps)",
          "Quel est le plaisir immédiat ? (ce qu'il ressent au moment même d'agir)",
          "Quel est le bénéfice futur ? (ce qu'il imagine obtenir plus tard)",
          "Quelle est la douleur de l'inaction ? (ce qui se passe s'il ne fait rien)",
        ],
        errors: [
          "Expliquer sans faire ressentir — la logique seule ne motive jamais.",
          "Parler du futur sans le rendre concret — tant qu'il n'est pas visualisé, il n'existe pas.",
          "Ignorer la douleur immédiate — si tu ne la traites pas, elle gagne.",
          "Croire que la logique suffit — c'est l'erreur la plus coûteuse en copywriting.",
        ],
        linked: ["2-3", "4-3"],
        fields: [
          { k: "douleur", label: "Douleur immédiate", ph: "Ce qu'il ressent au moment d'agir : le prix (trop cher ?), l'effort à fournir, le temps perdu, le risque de se tromper encore. C'est ce qui retient son doigt sur le bouton d'achat. Ex : « 500€ c'est tout mon budget du mois » ou « j'ai déjà payé 3 formations qui n'ont rien changé »" },
          { k: "plaisir", label: "Plaisir immédiat", ph: "La sensation qu'il ressent dans les secondes qui suivent l'achat — pas dans 6 mois. Ex : « le soulagement d'avoir enfin pris la décision » · « la fierté de passer à l'action » · « l'excitation d'ouvrir la première leçon »" },
          { k: "futur", label: "Bénéfice futur", ph: "Ce qu'il s'imagine obtenir plus tard — mais rends-le concret et daté. Pas « une meilleure vie » mais « dans 3 mois, il peut quitter son job » ou « à la fin du mois, sa première vente en ligne »" },
          { k: "inaction", label: "Douleur de l'inaction", ph: "Ce qui se passe concrètement s'il ne fait rien aujourd'hui. Dans 6 mois, dans 1 an. Ex : « il sera au même point, avec les mêmes excuses, la même frustration — et il aura perdu une année »" },
        ],
      },
      {
        code: "1-7", type: "chap", title: "Les objections", badge: "avatar",
        produces: "La liste exhaustive des objections + une réponse pour chacune",
        when: "Liste-les TOUTES maintenant. Tu y répondras en Phase 2.",
        concept: "Une vente ne se perd presque jamais par manque d'arguments. Elle se perd parce qu'une objection reste sans réponse. Une seule objection — même apparemment insignifiante — peut suffire à tuer la vente, même si tout le reste de ta page est excellent. Les objections ne disparaissent pas si tu les ignores : elles font juste partir le prospect. Et la plupart sont émotionnelles, pas logiques : réponds au bon niveau.",
        q: [
          "Sors-en 10 minimum. Inclus les objections « stupides » — souvent les plus importantes.",
          "Traite-les une par une, explicitement. Jamais en sous-entendu.",
          "Réponds au bon niveau : identitaire → identité, émotionnelle → émotion, logique → logique.",
          "Vérification finale : « Reste-t-il une raison crédible de ne pas acheter ? »",
        ],
        errors: [
          "Ignorer les objections — elles ne disparaissent pas, elles font partir le prospect.",
          "Répondre uniquement avec de la logique — la plupart des objections sont émotionnelles.",
          "Traiter les objections en sous-entendu — il faut les nommer pour les désamorcer.",
          "Éviter les sujets sensibles — c'est exactement là que sont les vraies objections.",
          "Croire que ton produit suffit — même le meilleur produit ne se vend pas s'il reste une objection non traitée.",
        ],
        linked: ["2-3", "1-5"],
        fields: [
          { k: "obj", label: "Objection → ta réponse", ph: "Format : « C'est trop cher » → « Comparé à quoi ? Un coach à 200€/h te coûterait 10x plus pour le même résultat. » · Liste les objections « stupides » aussi — ce sont souvent les vraies", repeat: true, min: 10 },
        ],
      },
      {
        code: "1-5", type: "chap", title: "La crédibilité", badge: "fixed",
        produces: "Ta banque de preuves, prête à placer dans le texte",
        when: "Rassemble tes preuves avant d'écrire, sinon tu bluffes.",
        concept: "Une promesse ne vaut que si elle est crue. La règle fondamentale : ta crédibilité doit toujours être supérieure à ta promesse. Plus tu es crédible, plus tu peux promettre haut. Moins tu l'es, plus même une bonne promesse semblera douteuse. La crédibilité se construit sur cinq leviers : la première impression, la preuve sociale, la relation, l'engagement préalable et le renversement du risque.",
        q: [
          "Est-ce que je semble crédible immédiatement ? (design, première impression)",
          "Qui prouve que je suis crédible ? (preuve sociale, médias, témoignages, chiffres)",
          "Le prospect m'apprécie-t-il ? (relation préalable, contenu, ton humain)",
          "A-t-il déjà pris un engagement avec moi ? (produit d'appel, micro-action)",
          "Qui porte le risque ? (garantie, renversement)",
        ],
        errors: [
          "Faire des promesses trop fortes sans preuve — tu décrédibilises toute ta page.",
          "Négliger la première impression — un design amateur tue la suite avant qu'elle commence.",
          "Rester impersonnel — la crédibilité passe par la perception d'authenticité.",
          "Vendre sans relation préalable — tu demandes plus que ce que ta relation autorise.",
          "Laisser tout le risque au prospect — c'est l'assurance d'une méfiance maximale.",
        ],
        linked: ["1-2", "4-5"],
        fields: [
          { k: "preuve", label: "Preuves sociales / témoignages / chiffres", ph: "Préfère les résultats mesurables aux compliments. Ex : « Rija a décroché son premier client 11 jours après avoir appliqué le chapitre 3 » plutôt que « super formation ! »", repeat: true, min: 3 },
          { k: "autorite", label: "Autorité / médias / légitimité", ph: "Pédigrée précis (« j'ai travaillé pour X »), passage presse, certification reconnue, expert cité par son nom. Un logo vaut un paragraphe de justification.", repeat: true, min: 2 },
          { k: "engagement", label: "Relation & engagement préalable", ph: "Qu'as-tu déjà donné à cette audience — contenu gratuit, formation offerte, communauté ? Plus la relation est longue, plus la vente est facile." },
        ],
      },
      {
        code: "2-1", type: "chap", title: "PVU — Proposition de valeur unique", badge: "avatar",
        produces: "Ta PVU en une seule phrase, validée par la checklist",
        when: "Une fois avatar et douleurs connus. C'est ta promesse centrale.",
        concept: "L'offre est la partie la plus importante d'une page de vente. Essayer de construire une page sur la mauvaise offre ne fonctionne pas — c'est construire une belle maison au milieu du désert. Une grande partie de ton travail de copywriter, c'est de définir et comprendre la proposition de valeur. Une fois ce travail fait, l'écriture de la page devient presque mécanique. Si tu ne sais pas résumer ton produit en une phrase, c'est le signal que tu n'as pas compris ton propre pivot.",
        q: [
          "Quel problème SPÉCIFIQUE ton produit résout-il ? (précis, pas « gagner plus d'argent »)",
          "Ce problème est-il réel ? Assez douloureux pour qu'on paie ?",
          "Quels moyens utilisent-ils aujourd'hui pour le résoudre ?",
          "Dépensent-ils déjà ? Si non → es-tu 10x meilleur que le gratuit ? Si oui → en quoi es-tu différent, et est-ce important pour la cible ?",
          "Peux-tu la dire en une phrase, précise, concise et différenciée ?",
        ],
        errors: [
          "S'obséder sur la page de vente sans avoir d'abord construit une vraie PVU.",
          "Croire que la pub crée le désir — elle ne fait que recontextualiser un désir existant.",
          "Innover sans pertinence — comme les pneus de couleur.",
          "Vouloir parler à tout le monde — la spécificité est ton amie.",
          "Ne pas savoir résumer ton produit en une phrase.",
        ],
        linked: ["2-2", "2-4"],
        fields: [
          { k: "probleme", label: "Problème spécifique résolu", ph: "Pas « aider les entrepreneurs à grandir » — trop large. Mais « aider les freelances dev qui plafonnent à 3k€/mois à passer le cap des 6k sans prendre plus de clients »" },
          { k: "reel", label: "Preuve que le problème est réel", ph: "Comment sais-tu qu'il est assez douloureux pour qu'on paie ? Verbatims, conversations, tentatives d'achat constatées, concurrents qui existent déjà ?" },
          { k: "alternatives", label: "Alternatives actuelles du marché", ph: "Ce qu'ils font aujourd'hui pour s'en sortir — YouTube, coach à 500€/h, formation concurrente, ou rien du tout ? Sont-ils déjà en train de dépenser sur ce problème ?" },
          { k: "ecart", label: "Ton écart de valeur (10x ou différenciation)", ph: "Si gratuit existe : en quoi es-tu 10x meilleur ? Si payant existe : qu'est-ce qui te différencie vraiment et pourquoi cette différence compte pour ta cible ?" },
          { k: "pvu", label: "PVU en une phrase", ph: "UNE seule phrase · test : si tu dois rajouter « c'est-à-dire que... » derrière, c'est que la phrase est trop vague — recommence" },
        ],
      },
      {
        code: "2-2", type: "chap", title: "Exemples de PVU (calibrage)", badge: "fixed",
        produces: "3 PVU modèles pour calibrer la tienne",
        when: "Si ta PVU sonne creux : compare-la à de bonnes PVU avant de continuer.",
        concept: "Une PVU bien faite n'est jamais un hasard. Les entreprises qui réussissent ont toutes appliqué, consciemment ou non, la même grille : quel problème, pour qui, comment je me différencie, et est-ce que cette différenciation a vraiment de la valeur pour mon marché. L'objectif de ce chapitre n'est pas seulement de comprendre des cas — c'est de prendre l'habitude de regarder n'importe quel produit en passant systématiquement par la checklist.",
        q: [
          "Réunis 3 PVU fortes, de ton marché ou d'ailleurs.",
          "Pour chacune : quel problème, pour qui, quelle différenciation, et pourquoi elle a de la valeur.",
          "Compare : la tienne est-elle aussi précise, concise et différenciée ?",
          "Corrige ta PVU (chapitre 2-1) si l'écart est net.",
        ],
        errors: [
          "Confondre l'esthétique du produit avec la PVU — l'humour est annexe, pas central.",
          "Rester sur le problème de surface au lieu du vrai problème.",
          "Choisir une stratégie qui ne correspond pas à ta cible.",
          "Attaquer un concurrent sans munitions — ça ne marche que si la frustration existe vraiment.",
          "Confondre différenciation et innovation.",
        ],
        linked: ["2-1"],
        fields: [
          { k: "modele", label: "PVU modèle + ce qui la rend forte", ph: "La PVU en une phrase · puis : quel problème elle résout / pour qui précisément / en quoi elle se différencie / pourquoi cette différence a de la valeur. Compare ensuite avec la tienne — est-elle aussi précise ?", repeat: true, min: 3 },
        ],
      },
      {
        code: "2-4", type: "chap", title: "Différenciation", badge: "fixed",
        produces: "Ton avantage compétitif + la stratégie de différenciation retenue",
        when: "Dès que tu as des concurrents en tête.",
        concept: "Avant de parler de différenciation, il faut comprendre l'avantage compétitif : c'est lui qui détermine si ta différenciation tiendra dans le temps, ou si elle s'effondrera dès qu'un concurrent décidera de te copier. Être différent ne suffit pas — il faut que cette différence soit défendable. Le test brutal : « Si un concurrent me copie demain, combien de temps lui faut-il ? » Un jour = fragile. Plusieurs années = solide.",
        q: [
          "Sur quel pilier repose ton avantage ? (opérations, réseau, marque, innovation, positionnement)",
          "Test brutal : combien de temps faudrait-il à un concurrent pour te copier ?",
          "Quelle stratégie de différenciation ? (niche, simplicité radicale, anti-positionnement, autorité, positionnement entre deux…)",
          "Les 4 leviers activés : positionnement unique, recontextualisation, crédibilité, relation personnelle.",
        ],
        errors: [
          "Se différencier par le prix quand on est petit — c'est l'avantage le plus fragile au monde.",
          "Confondre différenciation et avantage compétitif — la différence doit être défendable.",
          "Penser qu'une page de vente bien faite suffit — sans contenu ni relation en amont, elle vit en isolation.",
          "Copier le positionnement d'un concurrent qui marche sans comprendre le mécanisme derrière.",
          "Ignorer le levier de la relation — le plus puissant, et le plus long à construire.",
        ],
        linked: ["2-1", "2-5"],
        fields: [
          { k: "avantage", label: "Ton avantage (et sur quel pilier il repose)", ph: "Opérations (tu fais mieux ou moins cher) · Réseau (accès à des gens ou ressources rares) · Marque (ta personnalité, ton histoire) · Innovation (tu as trouvé quelque chose de nouveau) · Positionnement (tu occupes un terrain vide). Sur lequel es-tu vraiment fort ?" },
          { k: "solidite", label: "Solidité — temps nécessaire pour te copier", ph: "Test brutal : si un concurrent bien financé décidait de te copier demain, combien de temps lui faudrait-il ? Un jour = très fragile. Quelques mois = moyen. Plusieurs années = solide. Pourquoi ?" },
          { k: "strategie", label: "Stratégie de différenciation retenue", ph: "Niche (tu sers une cible ultra-précise) · Simplicité radicale (moins de fonctionnalités mais parfait sur l'essentiel) · Anti-positionnement (tu cibles les insatisfaits d'un concurrent) · Autorité (tu es la référence perçue) · Positionnement entre deux (tu combines deux catégories). Laquelle, et pourquoi maintenant ?" },
          { k: "relation", label: "Levier relation", ph: "La relation est le seul avantage vraiment incopiable. Comment la construis-tu ? Contenu régulier · communauté · ton unique · présence au quotidien. Un concurrent peut copier ton produit — il ne peut pas copier 3 ans de confiance accumulée." },
        ],
      },
      {
        code: "2-5", type: "chap", title: "Recontextualisation", badge: "avatar",
        produces: "Le nouveau « jeu » dans lequel tu places ton offre",
        when: "Si la comparaison directe avec tes concurrents te dessert.",
        concept: "Recontextualiser, c'est changer le problème que ta catégorie de produit résout habituellement. L'image : tu es sur un terrain de basket, tes concurrents aussi — et tout d'un coup tu te mets à jouer au rugby. Ils restent à dribbler, mais toi tu joues à un autre jeu. Tu n'as plus de concurrence, parce que tu as changé la partie en cours. Attention : ce n'est pas un nouveau slogan. Si le produit est encore vendu sur les mêmes critères que les concurrents, tu n'as rien recontextualisé.",
        q: [
          "Le jeu actuel : sur quel axe TOUS tes concurrents se battent-ils ? (prix, performance, fonctionnalités…)",
          "Le besoin caché : quel vrai bénéfice cherche le prospect que personne ne nomme ?",
          "Formule le pivot : « Le vrai problème, ce n'est pas X. C'est Y. »",
          "Rends l'ancien problème viscéral et le nouveau bénéfice désirable.",
          "Étends la recontextualisation à TOUT : titre, PVU, témoignages, contenu, emails.",
        ],
        errors: [
          "Confondre recontextualisation et nouveau slogan.",
          "Recontextualiser sans étudier le marché — tu ne peux pas inventer un nouveau jeu sans comprendre celui qui se joue.",
          "Recontextualiser sur un bénéfice que ta cible ne veut pas.",
          "Garder la recontextualisation isolée à un paragraphe — elle doit imprégner toute ta communication.",
          "Croire qu'une recontextualisation faible suffit — « on est différents parce qu'on est mieux » n'en est pas une.",
        ],
        linked: ["2-6", "2-7"],
        fields: [
          { k: "jeu", label: "Le jeu actuel du marché", ph: "L'axe sur lequel TOUS tes concurrents se battent — prix, nombre de modules, rapidité, certification ? Observe leurs pages de vente : sur quoi insistent-ils tous ? C'est le terrain que tu vas abandonner." },
          { k: "cache", label: "Le besoin caché", ph: "Le vrai bénéfice que les clients cherchent mais que personne ne nomme encore. Ex : sur un marché de formation copywriting, tout le monde promet « mieux écrire » — le besoin caché, c'est peut-être « ne plus jamais dépendre d'un freelance »" },
          { k: "pivot", label: "Phrase pivot", ph: "« Le vrai problème, ce n'est pas X. C'est Y. » · Ex : « Le vrai problème, ce n'est pas que tu manques de technique. C'est que tu vends à des gens qui ne sont pas prêts à acheter. »" },
          { k: "extension", label: "Où l'étendre dans toute la communication", ph: "Titre de la page · PVU · formulation des témoignages · angle des contenus gratuits · objet des emails · réponses aux objections. Si ta recontextualisation n'apparaît que dans un paragraphe, elle ne fonctionne pas." },
        ],
      },
      {
        code: "2-6", type: "chap", title: "Mécanisation", badge: "fixed",
        produces: "Ton mécanisme unique, nommé et incarné",
        when: "Une fois ta promesse posée. C'est ce qui la rend crédible.",
        concept: "Mécaniser, c'est expliquer le système ou le mécanisme qui permet à ton produit de délivrer le bénéfice promis. Pas seulement « voici ce que ça fait », mais « voici POURQUOI ça fait ce que ça fait ». Ça marche grâce au biais narratif : si quelque chose est explicable, on a tendance à y croire ; si ça ne l'est pas, on n'y croit pas. Sans mécanisation, ta promesse flotte dans le vide. Avec, elle s'ancre. Et surtout : donne-lui un NOM — ne pas nommer ton mécanisme te prive de 80 % de l'effet.",
        q: [
          "Quelle est ta promesse principale ? (précise : « doubler tes prix en 3 mois », pas « gagner plus »)",
          "Complète : « Ma promesse fonctionne parce que ___ ». Si tu ne peux pas, tu n'as pas de mécanisme.",
          "Donne un NOM au mécanisme : précis, mémorable, qui t'appartient.",
          "Quel visuel ou quelle analogie le rend visible dans sa tête ?",
          "Quelle autorité, science ou expérience l'adosse ? Quelle histoire de découverte ?",
        ],
        errors: [
          "Faire une promesse sans la mécaniser — c'est ce qui sépare « trop beau pour être vrai » de « ça paraît logique ».",
          "Mécaniser sans donner de nom — l'erreur la plus fréquente, elle te prive de 80 % de l'effet.",
          "Mécaniser de façon vague — « notre méthode unique » ne dit rien.",
          "Mécaniser sans visualisation — un mécanisme abstrait ne reste pas en mémoire.",
          "Mécaniser sans autorité — un mécanisme sans source perd sa crédibilité.",
          "Mécaniser de façon malhonnête — ça finit toujours mal pour la marque.",
        ],
        linked: ["2-5", "2-7"],
        fields: [
          { k: "promesse", label: "Promesse principale", ph: "Résultat précis et mesurable — pas « gagner plus » mais « doubler ton tarif horaire en 90 jours sans perdre tes clients actuels »" },
          { k: "pourquoi", label: "« Ma promesse fonctionne parce que… »", ph: "Complète la phrase sans tricher. Si tu bloques, c'est que tu n'as pas encore de mécanisme — c'est le signal pour aller chercher. Ex : « ...parce que je travaille sur le positionnement avant l'argumentation, ce que personne d'autre ne fait »" },
          { k: "nom", label: "Nom du mécanisme", ph: "2 à 4 mots · doit sonner comme quelque chose qui t'appartient. Ex : « La Méthode Pivot », « Le Filtre à Objections », « Le Protocole 72h » · évite les noms trop génériques (« Système de vente ») ou trop jargonneux" },
          { k: "visuel", label: "Visuel / analogie", ph: "L'image mentale qui rend le mécanisme tangible en une phrase. Ex : « C'est comme nettoyer des lunettes sales — tu n'y vois rien, tu fais des erreurs, et là d'un coup tout devient clair »" },
          { k: "autorite", label: "Autorité qui l'adosse", ph: "Ce qui le rend crédible : étude, expérience personnelle mesurée, résultats de tes clients, histoire de découverte. Ex : « Après avoir testé ça sur 47 lancements, le taux de conversion double systématiquement »" },
        ],
      },
      {
        code: "2-7", type: "chap", title: "Storytelling (matière brute)", badge: "fixed",
        produces: "Ta structure narrative en 6 temps",
        when: "Collecte les faits maintenant. Tu monteras le récit en Phase 2.",
        concept: "Le storytelling, c'est arranger une suite d'événements selon une chaîne de causes à effets, pour susciter une réaction émotionnelle. Ce n'est pas une surcouche esthétique : les histoires sont ancrées dans ton ADN aussi profondément que la peur ou la faim. C'est le canal principal par lequel le cerveau humain interprète le monde. Point clé : sans ennemi, ton storytelling est mou et n'engage personne. Et plus ton ennemi est puissant, plus ton héros paraît héroïque.",
        q: [
          "Ton ennemi : idée reçue, méthode concurrente ou archétype à combattre (puissant et crédible).",
          "Ton protagoniste : le client (tu es mentor) / toi-même / un client précis / un pionnier.",
          "Situation initiale : le monde connu, ce qui semble normal.",
          "Élément perturbateur : l'événement ou la prise de conscience qui bouleverse l'équilibre.",
          "Péripéties et climax : obstacles, mentors, confrontation avec l'ennemi.",
          "Situation finale stable : équilibre retrouvé mais transformé. Jamais de fin ouverte.",
        ],
        errors: [
          "Croire que le storytelling est décoratif — c'est le canal principal de la persuasion.",
          "Vouloir plaire à tout le monde — sans ennemi, ton histoire est molle.",
          "Choisir un ennemi faible — plus l'ennemi est puissant, plus le héros est héroïque.",
          "Confondre statistique et anecdote — la statistique convainc la raison, l'anecdote motive l'action.",
          "Oublier la situation finale — les fins ouvertes frustrent le cerveau humain.",
          "Se positionner en « naturel » ou « authentique » — personne ne prend le contre-pied, donc c'est mou.",
        ],
        linked: ["2-5", "2-6", "4-1"],
        fields: [
          { k: "ennemi", label: "L'ennemi", ph: "Idée reçue, méthode concurrente ou figure à abattre — doit être puissant et crédible, pas une paille. Ex : « l'idée que pour vendre, il faut avoir un gros réseau » ou « les gurus qui promettent 10k/mois en 30 jours »" },
          { k: "protagoniste", label: "Le protagoniste", ph: "Qui est le héros ? Toi (mentor) ou ton client (héros) ? Si c'est toi → tu racontes ta propre bascule. Si c'est un client → le cas précis, avec son prénom, son contexte, son point de départ." },
          { k: "initiale", label: "Situation initiale", ph: "Le monde avant la bascule — normal, stable, connu. Donne des détails visuels concrets : où était le héros, ce qu'il faisait, comment il se sentait. Pas d'action encore, juste le décor." },
          { k: "perturbateur", label: "Élément perturbateur", ph: "L'événement ou la prise de conscience qui brise l'équilibre. Doit être identifiable et daté. Ex : « C'est en recevant ce message d'un client que tout a basculé » · précise le moment, pas une époque vague." },
          { k: "climax", label: "Péripéties & climax", ph: "Les obstacles rencontrés, les fausses pistes, le mentor qui change tout, la confrontation décisive avec l'ennemi. C'est la partie la plus longue — n'abrège pas ici." },
          { k: "finale", label: "Situation finale", ph: "L'équilibre retrouvé — mais transformé. Jamais la même vie qu'au départ. Décris concrètement ce qui a changé, et montre le lien direct avec le produit ou la méthode que tu proposes." },
        ],
      },
    ],
  },
  {
    id: "p1", tag: "Phase 1", name: "Stratégie & architecture",
    goal: "Tu décides. Pas encore un mot de vente : d'abord les choix de structure et de niveau.",
    steps: [
      {
        code: "1-3", type: "chap", title: "Les niveaux de persuasion", badge: "avatar",
        produces: "Le niveau visé (raison / émotion / identité) + l'ordre d'attaque",
        when: "Avant toute rédaction. Ça conditionne tout le message.",
        concept: "Un être humain a toujours deux raisons d'agir : une bonne raison… et la vraie raison. La vraie décision se prend sur l'émotion ou l'identité. La raison arrive après, pour habiller la décision d'arguments présentables. Tu ne décides pas parce que c'est logique : tu trouves des raisons parce que tu as déjà décidé. L'identité est le levier le plus puissant, devant l'émotion, très loin devant la raison. Conséquence pratique : émotion et identité d'abord, rationnel ensuite — pour rassurer, pas pour convaincre.",
        q: [
          "Diagnostic : range chaque argument existant en raison / émotion / identité (la plupart sont à 80 % rationnels).",
          "Émotion à activer : une peur, une frustration ou un désir profond — formulé pour faire RESSENTIR.",
          "Signal identitaire : « Qui mon prospect devient-il en achetant ? » — formulé comme une affirmation d'identité.",
          "Justification : 2 arguments rationnels solides pour qu'il puisse défendre son choix APRÈS l'avoir fait.",
          "Ordre inversé : émotion/identité d'abord, rationnel ensuite.",
        ],
        errors: [
          "Construire une page uniquement rationnelle — tu parles à la partie du cerveau qui justifie, pas à celle qui décide.",
          "Croire que le client choisit logiquement — il a ressenti, puis il a justifié.",
          "Faire une page technique pour un produit technique — plus ton produit est technique, plus ta page doit être humaine.",
          "Oublier la justification — s'il n'a pas de raison à donner à son conjoint ou son comptable, il n'achète pas.",
        ],
        linked: ["1-4", "4-2"],
        fields: [
          { k: "diagnostic", label: "Diagnostic de tes arguments actuels", ph: "Prends ta page actuelle et classe chaque argument : rationnel (chiffre, fonctionnalité, ROI) / émotionnel (peur, frustration, désir) / identitaire (qui il devient). La plupart des pages sont à 80 % rationnelles. Quel est ton ratio ?" },
          { k: "emotion", label: "Émotion à activer", ph: "Une seule émotion principale, formulée pour la faire ressentir — pas pour la nommer. Pas « il ressent de la frustration » mais « il en a marre de bosser 60h/semaine pour un salaire qui ne change pas »" },
          { k: "identite", label: "Signal identitaire", ph: "Qui il devient en achetant — formulé comme une affirmation d'identité. Ex : « Tu rejoins les gens qui ont compris que le prix se négocie, pas les gens qui encaissent » · doit créer un contraste net avec qui il ne veut plus être" },
          { k: "justif", label: "Justifications rationnelles (2)", ph: "Les 2 arguments logiques qu'il pourra donner à son conjoint, son comptable ou lui-même pour « habiller » sa décision. Ex : « Le ROI est récupéré en moins de 30 jours » · « J'aurais payé ça de toute façon en coaching »", repeat: true, min: 2 },
        ],
      },
      {
        code: "1-6", type: "chap", title: "Le paradoxe du choix", badge: "fixed",
        produces: "Le nombre d'options + le CTA prioritaire unique",
        when: "Avant de structurer la page. Décide combien de choix tu donnes.",
        concept: "On pense qu'ajouter des options donne plus de liberté au prospect. C'est l'inverse : plus tu donnes de choix, plus tu rends la décision difficile — et plus la décision est difficile, moins elle a lieu. C'est la règle d'or du webdesign que la plupart des sites ignorent encore. La question centrale à te poser en permanence : « À quel point est-il facile de décider ? » Et ne demande jamais au prospect de réfléchir : il ne le fera pas, il partira.",
        q: [
          "Question centrale : « À quel point est-il facile de décider ? »",
          "Supprime les choix inutiles — chaque option doit servir un objectif.",
          "Clarifie l'action principale : un seul CTA prioritaire, mis en avant.",
          "Découpe les décisions complexes en petits choix. Un message = un argument.",
        ],
        errors: [
          "Multiplier les objectifs sur une page — le réflexe naturel, et l'erreur la plus coûteuse.",
          "Ajouter des boutons « au cas où » — chaque bouton dilue l'attention vers l'action principale.",
          "Rester vague dans l'appel à l'action — « En savoir plus » ne dit rien, ne crée aucune envie.",
          "Surcharger une page ou un email — plus tu mets, moins tu obtiens.",
          "Demander au prospect de réfléchir — il ne le fera pas. Il partira.",
        ],
        linked: ["3-1"],
        fields: [
          { k: "offres", label: "Nombre d'offres / options proposées", ph: "Idéalement 1 — max 3 si chaque option cible un profil distinct. Note ici combien tu proposes et pourquoi chacune est là. Si tu ne peux pas justifier une option, supprime-la." },
          { k: "cta", label: "CTA principal unique", ph: "Verbe d'action précis + bénéfice immédiat. Pas « En savoir plus » ou « Acheter ». Ex : « Rejoindre la formation et accéder dès maintenant » · « Réserver ma place (il en reste 12) »" },
          { k: "supprime", label: "Ce que tu supprimes", ph: "Boutons secondaires, menus de navigation, liens sortants, options « au cas où ». Chaque élément que tu retires est une distraction en moins sur le chemin vers l'action principale." },
        ],
      },
      {
        code: "1-8", type: "chap", title: "Page longue ou courte", badge: "multi",
        produces: "Le format retenu, dérivé des questions du prospect",
        when: "La longueur n'est pas arbitraire : elle dépend des questions à couvrir.",
        concept: "Long ou court est un faux débat absolu. La longueur ne dépend ni de la mode ni de la tendance, mais de deux choses : ton produit et ton marché. La bonne méthode : liste TOUTES les questions auxquelles le prospect a besoin d'une réponse pour acheter. Chaque question restante devient une section. C'est ça qui fixe la longueur réelle. Et non, les gens n'ont pas arrêté de lire : ils lisent ce qui les concerne vraiment.",
        q: [
          "Liste toutes les questions dont le prospect a besoin d'une réponse pour acheter (produit, crédibilité, pertinence, pratique).",
          "Qu'est-ce qui est déjà répondu par le contexte (plateforme, notoriété) vs à ta charge ?",
          "Pour chaque question restante → une section. C'est ça qui fixe la longueur.",
          "Critère par ligne : « Est-ce que ça mérite d'être lu par mon prospect ? » Sinon, coupe.",
        ],
        errors: [
          "Choisir la longueur avant le contenu — « je fais court parce que c'est tendance ».",
          "Croire que les gens ne lisent plus — ils lisent ce qui les concerne vraiment.",
          "Écrire une page longue sans construire l'attention — supposer qu'on va lire par défaut.",
          "Négliger la lisibilité physique — police, contraste, mise en page.",
          "Parler ton langage à toi, pas celui du prospect.",
        ],
        linked: ["3-7"],
        fields: [
          { k: "questions", label: "Questions du prospect (chacune = une section)", ph: "Une question précise par ligne — celles qu'il se pose avant d'acheter. Ex : « Ça marche pour quelqu'un comme moi ? » · « Combien de temps ça prend ? » · « Pourquoi pas une formation moins chère ? » · « Qu'est-ce qui se passe si ça ne marche pas pour moi ? »", repeat: true, min: 6 },
          { k: "format", label: "Format retenu + justification", ph: "Longue ou courte — mais justifié par la liste ci-dessus, pas par une préférence esthétique. Chaque question sans réponse dans la liste = une section à ajouter. Chaque section sans question correspondante = à supprimer." },
        ],
      },
      {
        code: "3-1", type: "chap", title: "La formule AIDA", badge: "multi",
        produces: "Le squelette AIDA de ton message",
        when: "Charpente standard : Attention → Intérêt → Désir → Action.",
        concept: "AIDA se retrouve partout : pages de vente, vidéos, emails, publicités, pitches. Elle n'est pas populaire par hasard — elle correspond à la façon dont le cerveau humain traite l'information. Ce n'est pas une contrainte marketing, c'est la façon dont ton cerveau veut être guidé vers une décision. À retenir : chaque étape de ton tunnel a son propre AIDA. Sur un email, tu demandes de cliquer — pas d'acheter.",
        q: [
          "Détermine l'action finale précise (clic, achat, formulaire, appel, vidéo vue).",
          "A — Attention : l'accroche qui arrête le scroll (chiffre choc, question, contre-intuitif, visualisation).",
          "I — Intérêt : introduis le PROBLÈME du prospect (recontextualisation, mécanisation, début d'histoire).",
          "D — Désir : agite le problème, propose la solution, bullets bénéfices, preuves.",
          "A — Action : CTA ultra-clair, verbe d'action + bénéfice.",
        ],
        errors: [
          "Sauter l'étape Attention — croire que ton contenu capturera l'attention tout seul.",
          "Rester sur ta solution dans l'Intérêt — parler de toi au lieu du problème du prospect.",
          "Développer le Désir sans preuves — les bénéfices sans crédibilité ne convertissent pas.",
          "Oublier l'appel à l'action — l'erreur la plus fréquente et la plus coûteuse.",
          "Vouloir tout faire d'un coup — chaque étape du tunnel a son propre AIDA.",
        ],
        linked: ["3-5", "1-6"],
        fields: [
          { k: "action", label: "Action finale visée", ph: "L'action précise et unique attendue à la fin du message : cliquer sur un lien, remplir un formulaire, acheter, regarder une vidéo, répondre à un email. Un seul objectif par message — lequel ?" },
          { k: "a1", label: "A — Attention", ph: "L'accroche qui stoppe le scroll avant même que le prospect ait décidé de lire. Chiffre choc, question qui dérange, affirmation contre-intuitive, visualisation forte. Ex : « 94 % des pages de vente ne convertissent pas — et ce n'est pas une question de texte »" },
          { k: "i", label: "I — Intérêt (le problème)", ph: "Introduis SON problème — pas ta solution. Comment lui le formulerait-il ? C'est ici que l'effet miroir joue. Pas de jargon, pas de promesse encore — juste son problème, décrit mieux qu'il ne le ferait lui-même." },
          { k: "d", label: "D — Désir", ph: "Agite le problème · présente la solution · bullets bénéfices · preuves sociales · témoignages · visualisation du futur. C'est la partie la plus longue — ne la bâcle pas pour aller vite au CTA." },
          { k: "a2", label: "A — Action", ph: "CTA ultra-clair : verbe d'action + bénéfice immédiat + friction réduite au minimum. Ex : « Rejoindre la formation maintenant — accès immédiat dès la confirmation » · répète-le 2 à 3 fois dans la page." },
        ],
      },
      {
        code: "3-5", type: "chap", title: "Problème – Aggraver – Résoudre", badge: "multi",
        produces: "Le squelette PAS quand la douleur porte la vente",
        when: "Alternative ou complément à AIDA, quand la douleur est le moteur.",
        concept: "Une solution n'a aucune force tant que le problème n'a pas été ressenti dans les tripes. La plupart des messages ratent leur cible parce qu'ils vont trop vite : ils présentent le produit, énumèrent les bénéfices — mais oublient de faire ressentir à quel point le problème est réel, urgent et douloureux, maintenant. Répartition indicative : Problème 10-15 %, Aggravation 55-65 %, Solution 25-35 %. N'aie pas peur de consacrer la majorité du texte à l'aggravation.",
        q: [
          "Identifie le VRAI problème (pas toujours l'apparent). Comment LUI le formulerait-il ?",
          "Rédige le problème en une phrase, idéalement sous forme de question (effet miroir).",
          "Aggrave avec 4 leviers : précision des conséquences, visualisation du futur, urgence, actualisation de la douleur.",
          "Solution : contraste net, nomme ta méthode (mécanisation), ouvre les bénéfices.",
          "Respecte la répartition : Problème 10-15 % / Aggravation 55-65 % / Solution 25-35 %.",
        ],
        errors: [
          "Sauter directement à la solution — l'erreur numéro 1.",
          "Présenter un problème plat — « vous manquez de temps ? » n'active rien.",
          "Aggraver de façon générique — l'aggravation doit être spécifique à ton avatar.",
          "Confondre aggravation et dramatisation excessive — ça doit rester crédible.",
          "Aggraver trop peu — n'aie pas peur d'y consacrer 60-70 % du texte.",
          "Oublier l'effet miroir dans l'aggravation — utilise le langage exact du prospect.",
          "Négliger la transition entre aggravation et solution.",
        ],
        linked: ["3-4", "1-4"],
        fields: [
          { k: "vraiprobleme", label: "Le vrai problème, dans ses mots à lui", ph: "Pas le problème apparent, le vrai — et formulé exactement comme il le dirait à voix haute, pas comme toi tu l'analyses. Ex : « j'ai l'impression de tourner en rond » plutôt que « manque de stratégie »" },
          { k: "phrase", label: "Le problème en une phrase (idéalement une question)", ph: "Une question ouverte qui crée l'effet miroir dès la première seconde. Ex : « Vous bossez 50h par semaine depuis 2 ans… et votre chiffre d'affaires stagne toujours autant ? »" },
          { k: "aggravation", label: "Aggravation — scènes et conséquences (60 % du texte)", ph: "Une scène ou conséquence concrète par entrée. Précision des conséquences · futur projeté · urgence · douleur dans le présent. Ex : « Dans 6 mois, tes concurrents qui ont osé investir seront 3 coches au-dessus. Toi tu seras au même endroit, avec les mêmes doutes. »", repeat: true, min: 4 },
          { k: "solution", label: "Transition vers la solution", ph: "Le pivot qui crée le contraste maximal entre la douleur décrite et ce que tu proposes. Nomme ta méthode (mécanisation) et ouvre les bénéfices sans tout dévoiler. Ex : « C'est exactement pour ça que j'ai construit [NOM DU MÉCANISME] — pour que tu arrêtes de... et que tu puisses enfin... »" },
        ],
      },
      {
        code: "3-2", type: "chap", title: "Le toboggan glissant", badge: "fixed",
        produces: "Le principe de fluidité à tenir sur toute la rédaction",
        when: "Décidé ici, appliqué partout ensuite.",
        concept: "Concept de Joe Sugarman : imagine ton prospect debout en haut d'un toboggan huilé. Le titre, c'est le moment où il pose ses fesses en haut. À partir de là, chaque phrase doit le pousser vers la suivante, jusqu'à l'appel à l'action. Une fois qu'il a commencé à lire, il doit être incapable de s'arrêter — non pas parce qu'il est captif, mais parce que chaque phrase l'aspire vers la suivante. Les charnières (transitions) sont les endroits exacts où on perd le lecteur.",
        q: [
          "Filtre chaque phrase par 3 questions : nécessaire ? s'enchaîne naturellement ? donne envie de lire la suivante ?",
          "Soigne les charnières : titre→1re phrase, fin de paragraphe→début du suivant, fin de section→section suivante.",
          "À chaque charnière : une question ouverte, un mystère, une promesse de suite.",
          "Test « j'arrête ici » : à chaque fin de phrase, pourrais-tu t'arrêter sans frustration ? Si oui → trou à combler.",
        ],
        errors: [
          "Écrire pour « informer » au lieu d'écrire pour aspirer.",
          "Séparer les bénéfices dans une liste isolée — incarne-les dans une histoire vécue quand c'est possible.",
          "Négliger les transitions — les charnières sont les endroits où on perd le lecteur.",
          "Écrire ton titre en dernier — c'est le premier chantier, pas le dernier.",
          "Avoir peur de la longueur — un texte long avec un bon toboggan bat un texte court sans.",
          "Traiter les objections en bloc à la fin — traite-les au moment où elles se posent.",
          "Confondre style et efficacité — le toboggan est une question de dynamique, pas de style.",
        ],
        linked: ["3-3"],
        fields: [
          { k: "charnieres", label: "Charnières à renforcer", ph: "Identifie les endroits précis où le lecteur pourrait décrocher : fin d'une section sans pont vers la suivante · phrase informative sans aspiration · paragraphe qui se ferme au lieu d'ouvrir. Note la charnière et comment tu vas la renforcer.", repeat: true, min: 3 },
        ],
      },
      {
        code: "1-9", type: "chap", title: "Créativité et copywriting", badge: "fixed",
        produces: "Le tri : où appliquer les formules, où innover vraiment",
        when: "Transversal : dès qu'un passage sonne plat ou générique.",
        concept: "La créativité en copywriting existe, mais pas où tu crois. Elle n'est pas dans le style, ni dans la beauté littéraire, ni dans le fait de réinventer la roue. Elle est dans l'art de la persuasion : résoudre un problème, pas faire joli. Être un bon écrivain ne suffit pas — c'est même parfois un handicap, parce qu'on fait des « films d'art et essai » que personne ne lit. Les formules éprouvées existent parce qu'elles fonctionnent : applique-les, et dépense ta créativité là où elle compte.",
        q: [
          "Ce que tu n'as PAS à réinventer : structure narrative, niveaux de persuasion, Cialdini, frameworks.",
          "Où tu DOIS être créatif : l'adaptation à ton produit, le hook, la PVU différenciée, la crédibilité spécifique, les preuves, la garantie qui surprend, la visualisation du futur.",
          "Vérifie l'équilibre : original là où il faut, appliqué là où inventer ne sert à rien.",
        ],
        errors: [
          "Croire qu'être un bon écrivain suffit — c'est parfois un handicap.",
          "Vouloir réinventer la roue par ego — tu fais des films d'art et essai que personne ne lit.",
          "Confondre créativité et style littéraire — la créativité résout un problème.",
          "Sous-estimer les formules éprouvées — elles existent parce qu'elles fonctionnent.",
          "Investir ta créativité au mauvais endroit — sur la forme au lieu de la persuasion.",
        ],
        linked: [],
        fields: [
          { k: "applique", label: "Ce que j'applique sans réinventer", ph: "Les structures éprouvées que tu utilises telles quelles sans te poser de question : AIDA, PAS, les 6 principes de Cialdini, les niveaux de persuasion. Note-les ici — pas besoin d'innover dessus." },
          { k: "angle", label: "Où je prends un vrai risque créatif", ph: "Les endroits où la créativité fait vraiment la différence : l'angle du hook · la formulation de ta PVU · le nom de ton mécanisme · ta garantie atypique · la visualisation du futur. C'est là que tu dépenses ton énergie créative." },
        ],
      },
    ],
  },
  {
    id: "p2", tag: "Phase 2", name: "Rédaction",
    goal: "Tu écris, dans l'ordre de lecture. Chaque brique s'appuie sur la matière de la Phase 0.",
    steps: [
      {
        code: "3-3", type: "chap", title: "Le titre — les 4 U et les power words", badge: "multi",
        produces: "Ton titre principal, choisi parmi 10 versions minimum",
        when: "Écris-le en premier. C'est le levier le plus puissant de toute la page.",
        concept: "Entre 50 et 80 % des visiteurs lisent uniquement ton titre, puis quittent la page. À qualité de page égale, améliorer ton titre est donc le levier le plus puissant pour augmenter tes conversions — plus que le design, les bullets ou les témoignages. Et pourtant la plupart des gens le rédigent en dernier, en cinq minutes. Un titre professionnel se construit avec la rigueur d'un mécanisme d'horlogerie : les 4 U (Utile, Urgent, Unique, Ultra-spécifique) — vise au moins 3 sur 4.",
        q: [
          "Filtre 4U : Utile ? Urgent ? Unique ? Ultra-spécifique ? (minimum 3 sur 4)",
          "Remplace les mots plats par des power words (« bon » → « remarquable », « aider » → « propulser »).",
          "Ajoute de la spécificité : un chiffre, un nom propre, un délai.",
          "Cherche le détail concret qui prouve la promesse à lui seul.",
          "Génère AU MOINS 10 versions. Teste tes 3 meilleures sur des tiers.",
        ],
        errors: [
          "Rédiger ton titre en dernier, en 5 minutes.",
          "Utiliser un titre trop générique — « Découvrez notre solution » n'a aucune traction.",
          "Utiliser un titre clickbait qui ne tient pas ses promesses — tu gagnes des clics, tu perds ta crédibilité.",
          "Éviter les chiffres — les titres avec chiffres convertissent souvent mieux.",
          "Oublier les power words — un seul peut tout changer.",
          "Se contenter d'un seul titre — les pros en écrivent 10, 20, 30.",
          "Négliger les sous-titres — les 4 U s'appliquent à tous.",
          "Confondre « attirer plein de monde » et « attirer les bonnes personnes ».",
        ],
        linked: ["3-2"],
        fields: [
          { k: "titres", label: "Tes versions de titre (10 minimum)", ph: "Une version par ligne. Varie les angles : chiffre · question · contre-intuitif · résultat précis · peur · identité. Ne t'arrête pas au premier qui sonne bien — les meilleurs titres arrivent souvent après le 7e essai.", repeat: true, min: 10 },
          { k: "retenu", label: "Titre retenu + score 4U", ph: "Le titre que tu gardes · puis coche : Utile (il résout un vrai problème) ? Urgent (il crée une pression temporelle) ? Unique (personne ne dit ça comme toi) ? Ultra-spécifique (chiffre, délai, nom propre) ? Minimum 3 sur 4." },
        ],
      },
      {
        code: "3-4", type: "chap", title: "Pattern interrupt + effet miroir", badge: "multi",
        produces: "L'accroche qui arrête le scroll + la reconnaissance immédiate",
        when: "Juste après le titre : casse le schéma, puis décris SA réalité.",
        concept: "Ton prospect n'arrive jamais neutre : il a une histoire déjà en cours dans sa tête, un schéma de pensée installé, des distractions. Si tu n'interromps pas ce qui se passe déjà dans son cerveau, ton message glisse sans laisser de trace. Deux techniques : le pattern interrupt (l'interruption de schéma) crée la brèche, l'effet miroir la remplit — le prospect lit et se dit « c'est exactement ce qui m'arrive ». Un effet miroir générique ne vaut rien : il faut du concret, du viscéral, du spécifique.",
        q: [
          "Schéma mental : dans quel contexte voit-il ton message ? Que fait-il juste avant ? Quel schéma interrompre ?",
          "Élément d'interruption : image inattendue, personnage improbable, contradiction, juxtaposition, chiffre choc.",
          "Test interruption : « Quelqu'un qui scrolle serait-il forcé de s'arrêter ? »",
          "Effet miroir : description ultra-précise et viscérale de son problème (scènes, émotions, objets connus).",
          "Test miroir : « Mon avatar se dirait-il : c'est moi, mot pour mot ? »",
        ],
        errors: [
          "Croire que ton prospect arrive avec une attention neutre.",
          "Utiliser un pattern interrupt sans lien avec ton produit — tu crées de l'attention mais pas de conversion.",
          "Confondre pattern interrupt et clickbait — le pattern interrupt légitime tient sa promesse ensuite.",
          "Écrire un effet miroir générique — « vous manquez de temps ? » n'a aucun effet.",
          "Utiliser le prénom en pensant que ça suffit — cette technique s'est usée.",
          "N'appliquer ces techniques qu'à l'ouverture — rejoue-les à intervalles réguliers.",
          "Ne pas connaître ton avatar assez profondément — sans lui, tu ne sais ni quoi interrompre ni quoi refléter.",
        ],
        linked: ["2-3", "3-5"],
        fields: [
          { k: "schema", label: "Le schéma mental à interrompre", ph: "Dans quel contexte voit-il ton message — Instagram, email, feed LinkedIn ? Que fait-il juste avant ? Quel schéma mental est déjà en cours dans sa tête ? C'est ce fil que tu dois couper." },
          { k: "interrupt", label: "Élément d'interruption", ph: "1 phrase qui casse le schéma et force l'arrêt. Image inattendue · contradiction · juxtaposition · chiffre choc · question qui dérange. Test : quelqu'un qui scrolle distraitement serait-il forcé de s'arrêter ?" },
          { k: "miroir", label: "Effet miroir — description viscérale", ph: "2 à 4 phrases qui décrivent SA réalité avec une précision qui fait dire « c'est moi, mot pour mot ». Pas de généralités — des scènes, des objets, des heures précises, des gestes reconnaissables. Ex : « Tu ouvres ton tableau de bord le lundi matin, les chiffres n'ont pas bougé, et tu fermes l'onglet sans répondre à personne. »" },
        ],
      },
      {
        code: "1-1", type: "chap", title: "WIIFM — ouverture centrée prospect", badge: "avatar",
        produces: "Une ouverture qui parle de LUI, pas de toi",
        when: "Ouvre toujours par son problème, jamais par ta solution.",
        concept: "WIIFM = « What's In It For Me ? » — « Qu'est-ce que j'ai à y gagner ? ». C'est le principe le plus important en persuasion. L'erreur classique est de croire qu'une page de vente sert à présenter son produit. En réalité, elle doit d'abord parler du problème du prospect, en termes d'expérience vécue et non en termes techniques. Vérification la plus rapide : compte le ratio je/vous. Si les pronoms de première personne dominent, ta page est centrée sur toi.",
        q: [
          "Quel est le vrai problème quotidien, en expérience vécue et non en termes techniques ?",
          "Réécris en partant du prospect : problème d'abord, solution ensuite.",
          "Compte le ratio je/vous. Le « vous » doit dominer largement.",
          "Applique le réflexe partout : page de vente, page à propos, email, pitch.",
        ],
        errors: [
          "Croire que « solution révolutionnaire » ou « innovant » suffit à convaincre.",
          "Utiliser un jargon technique que le prospect ne maîtrise pas — ce qui te passionne en interne ne l'intéresse pas.",
        ],
        linked: ["2-3"],
        fields: [
          { k: "probleme_vecu", label: "Le problème en expérience vécue", ph: "Pas le problème technique — l'expérience vécue au quotidien. Pas « batterie 30 % plus longue » mais « ton téléphone meurt à 17h et tu passes ta soirée à chercher une prise. » Quelle est la scène concrète dans sa journée ?" },
          { k: "ouverture", label: "Ouverture rédigée", ph: "Les premières lignes entièrement centrées sur son problème — pas un mot sur toi ou ton produit. Test : si tu lis uniquement l'ouverture, est-ce que ton avatar dit « c'est exactement ce que je vis » ?" },
          { k: "ratio", label: "Ratio je/vous constaté", ph: "Compte les pronoms sur toute ta page : je / nous / notre vs vous / votre / tu / ton. La plupart des pages sont à 70 % centrées sur le vendeur. Quel est ton ratio ?" },
        ],
      },
      {
        code: "1-2", type: "chap", title: "Les 6 principes de Cialdini", badge: "multi",
        produces: "Les 6 leviers placés et répartis sur toute la page",
        when: "Pendant la rédaction. Répartis-les, ne les empile jamais en un bloc.",
        concept: "Tout élément persuasif d'une page peut être classé dans une ou plusieurs des 6 catégories identifiées par Robert Cialdini. Ce sont les briques de base que tu vas remixer tout au long de tes messages. La vraie puissance ne vient pas d'un principe isolé, mais des combinaisons : rareté + preuve sociale, réciprocité + appréciation, autorité + contenu gratuit. Pense en couches superposées.",
        q: [
          "Preuve sociale : puis-je montrer que d'autres me font confiance ? (témoignages, nombre de clients)",
          "Réciprocité : ai-je donné de la vraie valeur en amont ? (contenu gratuit, effort visible)",
          "Rareté : puis-je créer une urgence ou une exclusivité légitime ? (stock, durée, accès limité)",
          "Appréciation : mon audience me connaît-elle et m'apprécie-t-elle ? (histoire, personnalité, visage)",
          "Autorité : ai-je établi ma crédibilité ? (pédigrée, résultats, experts)",
          "Cohérence : puis-je obtenir un petit engagement initial ? (opt-in en 2 étapes, micro-oui)",
        ],
        errors: [
          "Utiliser la rareté ou l'urgence de façon artificielle — une fausse rareté détruit ta crédibilité.",
          "Utiliser les principes de façon isolée — la puissance vient des combinaisons.",
          "Confondre donner de la valeur et faire de la promotion — un contenu « gratuit » qui est un pitch déguisé n'active pas la réciprocité.",
        ],
        linked: ["1-5"],
        fields: [
          { k: "preuve_sociale", label: "1. Preuve sociale — où je l'active", ph: "Nombre de clients/étudiants · témoignages avec résultats précis · logos reconnaissables · activité visible (commentaires, communauté). Où dans la page ? Section dédiée, ou dispersé tout au long ?" },
          { k: "reciprocite", label: "2. Réciprocité — où je l'active", ph: "Qu'as-tu déjà donné, gratuitement, avec effort visible ? Un contenu gratuit pompeux ne compte pas — la réciprocité se déclenche quand le prospect sent l'effort que tu as fourni pour lui." },
          { k: "rarete", label: "3. Rareté — où je l'active", ph: "Doit être légitime — une fausse rareté détruit ta crédibilité si elle est percée. Ex : places limitées (justifié par le suivi individuel) · prix valable jusqu'au [date précise] · cohorte qui commence le [date]. Comment tu la justifies ?" },
          { k: "appreciation", label: "4. Appréciation — où je l'active", ph: "Ton histoire, ta personnalité, ton humain — pas un profil corporate. Les gens achètent à quelqu'un qu'ils apprécient. Comment tu te rends attachant : ton ton, tes anecdotes, ta façon d'être présent." },
          { k: "autorite", label: "5. Autorité — où je l'active", ph: "Pédigrée précis · résultats chiffrés · experts cités par leur nom · médias · certifications. L'emprunt de crédibilité fonctionne : « j'ai travaillé pour X » évite de te justifier pendant 3 paragraphes." },
          { k: "coherence", label: "6. Cohérence — où je l'active", ph: "Comment tu obtiens un premier micro-oui avant de demander l'achat ? Opt-in en 2 étapes · quiz · webinaire · défi gratuit. Chaque petit engagement ouvre la porte au suivant — lequel tu utilises ?" },
        ],
      },
      {
        code: "3-6", type: "chap", title: "Les bullets qui tuent", badge: "avatar",
        produces: "Tes bullets bénéfices, avec twist et couche émotionnelle",
        when: "Après avoir posé le problème, pour construire le désir.",
        concept: "Personne ne lit ton sommaire, tout le monde lit tes bénéfices. Une bullet mal écrite est une occasion ratée ; une bullet bien écrite est une machine à créer du désir. La différence tient à trois choses : un vrai bénéfice (pas une fonctionnalité), un twist (mécanisation, contre-intuitif, chiffre, image), et une couche émotionnelle. Mieux vaut 5 bullets tueuses que 20 bullets moyennes. En ouverture, ne dépasse pas 5 ; en mitrailleuse de fin de section désir, tu peux monter à 20 et plus.",
        q: [
          "Emplacement et quantité : ouverture (3-5) ou mitrailleuse en fin de désir (6-20+).",
          "Liste tous les bénéfices bruts, sans rédiger.",
          "Ajoute un twist à chacun : mécanisation, contre-intuitif, chiffre précis, image visuelle.",
          "Ajoute la couche émotionnelle : quelle anxiété disparaît, quelle émotion apparaît.",
          "Diversifie les angles et priorise : les 2-3 plus fortes au début, une forte à la fin.",
        ],
        errors: [
          "Utiliser un vrai sommaire — « Module 1 : Introduction » n'active aucun désir.",
          "Se contenter du bénéfice brut — « gagner du temps » est trop générique.",
          "Multiplier les bullets faibles — 5 tueuses valent mieux que 20 moyennes.",
          "Écrire toutes les bullets sur le même modèle — la répétition d'angle ennuie.",
          "Oublier le twist — sans lui, une bullet reste une phrase informative.",
          "Négliger l'émotion — les bullets rationnelles convainquent l'intelligence, pas la carte bleue.",
          "Utiliser plus de 5 bullets en ouverture — tu dilues l'attention.",
        ],
        linked: ["2-3", "1-4"],
        fields: [
          { k: "bullets", label: "Tes bullets rédigées (bénéfice + twist + émotion)", ph: "Structure : [bénéfice réel] + [twist : chiffre / mécanisme / contre-intuitif / image] + [couche émotionnelle]. Ex : « Comment fixer un prix que tes clients ne discutent pas — sans argument, sans négociation — parce que tu l'auras positionné avant même qu'ils demandent. »", repeat: true, min: 8 },
          { k: "ordre", label: "Ordre et emplacement retenus", ph: "Les 3 meilleures bullets en ouverture (≤ 5 max). Les plus fortes en mitrailleuse de désir. La bullet la plus émotionnelle en tout dernier — c'est elle qui déclenche." },
        ],
      },
      {
        code: "4-1", type: "chap", title: "L'histoire de super-héros", badge: "fixed",
        produces: "Ton histoire d'origine, montée en récit",
        when: "Monte la matière brute de la Phase 0 (chapitre 2-7) en récit rédigé.",
        concept: "Toute figure marquante a une histoire d'origine — Batman, Superman, Spider-Man. Ce n'est pas un hasard : nous avons besoin de savoir d'où vient une chose pour lui accorder de la valeur. En copywriting, ça devient l'histoire d'origine de ton produit, de ta méthode ou de toi-même. Attention à la nuance capitale : épurer est autorisé (on coupe tout ce qui n'est pas essentiel), mentir est interdit. Ton histoire n'est pas ton CV : elle sélectionne le moment pivot qui justifie ton produit.",
        q: [
          "Vrai déclencheur : le moment PRÉCIS où tu as basculé (révélation, rencontre, échec, ras-le-bol).",
          "Situation initiale visuelle : où étais-tu, que faisais-tu, comment te sentais-tu (détails sensoriels).",
          "La bascule : progressive, brutale ou ambiguë — mais claire et identifiable.",
          "Lien explicite avec ton produit ou ta méthode (sinon l'histoire reste flottante).",
          "Vérifie l'effet miroir : ton lecteur se reconnaît-il quelque part ?",
        ],
        errors: [
          "Confondre histoire d'origine et biographie — ce n'est pas ton CV.",
          "Vouloir tout raconter — chaque détail non essentiel doit être coupé.",
          "Négliger les détails visuels — sans sensoriel, l'histoire reste abstraite.",
          "Oublier le lien avec le produit — une belle histoire qui ne débouche sur rien laisse perplexe.",
          "Copier l'histoire d'un autre — ça ne peut pas fonctionner.",
          "Mentir — épurer est autorisé, inventer est interdit.",
          "Se limiter à un ton neutre — la sobriété excessive tue l'effet miroir.",
        ],
        linked: ["2-7"],
        fields: [
          { k: "declencheur", label: "Le vrai déclencheur", ph: "Le moment précis — pas une période, un instant. Ex : « C'est en lisant ce message de refus que j'ai compris... » · « C'est lors de cette réunion le 14 mars que... » · Si tu ne peux pas le dater ou le localiser, creuse encore." },
          { k: "scene", label: "Situation initiale — détails sensoriels", ph: "Où tu étais physiquement · ce que tu faisais de tes mains · ce que tu ressentais · ce qui semblait normal alors. Plus c'est sensoriel, plus le lecteur y entre. Pas « j'étais stressé » mais « je relisais mon compte bancaire pour la 3e fois ce soir-là »" },
          { k: "bascule", label: "La bascule", ph: "L'événement ou la révélation qui rend impossible le retour à l'avant. Progressive (tu t'en rends compte peu à peu) · brutale (choc immédiat) · ou ambiguë (tu ne comprends que plus tard). Doit être identifiable par le lecteur — assez précise pour qu'il sente le tournant." },
          { k: "lien", label: "Lien explicite avec ton produit", ph: "L'histoire ne peut pas rester flottante — elle doit déboucher directement sur ce que tu vends. Ex : « C'est ce moment qui m'a poussé à construire [NOM DU PRODUIT] — pour que tu n'aies pas à traverser ça. »" },
          { k: "histoire", label: "Histoire d'origine rédigée", ph: "Le récit complet, épuré de tout ce qui n'est pas essentiel. Épurer ≠ mentir : tu coupes, tu ne réinventes pas. Commence par le déclencheur, pas par ta biographie." },
        ],
      },
      {
        code: "4-2", type: "chap", title: "Inclusion / Exclusion", badge: "fixed",
        produces: "« C'est pour toi si… / ce n'est pas pour toi si… »",
        when: "Pour qualifier et renforcer l'appartenance de ta cible.",
        concept: "C'est une technique de persuasion fondée sur l'identité — le levier le plus puissant du copywriting. Tu attribues une caractéristique valorisante à ton prospect (inclusion) et tu l'opposes à un groupe qui ne la partage pas (exclusion). Le paradoxe qui fait sa puissance : plus tu excludes clairement une partie de ton audience, plus l'autre partie s'engage profondément. Instinctivement, on veut plaire à tout le monde — en copywriting, cette envie te tue. Règle d'élégance : « rien de mal à ça, mais ce n'est pas pour cette opportunité » est infiniment plus fort que le mépris.",
        q: [
          "Le vrai prospect : ses traits, valeurs, attitudes — ce qui le distingue (critères d'inclusion).",
          "Le faux prospect : qui tu ne veux PAS (chercheurs de raccourcis, etc. — critères d'exclusion).",
          "Niveau d'intensité : 1 inclusion douce / 2 exclusion assumée / 3 polarisation extrême.",
          "Test robustesse : oui massif de l'avatar, peut-être de la marge, non clair du hors-cible. Si tous réagissent pareil, il n'y a pas de tranchant.",
        ],
        errors: [
          "Vouloir plaire à tout le monde — sans exclusion nette, l'inclusion perd 90 % de sa puissance.",
          "Exclure des gens que tu voudrais avoir comme clients — l'exclusion doit être stratégique.",
          "Utiliser une polarisation extrême sur un marché débutant — il sera juste choqué.",
          "Confondre polarisation et vulgarité gratuite.",
          "Insulter ou mépriser les exclus — l'élégance est cruciale.",
          "Utiliser la technique une seule fois en début de texte — fais-la vivre tout au long.",
          "Négliger la crédibilité qui accompagne l'exclusion — si tu exiges beaucoup, tu dois valoir cette exigence.",
        ],
        linked: ["1-3", "2-3"],
        fields: [
          { k: "pourtoi", label: "C'est pour toi si…", ph: "Traits, valeurs, attitudes valorisantes — ce qui distingue ton vrai prospect. Pas des critères sociodémographiques : une posture. Ex : « Tu es prêt à remettre en question ce que tu fais depuis 3 ans » · « Tu préfères comprendre pourquoi plutôt que de juste copier »", repeat: true, min: 3 },
          { k: "pasfaite", label: "Ce n'est pas pour toi si…", ph: "Exclusion stratégique, formulée avec élégance — sans mépris. La règle : « rien de mal à ça, mais ce n'est pas pour cette opportunité ». Ex : « Ce n'est pas pour toi si tu cherches une formule magique à appliquer sans réfléchir. »", repeat: true, min: 3 },
          { k: "intensite", label: "Niveau d'intensité retenu (1-3)", ph: "1 = inclusion douce (tu identifies sans exclure vraiment) · 2 = exclusion assumée (tu nommes clairement qui n'est pas le bienvenu) · 3 = polarisation extrême (tu divises, tu provoques). Justifie ton choix par rapport à ton marché." },
        ],
      },
      {
        code: "4-3", type: "chap", title: "La boule de cristal", badge: "avatar",
        produces: "La projection sensorielle de sa vie après achat",
        when: "Pour actualiser le futur dans le présent, avant le prix.",
        concept: "Le cerveau humain est court-termiste : ton prospect ressent la douleur du présent (le prix, l'effort) bien plus fort que les bénéfices futurs. La boule de cristal renverse cette asymétrie en actualisant dans le présent les émotions que ton produit apportera plus tard. Il ne compare plus « un prix aujourd'hui contre une promesse abstraite » mais « un prix aujourd'hui contre une expérience future qu'il ressent déjà ». Le vrai talent : faire visualiser les moments intermédiaires, pas seulement le résultat final.",
        q: [
          "Liste les 5 moments post-achat : réception, 1er usage, 1er résultat, 1er « wow », intégration au quotidien.",
          "Décris chaque scène : où il est, ce qu'il ressent, voit, touche, qui l'entoure.",
          "Injecte le « premier geste » : ce qu'il fera dans les 15 premières minutes.",
          "Matérialise le produit visuellement, même s'il est numérique.",
          "Test : peut-il visualiser sa vie après ? Quelle première chose ferait-il ?",
        ],
        errors: [
          "Rester dans l'abstrait — « vous obtiendrez des résultats » ne fait rien visualiser.",
          "Décrire un futur trop lointain — « dans 5 ans tu seras millionnaire » ne convertit pas.",
          "Confondre bénéfice et visualisation — « gagner du temps » vs « rentrer à 18h au lieu de 21h ».",
          "Utiliser des adjectifs plats — choisis des mots qui font sentir.",
          "Ne pas matérialiser le numérique — tu laisses 20 à 30 % de conversions sur la table.",
          "Ne parler que du résultat final — fais visualiser les premiers gestes, les premières victoires.",
          "Oublier la scène d'usage précise.",
        ],
        linked: ["1-4"],
        fields: [
          { k: "moments", label: "Les 5 moments post-achat (scènes sensorielles)", ph: "Une scène concrète par moment — où il est, ce qu'il ressent, ce qu'il voit ou touche. Pas de résultats abstraits. Ex — 1er wow : « Il teste la technique le jeudi, le client rappelle le vendredi. Il relit le message 3 fois avant d'y croire. »", repeat: true, min: 5 },
          { k: "geste", label: "Le premier geste (15 premières minutes)", ph: "Ce qu'il fait dans les 15 premières minutes après l'achat — le geste exact. Ex : « Il ouvre la première leçon, pose son café, met ses écouteurs. » C'est ce geste précis qui rend le produit réel avant même qu'il l'utilise vraiment." },
          { k: "materialisation", label: "Matérialisation visuelle du produit", ph: "Comment rendre tangible un produit numérique ? Mockup d'interface · photo de la boîte d'accès · screenshot de la première leçon · liste des modules avec icônes. Sans ça, tu laisses 20 à 30 % de conversions sur la table." },
        ],
      },
      {
        code: "4-4", type: "chap", title: "L'ancrage", badge: "multi",
        produces: "La présentation du prix avec sa référence haute",
        when: "À la charnière désir → action, juste avant d'annoncer le prix.",
        concept: "Le cerveau humain est incapable d'estimer un prix dans l'absolu : il ne peut le faire qu'en comparaison avec les chiffres présentés juste avant — même si ces chiffres n'ont rationnellement rien à voir. L'ancrage te permet donc de rendre ton prix plus abordable sans jamais le changer : tu ne modifies pas la valeur, tu modifies le contexte perceptif. Deux règles : l'ancre doit être crédible (une ancre fantaisiste fait sentir l'arnaque), et il faut toujours justifier « le pourquoi » de ton prix bas.",
        q: [
          "Prix de référence naturel : à quoi le prospect va-t-il spontanément comparer ?",
          "Ancre haute, crédible et justifiable (accompagnement 1-to-1, concurrent premium, total des bonus…).",
          "Méthode : échelle de prix / contexte narratif / cascade + plan de paiement / addition de bonus.",
          "Écris la « raison pour laquelle » ce prix est bas — sans elle, méfiance.",
          "Place l'ancrage APRÈS la construction du désir, juste avant le CTA.",
        ],
        errors: [
          "Ancrer avec un chiffre non crédible — le prospect sent l'arnaque et se ferme.",
          "Ne pas justifier « le pourquoi » — un prix cassé sans raison est suspect.",
          "Placer l'ancrage trop tôt — l'ancrage se place après le désir.",
          "Utiliser des mots plats — « moins cher », « remise » sont fades. Cherche du concret.",
          "Ancrer sur des valeurs bidon — personne ne croit qu'un ebook de 30 pages vaut 500 €.",
          "Oublier le plan de paiement sur les produits > 300 € — c'est un ancrage quasi gratuit.",
        ],
        linked: ["4-5"],
        fields: [
          { k: "reference", label: "Prix de référence naturel du prospect", ph: "Ce à quoi il compare spontanément — sans que tu l'orientes. Ex : un coach à l'heure, une formation concurrente, ce qu'il dépenserait en publicité. C'est cette référence que tu vas supplanter avec ton ancre." },
          { k: "ancre", label: "Ton ancre haute + sa justification", ph: "Le chiffre de référence — crédible et justifiable. Ex : « Un accompagnement individuel sur ce sujet coûte entre 3 000 et 8 000 €. Cette formation vous donne le même résultat pour 10 fois moins. » · L'ancre fantaisiste fait sentir l'arnaque — reste dans le crédible." },
          { k: "methode", label: "Méthode d'ancrage retenue", ph: "Échelle de prix (tu montres le haut avant le bas) · Contexte narratif (tu racontes pourquoi ce prix est justifié) · Cascade + plan de paiement (tu découpes) · Addition de bonus (tu montres la valeur totale avant le prix). Laquelle utilises-tu et comment ?" },
          { k: "raison", label: "La « raison pour laquelle » ce prix est bas", ph: "Sans cette explication, un prix trop bas est suspect. Ex : « Je peux proposer ce tarif parce que je ne fais pas de coaching individuel — ce que tu paies, c'est uniquement la méthode, packagée une fois pour toutes. »" },
        ],
      },
      {
        code: "4-5", type: "chap", title: "La garantie excessive", badge: "multi",
        produces: "Ton renversement de risque, rendu impossible à ignorer",
        when: "Juste avant l'appel à l'action final.",
        concept: "« 100 % satisfait ou remboursé sous 30 jours » a été tellement répété que c'est devenu invisible — Amazon et Zappos ont normalisé le remboursement gratuit, ta garantie classique n'a plus rien d'exceptionnel. Deux stratégies : insister (rendre une garantie classique impossible à ignorer par la visualisation et les détails ultra-précis) ou casser le pattern (proposer une garantie inhabituelle, presque trop généreuse). L'objectif : que le prospect se dise « s'il propose ça, c'est qu'il croit vraiment en son produit ». À cet instant, la garantie devient elle-même une preuve de qualité.",
        q: [
          "Niveau de conviction : peux-tu vraiment promettre un résultat court terme (7-14 jours) sans te ruiner ?",
          "Forme : 1 insistance classique / 2 obligatoire (résultat mesurable) / 3 compensation démultipliée / 4 multiple.",
          "Résultat mesurable, précis, court terme (« 100 abonnés en 7 jours », pas « des résultats »).",
          "Insistance visuelle : badge, titre avec power word, personnalisation (« j'insiste »).",
          "Boule de cristal du remboursement : qui il contacte, comment, en combien de temps.",
          "Bonus ou inversion qui pousse au-delà du raisonnable (garder les matériaux, etc.).",
        ],
        errors: [
          "Utiliser une simple mention « satisfait ou remboursé 30 jours » — c'est devenu invisible.",
          "Proposer une garantie extrême sur un produit moyen — remboursements en masse et réputation détruite.",
          "Garantir un résultat que tu ne peux pas tenir.",
          "Placer la garantie trop tôt — avant le désir, elle envoie un signal « tu vas peut-être vouloir rembourser ».",
          "Rendre le processus de remboursement compliqué — chaque friction détruit la puissance.",
          "Insister sans détails concrets — détailler le processus et les délais, c'est ça insister.",
          "Copier une formulation vue ailleurs sans l'adapter.",
        ],
        linked: ["4-4", "1-5"],
        fields: [
          { k: "conviction", label: "Ton niveau de conviction réel", ph: "Honnêtement : peux-tu promettre un résultat court terme sans te mettre en danger ? Si tu doutes, commence par l'insistance classique — ne promets jamais un résultat que tu ne peux pas tenir." },
          { k: "forme", label: "Forme de garantie retenue (1-4)", ph: "1 = Insistance (classique mais rendue impossible à ignorer par les détails) · 2 = Obligatoire (résultat mesurable garanti ou remboursé) · 3 = Démultipliée (tu rembourses + tu donnes quelque chose en plus) · 4 = Multiple (plusieurs niveaux combinés). Laquelle et pourquoi ?" },
          { k: "resultat", label: "Le résultat mesurable garanti", ph: "Précis, chiffré, court terme — pas « des résultats » mais « X en Y jours ». Ex : « Si tu n'as pas décroché ton premier entretien dans les 14 jours, je te rembourse intégralement. » · Court terme = crédible et vérifiable." },
          { k: "process", label: "Le processus de remboursement, détaillé", ph: "Qui il contacte · comment (email, formulaire ?) · délai de réponse garanti · délai de remboursement. Plus c'est précis, plus la garantie rassure. Ex : « Tu envoies un email à [adresse], je rembourse sous 48h ouvrées, sans question. »" },
          { k: "bonus", label: "Bonus / inversion qui surprend", ph: "Ce qui pousse la garantie au-delà du raisonnable et déclenche le « s'il propose ça, il croit vraiment en son produit ». Ex : garder l'accès aux ressources même après remboursement · recevoir un bonus supplémentaire si ça ne marche pas." },
        ],
      },
    ],
  },
  {
    id: "p3", tag: "Phase 3", name: "Finition & contrôle",
    goal: "Le texte est écrit. Contrôle avant publication. Tant que tout n'est pas coché, tu ne publies pas.",
    steps: [
      {
        code: "3-7", type: "chap", title: "Mise en page — la lisibilité avant la beauté", badge: "fixed",
        produces: "Une page scannable et lisible",
        when: "Une fois le texte écrit.",
        concept: "La mise en page n'est pas ce qui vend. La lisibilité doit toujours venir avant la beauté — c'est l'équivalent visuel de « la clarté avant la persuasion ». L'erreur du débutant : transformer sa page en sapin de Noël (animations, couleurs, icônes, effets), en croyant qu'une belle page augmente les ventes. C'est faux, et souvent contre-productif : à force d'ajouter du visuel, on dégrade la lisibilité, donc l'attention, donc les ventes. Si ton travail de recherche est bon, tu n'as pas besoin d'une belle page — tu as besoin d'une page qu'on peut lire.",
        q: [
          "Lisibilité : largeur ≤ 700px, police ≥ 14px, texte sombre sur fond clair, paragraphes de 3-4 lignes max.",
          "Navigation : sous-titres tous les 3-5 paragraphes, sections distinguables, éléments clés en emphase.",
          "Visuels : zéro stock photo générique, photo perso ou équipe, représentation du produit, captures concrètes.",
          "Couleurs : 2 couleurs principales maximum, bouton CTA d'une couleur distincte.",
          "Effets : pas d'animations gratuites. Le simple noir sur blanc suffit si le texte est bon.",
        ],
        errors: [
          "Croire qu'une belle page vendra mieux — c'est le texte qui vend.",
          "Utiliser des stock photos génériques — signal amateur immédiat.",
          "Faire des pages trop larges — la lecture devient un effort.",
          "Utiliser une police trop petite.",
          "Négliger les sous-titres — sans eux, personne ne scanne, donc personne ne lit.",
          "Multiplier les couleurs — plus de 2 couleurs principales = chaos visuel.",
          "Oublier la représentation visuelle d'un produit immatériel — le cerveau a besoin de « toucher ».",
          "Vouloir en faire trop par peur du vide — le blanc est ton allié.",
        ],
        linked: ["1-8"],
        fields: [
          { k: "notes", label: "Points de mise en page à corriger", ph: "Un problème concret par ligne. Ex : « Paragraphes de 8 lignes → couper en 3-4 » · « Pas de sous-titres dans la section désir » · « Bouton CTA même couleur que le fond » · « Police trop petite sur mobile »", repeat: true, min: 3 },
          { k: "visuels", label: "Visuels prévus", ph: "Photo de toi (pas un stock) · mockup du produit ou screenshot de l'interface · image qui matérialise le résultat. Pour chaque visuel : où il se place dans la page et ce qu'il doit communiquer." },
        ],
      },
      {
        code: "QA-1", type: "qa", title: "Ratio je/vous vérifié", badge: "fixed",
        produces: "Le « vous » domine largement le « je / nous »",
        when: "Recompte tes pronoms sur toute la page.",
        concept: "C'est la vérification la plus rapide de tout le copywriting : compte les pronoms. Si les « je / nous / notre » dominent, ta page parle de toi et pas de ton prospect — quelle que soit la qualité du reste.",
        q: [
          "Compte les pronoms de 1re personne (je, nous, notre) vs 2e (vous, votre).",
          "Si le « je/nous » domine une section, réécris-la du point de vue du prospect.",
        ],
        errors: [],
        linked: ["1-1"],
        fields: [],
      },
      {
        code: "QA-2", type: "qa", title: "Chaque objection a sa réponse", badge: "fixed",
        produces: "Aucune objection de la Phase 0 laissée sans réponse",
        when: "Reprends ta liste d'objections (chapitre 1-7) et coche-les une à une.",
        concept: "Une seule objection non traitée peut tuer la vente, même si tout le reste est excellent. Ouvre ta liste du chapitre 1-7 en vis-à-vis et vérifie, une par une, que chacune est traitée explicitement dans le texte.",
        q: [
          "Pour chaque objection listée en Phase 0 : où exactement est-elle traitée dans le texte ?",
          "Vérification finale : « Reste-t-il une raison crédible de ne pas acheter ? »",
        ],
        errors: [],
        linked: ["1-7"],
        fields: [],
      },
      {
        code: "QA-3", type: "qa", title: "Chaque promesse est prouvée", badge: "fixed",
        produces: "Aucune affirmation nue",
        when: "Relis chaque promesse et cherche la preuve associée.",
        concept: "Règle du chapitre crédibilité : ta crédibilité doit toujours être supérieure à ta promesse. Une promesse sans preuve ne décrédibilise pas seulement cette promesse — elle décrédibilise toute la page.",
        q: [
          "Chaque promesse est-elle adossée à une preuve (témoignage, chiffre, mécanisme, autorité) ?",
          "Sinon : ajoute la preuve, ou supprime la promesse.",
        ],
        errors: [],
        linked: ["1-5"],
        fields: [],
      },
      {
        code: "QA-4", type: "qa", title: "Un seul CTA, clair et répété", badge: "fixed",
        produces: "L'action attendue est évidente",
        when: "Vérifie qu'on ne se demande jamais quoi faire.",
        concept: "Le paradoxe du choix appliqué à la fin : un seul CTA prioritaire, formulé en verbe d'action + bénéfice, répété aux bons moments. Si le lecteur doit réfléchir à ce qu'il doit faire, il partira.",
        q: [
          "Un seul CTA prioritaire ? Formulé en verbe d'action + bénéfice ?",
          "Est-il répété aux bons moments, dont juste après la garantie ?",
        ],
        errors: [],
        linked: ["1-6"],
        fields: [],
      },
    ],
  },
];

// EXEMPLES — extraits condensés du cours, organisés par chapitre.
// long:false = traitement standard (2-4 phrases). long:true = traitement étoffé (6-12 phrases, formule clé conservée).
const EXAMPLES = {
  "1-1": [
    { title: "La batterie (message fictif)", long: false, text: "Version entreprise : « Nos chercheurs ont découvert une batterie qui dure 30 % plus longtemps. » Version prospect : « Votre téléphone tombe à court de batterie en fin de journée, cette batterie dure toute la journée sans chargeur. » Même produit, mais la seconde version parle de l'expérience vécue au lieu de la technique — c'est elle qui convertit." },
    { title: "L'agence de référencement (site réel)", long: false, text: "Titre original : « Pourquoi nous choisir comme prestataire ? » — jargon technique, pronoms centrés entreprise. Réécrit : « Comment choisir votre agence de référencement ? » avec les conséquences pour le client (pénalités Google) au centre. Le ratio de pronoms s'inverse complètement, et le message devient plus court et plus persuasif à information égale." },
    { title: "La page « à propos » de Marketing Mania", long: false, text: "Structure : qui je suis (2 phrases) → ce que vous allez obtenir → ce que vous allez trouver → mon parcours (en dernier). L'erreur classique est de mettre son histoire personnelle en premier ; même sur une page qui parle de soi, la question du visiteur reste « qu'est-ce que j'ai à y gagner ? »." },
  ],
  "1-2": [
    { title: "L'article et le sac à main (réciprocité)", long: false, text: "Dire « voici un article » ne vaut rien ; dire « j'ai passé un mois dessus, interviewé 15 personnes, lu 10 études » augmente la valeur perçue à contenu identique. Même mécanisme pour un sac à main « fabriqué à la main, 10h de travail » : l'effort visible est un levier de valorisation en soi." },
    { title: "L'information confidentielle et le carré VIP (rareté)", long: false, text: "La même information publique ou présentée comme confidentielle ne produit pas le même effet — la rareté de l'accès crée la valeur perçue, indépendamment du contenu. Le carré VIP en boîte de nuit fonctionne pareil : la seule différence, c'est l'exclusivité de l'accès, et cette exclusivité suffit. Point clé : cette valeur perçue est réelle, pas une manipulation — cadrer par la rareté, c'est créer de la valeur, pas tromper." },
    { title: "Tupperware et le MLM (appréciation)", long: false, text: "Le modèle des « soirées Tupperware » fonctionnait parce qu'une hôte sans formation en vente pouvait vendre efficacement, uniquement parce que les invitées l'appréciaient. L'appréciation est un levier si puissant qu'il peut compenser entièrement l'absence de compétences commerciales." },
    { title: "L'opt-in en deux étapes et les upsells Amazon (cohérence)", long: false, text: "Faire cliquer d'abord sur « Télécharger » puis afficher le formulaire convertit mieux que montrer le formulaire directement : la personne reste cohérente avec son premier geste. Même logique pour les upsells Amazon (coque, film de protection proposés après l'achat) — chaque petit engagement ouvre la porte au suivant." },
  ],
  "1-3": [
    { title: "Kinder Bueno vs Mercedes", long: false, text: "Le Kinder Bueno s'achète sans justification, sur l'envie pure. La Mercedes s'achète en disant « c'est fiable, c'est un bon investissement » — mais ces raisons arrivent après coup pour habiller une décision déjà prise émotionnellement (se voir au volant, devenir quelqu'un d'autre). La justification rationnelle ne précède jamais la décision, elle la suit." },
    { title: "Le PC Asus", long: false, text: "Quelqu'un utilise un PC Asus 10h/jour pendant 2 ans et doit retourner l'appareil pour se rappeler la marque. Un produit vendu uniquement sur la raison (rapport qualité-prix) n'existe jamais dans l'identité du client : il reste interchangeable, en concurrence directe avec tout le marché." },
    { title: "WP Marmite (technique vendue en émotion)", long: true, text: "Un livre technique (apprendre HTML/CSS pour personnaliser un thème WordPress) ouvre sa page de vente non pas sur la technique mais sur la peur : « l'idée de faire une modification et de tout casser vous empêche d'avancer. » Vient ensuite un pivot rationnel (le coût d'un développeur, la dépendance), puis la formule de clôture : « Relooker son thème vous permettra de gagner en maîtrise et en sérénité. » « Maîtrise » est à la fois rationnel et émotionnel ; « sérénité » est de l'émotion pure, sans aucune logique. La leçon : même un produit très technique se vend par la psychologie, la technique reste subordonnée à l'émotion et à l'identité." },
    { title: "Apple, publicité 1984", long: false, text: "L'une des publicités les plus célèbres illustre le niveau identitaire : Apple ne vend pas des spécifications, elle vend une identité (« ceux qui pensent différemment »). C'est le niveau de persuasion le plus puissant du triptyque raison/émotion/identité — plus fort que la peur, parfois plus fort que la survie." },
    { title: "Avant/après (transformations physiques)", long: false, text: "Deux photos côte à côte, sans un mot d'argumentaire : un corps avant, un corps après. Le cerveau ne raisonne pas, il projette immédiatement le prospect dans l'image de droite — la technique est si efficace qu'elle est interdite dans certains pays pour certains produits." },
    { title: "Le végétarisme (émotion vs identité)", long: false, text: "Les arguments rationnels (impact environnemental, coût énergétique) convainquent peu. Une image d'abattoir agit sur l'émotion. Mais c'est l'identité qui rend le changement durable et irréversible : quand « ne pas manger de viande » devient cohérent avec qui on est, ce n'est plus une privation, c'est un plaisir — le calcul douleur/plaisir s'inverse complètement." },
    { title: "L'épargne et le visage vieilli (Daniel Goldstein)", long: true, text: "Aux États-Unis, les moins de 35 ans n'épargnent presque pas : le plaisir futur (à 75 ans) est trop abstrait face à la douleur immédiate de mettre de l'argent de côté. Le psychologue Daniel Goldstein a testé la visualisation simple (montrer à quoi ressemblerait la vie à 75 ans), avec un premier effet positif. Il est allé plus loin en faisant vieillir numériquement le visage des participants et en le reliant à leur comportement d'épargne : épargne faible → visage triste et fatigué, épargne forte → visage rayonnant. L'impact a été massif, parce que le futur n'était plus un chiffre abstrait dans 50 ans mais leur propre visage, devant eux, souriant ou souffrant selon leur décision présente. La leçon : rendre le futur visible et tangible le rend réel, et seul ce qui est réel motive le cerveau humain." },
    { title: "L'achat à crédit", long: false, text: "Demander 2000 € cash pour un MacBook crée une forte résistance ; proposer « repartez aujourd'hui, vous ne payez rien tout de suite » fait accepter plus facilement le même montant (souvent majoré d'intérêts). Ce n'est pas le montant qui décide, c'est le timing émotionnel entre plaisir immédiat et douleur différée." },
  ],
  "1-4": [
    { title: "Produits vendus uniquement sur la raison", long: false, text: "Billets d'avion low cost, produits premier prix, PC grand public : dans ces catégories le consommateur compare, optimise, arbitre en permanence. Conséquence mécanique : faible différenciation, faibles marges, guerre des prix permanente — le prix devient le seul argument." },
  ],
  "1-5": [
    { title: "La règle des 10 secondes", long: false, text: "L'impression que fait un site dans les 10 premières secondes décrédibilise ou crédibilise mécaniquement tout ce qui suit — un design amateur plombe le message avant même qu'il soit lu. Ce n'est pas rationnel, mais c'est déterminant : c'est l'équivalent d'un uniforme (costume, uniforme de police) qui envoie un signal de légitimité avant même qu'on ait parlé." },
    { title: "L'intervenant en conférence", long: false, text: "Un intervenant compétent prend la parole ; première question du public : « Vous êtes qui, pourquoi vous croire ? » Sans avoir établi son pédigrée au préalable, son message perd en crédibilité même s'il est bon. Le pédigrée n'est pas un bonus, c'est un prérequis." },
    { title: "L'emprunt de crédibilité", long: false, text: "« J'aide les entreprises à développer leur marketing » vs « J'ai travaillé pour Microsoft et eBay » : la seconde formule évite toute justification en empruntant la crédibilité de l'entreprise citée. Peu importe si c'est objectivement pertinent — en persuasion, l'effet suffit." },
    { title: "Les commentaires sur un lancement", long: false, text: "Peu de gens lisent vraiment les commentaires nombreux sous un lancement — ce n'est pas le but. Le signal visuel de masse (« beaucoup de gens s'y intéressent, je ne suis pas seul ») suffit à crédibiliser, indépendamment du contenu des commentaires." },
    { title: "Les médias", long: false, text: "Afficher des logos de presse ou un passage TV rend crédible même si l'intervention était courte et peu substantielle — c'est un raccourci mental : si les médias en parlent, c'est que ça vaut quelque chose. Le bouche-à-oreille reste la forme de preuve sociale la plus puissante, plus forte qu'un témoignage écrit." },
    { title: "Le contenu régulier (vlog/podcast) — Antoine BM", long: false, text: "Un vidéaste qui publie quotidiennement devient familier, presque un ami pour son audience, qui le suit dans ses galères et ses succès. Le jour où il vend une formation, ses abonnés de longue date n'ont plus besoin d'être convaincus — la relation construite en amont fait le travail." },
    { title: "Les e-mails simples vs corporate", long: false, text: "Un e-mail au design lourd déclenche le réflexe « c'est une entreprise qui veut me vendre quelque chose » et se fait fermer ; un e-mail simple, direct, conversationnel, ressemble à un message humain et fonctionne presque toujours mieux. Plus tu ressembles à une vraie personne qui s'adresse à une vraie personne, plus tu es cru." },
    { title: "Le produit d'appel et le projet test", long: false, text: "Un petit produit peu cher (1 à 20 €) ou un petit projet test à coût réduit ne sert pas la vente immédiate : il transforme le prospect en quelqu'un qui t'a déjà fait confiance, plus enclin à acheter plus cher ensuite. Le plus difficile n'est pas de continuer, c'est de commencer." },
    { title: "Les garanties (renversement du risque)", long: false, text: "Satisfait-ou-remboursé, garantie deux ans, prix le plus bas garanti : ces formules réduisent la douleur d'achat et augmentent la confiance (« s'ils offrent ça, c'est qu'ils sont sûrs »). Tu ne dis plus « fais-moi confiance », tu dis « tu ne risques rien » — et entre les deux, il y a un monde." },
  ],
  "1-6": [
    { title: "L'expérience des confitures", long: true, text: "Étude classique de 2000 : une table de dégustation propose 24 variétés à un groupe et 6 variétés à un autre, avec un coupon de réduction à la fin. Résultat : les gens achètent 10 fois plus quand on leur propose seulement 6 variétés — trop d'options paralyse la décision plutôt que de la faciliter. Pire, les études ultérieures montrent que plus on propose d'options, moins les gens sont satisfaits de leur choix final (chaque option non choisie devient un doute : « et si l'autre était meilleure ? »). Sur le web, ce phénomène est amplifié parce que tout va vite, tout est accessible, et l'alternative est à un clic (Facebook, YouTube). Conséquence pratique : une page qui poursuit plusieurs objectifs à la fois (vendre, récupérer des emails, pousser vers les réseaux) noie le visiteur, qui finit par partir sans décider — la règle d'or est qu'une page = un seul objectif." },
    { title: "Une page confuse (bouton, menu, offre, promo...)", long: false, text: "Une page qui propose bouton, menu, offre, lien, promo et navigation en même temps fait scanner, hésiter puis abandonner le visiteur. Ce n'est pas un problème de design mais d'effort mental — une bonne page enlève des choix, elle n'en ajoute pas." },
    { title: "CTA flou vs CTA clair", long: false, text: "« En savoir plus » ou « Découvrir » font hésiter le cerveau (qu'y a-t-il derrière ? est-ce risqué ?). « Voir les tarifs » ou « Combien ça coûte » ne laissent aucun doute ni aucun effort de décision." },
    { title: "Offre en 3 niveaux", long: false, text: "Basique / intermédiaire / premium : le choix reste rapide (« je prends le moyen » ou « je prends le top »). Au-delà de 3-4 options le cerveau commence à se disperser et la conversion baisse." },
    { title: "Amazon et le choix en cascade", long: false, text: "Face à des centaines de smartphones, Amazon ne montre jamais tout d'un coup : il fait construire le choix étape par étape (catégorie → marque → budget → OS), avec 3 à 6 options simples à chaque étape. La leçon : Amazon ne simplifie pas les produits, il simplifie le chemin — une grande décision devient acceptable une fois découpée en petites décisions faciles." },
    { title: "L'email à un seul argument", long: false, text: "Un email qui empile plusieurs arguments, une promo et un PS fait lire en diagonale et fermer sans agir. Un email dédié à un seul angle, développé et rendu viscéral, se comprend, se ressent et déclenche l'action — la concentration multiplie l'impact là où l'accumulation le dilue." },
  ],
  "1-7": [
    { title: "Le piège du B2B", long: false, text: "Un ROI calculé, prouvé, chiffré — et pourtant le prospect hésite, parce qu'une objection émotionnelle non traitée (« et si ça ne marche pas pour moi ? ») bat n'importe quel argument rationnel. Tant que l'émotion n'est pas adressée, la logique ne déclenche rien." },
    { title: "Le copywriting « ça ne s'applique pas à moi »", long: false, text: "Chaque prospect (formateur, éditeur de logiciel, e-commerçant) pense que le copywriting concerne « les autres ». La réponse n'est pas d'expliquer que ça s'applique partout, mais de multiplier les cas concrets adaptés à chaque situation, pour que le prospect ne puisse plus se réfugier derrière son « cas particulier »." },
    { title: "L'ancrage sur un prix de prestation", long: false, text: "Une prestation à 500 € semble chère ou pas selon le contexte : en créant un second plan à 2000 € en comparaison, les 500 € paraissent soudain raisonnables. Un prix ne choque jamais seul, il choque en comparaison." },
    { title: "Headspace — « 10 minutes par jour »", long: false, text: "Face à l'objection « je n'ai pas le temps », Headspace ne dit pas « la méditation transforme ta vie » mais « 10 minutes par jour ». L'effort devient concret et acceptable au lieu de rester flou et menaçant — le mot « méditer » fait peur, « 10 minutes » rassure." },
    { title: "Ramit Sethi — l'objection identitaire à 2000$", long: true, text: "Ramit Sethi vend une formation à 2000$ pour négocier son salaire ; l'objection cachée est « si mes potes apprennent que j'ai payé ça, ils vont se moquer de moi ». Il ne répond pas par la raison (« le ROI est énorme ») mais frontalement par l'identité : « Pendant que tes potes se moquent de toi, toi tu apprends, tu négocies, tu gagnes 15 000$ de plus par an — sur 30 ans avec intérêts composés, ça fait 1,5 million de dollars de plus à la retraite. Pendant ce temps, eux ont dépensé leur argent en sorties et se sont fait sous-payer. Tu préfères être quoi : un winner qui investit, ou un loser qui accepte le statu quo ? » Quand tu repositionnes au niveau identitaire, l'achat n'est plus une dépense, c'est un choix de qui on est — et personne ne va à l'encontre de l'identité qu'il choisit pour lui-même." },
    { title: "Nommer le doute — « Est-ce que je peux te faire confiance ? »", long: false, text: "Écrire dans une FAQ « Tu te demandes peut-être si tu peux me faire confiance, c'est normal, voici pourquoi... » nomme à voix haute le doute du prospect. Ce geste rend plus crédible, précisément parce que quelqu'un qui ose poser la question lui-même n'a probablement pas grand-chose à cacher." },
  ],
  "1-8": [
    { title: "Une formation en copywriting (page longue justifiée)", long: false, text: "Pour convertir, la page doit répondre à des dizaines de questions (produit, pertinence, crédibilité, pratique) qui n'ont pas de réponse évidente par le contexte. Résultat inévitable et normal : une page longue, parce que chaque question sans réponse est une objection qui reste." },
    { title: "Une souris sur Amazon (page ultra-courte)", long: true, text: "À l'extrême opposé, vendre une souris sur Amazon ne demande presque rien : « qu'est-ce que c'est » se répond avec l'image et le titre, « qui êtes-vous » ne se pose même pas (on est sur Amazon), « est-ce fiable » est répondu par les évaluations. Écrire une page de vente de 10 000 mots pour une souris ferait fuir tout le monde. La règle universelle : plus le produit engage au niveau identitaire (transformation, prix élevé), plus la page doit être longue ; plus il ne joue que sur le détail produit dans un contexte déjà crédibilisé (marketplace connue), plus elle peut être courte. Le mythe « les gens ne lisent plus » est faux : si une page bien faite ne trouve pas de lecteurs, ce n'est pas parce qu'elle est trop longue, c'est parce qu'elle ne parle pas d'un vrai problème." },
  ],
  "1-9": [
    { title: "Les films d'art et essai vs les blockbusters", long: false, text: "Spielberg, Star Wars, Le Seigneur des Anneaux réutilisent tous un schéma narratif classique (l'appel du héros) ; ceux qui veulent « briser tous les schémas » font des films d'art et essai que personne ne va voir. Les structures classiques fonctionnent parce qu'elles correspondent à la façon dont les humains traitent l'information — il n'y a aucune honte à réutiliser des formules qui marchent." },
    { title: "Programmeurs et ingénieurs — la vraie définition de la créativité", long: true, text: "Un programmeur face à un problème sans solution toute faite fait un travail profondément créatif, même si personne ne dira « c'est de l'art ». La créativité est née, biologiquement, du besoin de résoudre des problèmes dans des environnements nouveaux (désert, jungle, Grand Nord) — pas du besoin de produire de la beauté. En copywriting, la créativité se déploie dans 6 zones précises : adapter les formules à sa situation (pas les remplacer), capter et maintenir l'attention, construire une PVU différenciée et désirable, établir la crédibilité rapidement, et plusieurs autres zones où la formule seule ne suffit pas — c'est là, et seulement là, qu'il faut inventer." },
  ],
  "2-1": [
    { title: "La belle maison au milieu du désert", long: false, text: "Une maison magnifique, parfaitement construite — mais en plein désert : personne n'en veut. Toute l'architecture, toute la persuasion du monde ne sauve pas un produit qui répond à un besoin qui n'existe pas." },
    { title: "Le ventilateur sur les baguettes", long: false, text: "Une vraie invention (un ventilateur fixé sur des baguettes pour refroidir les nouilles) mais le problème résolu n'existe pas vraiment pour le marché. Métaphore des créateurs qui peaufinent leur produit sans jamais vérifier si le problème est réel et douloureux." },
    { title: "Les pneus de couleur", long: false, text: "Une innovation réelle (pneus bleus, rouges, verts) mais sur un critère qui n'intéresse pas le marché. Des pneus plus durables ou moins chers auraient eu une vraie valeur différenciante — la nouveauté seule ne compte pas, seule compte la nouveauté qui résout un vrai problème." },
    { title: "Walkman vs iPod", long: false, text: "Apple n'invente pas le marché du baladeur (déjà occupé par le Walkman) mais résout mieux le même problème : plus besoin de transporter cassettes ou CD, toute la musique tient dans la mémoire interne. La différenciation gagnante s'aligne sur un besoin réel déjà présent." },
    { title: "Le tripod Joby et le Pocket Tripod", long: false, text: "Sur le même marché historique des tripods, Joby résout l'instabilité sur sol inégal (jambes flexibles qui s'enroulent autour d'un support) tandis que Pocket Tripod résout l'oubli (un tripod format carte bancaire toujours dans le portefeuille, des dizaines de milliers de dollars levés sur Kickstarter pour un produit à 15$). Deux différenciations sur un même marché, chacune répondant à un vrai besoin distinct." },
    { title: "GoPro, un problème précis", long: false, text: "Pendant que les concurrents se battaient sur les mégapixels, GoPro a choisi un autre terrain : une caméra qui résiste aux coups, à l'eau, au froid. Différenciation claire sur un problème précis, alignée avec le vrai besoin des sportifs extrêmes." },
    { title: "Marketing for Product People et Art Marketing Secret, un marché précis", long: false, text: "Sur un sujet saturé (le marketing), Justin Jackson cible les programmeurs frustrés par un discours marketing trop vague ; Art Marketing Secret cible les artistes qui croient succès commercial et intégrité créative incompatibles. Même problème, deux marchés précis, deux PVU totalement différentes." },
    { title: "La PVU de GoPro et de Marketing Mania", long: false, text: "GoPro : « Une caméra que tu peux emmener partout dans ton sport extrême, et qui ne se cassera jamais » — aucune mention technique. Marketing Mania : « Un site qui vous aide à convertir plus de visiteurs en clients » — une phrase qui synthétise la promesse centrale même si le site couvre bien plus de sujets. Une PVU concise se répète facilement, et la répétition rend les choses vraies dans l'esprit du prospect." },
  ],
  "2-2": [
    { title: "Grille de lecture appliquée à des PVU réelles", long: false, text: "Le chapitre invite à réunir 3 PVU fortes (de son marché ou d'ailleurs) et à les passer systématiquement dans la grille : quel problème, pour qui, quelle différenciation, et cette différenciation a-t-elle une vraie valeur pour la cible. L'objectif n'est pas seulement de comprendre des cas isolés, mais de prendre l'habitude d'analyser n'importe quel produit avec cette même checklist." },
  ],
  "2-3": [
    { title: "Le test de l'avatar flou", long: false, text: "« Je cible les PME qui veulent augmenter leurs ventes » est une réponse floue qui prédit un échec en copywriting. La vraie question : quels désirs, quelles peurs, quelles expériences passées, quelles objections précises porte cette personne — si la réponse est un silence, le message restera généraliste, donc mou." },
    { title: "Apple, Nike, Facebook — la précision n'est pas réservée aux niches", long: false, text: "Même les géants ciblent un profil psychologique précis : Apple sait quelles émotions et quelle identité ses clients recherchent, Nike cible le dépassement de soi et le statut, Facebook ne vise jamais « tout le monde ». La précision de l'avatar n'est pas un luxe de petite niche, c'est ce qui fait un message puissant à toute échelle." },
  ],
  "2-3bis": [
    { title: "Le nouveau modèle d'ordinateur — question fermée vs ouverte", long: true, text: "Demander « quelle couleur préférez-vous ? » donne des statistiques sur la couleur, mais ne dit rien sur son importance réelle — le vrai facteur pourrait être le processeur ou la vitesse d'allumage, jamais mentionné parce que jamais demandé. Poser une question ouverte et laisser parler fait remonter en premier ce qui compte vraiment pour la personne, consciemment et inconsciemment. Le piège complémentaire : ce qui est évident pour le créateur (« le format vidéo ou PDF, c'est juste le contenant ») ne l'est pas pour le prospect, qui en fait une vraie question — sans réponse, elle devient une objection silencieuse. Les 3 questions à poser systématiquement : quel est ton objectif principal, quel obstacle t'en empêche, à quoi ressemblera ta vie une fois l'objectif atteint." },
    { title: "Vocabulaire technique vs vocabulaire client", long: false, text: "En conseil sur les pubs Facebook, le jargon technique doit rester dans la pratique et disparaître entièrement de la vente : parler comme le client parle, penser comme il pense, ouvre la porte que le jargon professionnel ferme. L'expertise ne se prouve pas par le vocabulaire, elle se prouve par la précision de l'écoute." },
  ],
  "2-4": [
    { title: "Le Plan d'Action, copié mais jamais égalé", long: true, text: "Une formation en séduction cartonne avec un positionnement précis (le vrai obstacle n'est pas le manque de technique, c'est la peur). Plusieurs concurrents copient le positionnement, certains jusqu'à copier-coller des parties de la page de vente — et ça ne marche pas pour eux. Deux raisons : ils ont copié la promesse visible mais pas le mécanisme construit en amont par le contenu et la relation ; et leurs prospects n'avaient pas la même relation de confiance préalable avec eux. Une proposition de valeur copiée n'est pas une proposition de valeur volée : l'avantage compétitif tient à la relation construite au fil du temps, pas seulement au positionnement — c'est un mur que la copie de mots ne peut pas franchir." },
  ],
  "2-5": [
    { title: "Apple Macintosh 1984", long: true, text: "Avant le Macintosh, tous les ordinateurs se battaient sur le même terrain : performance et prix. Apple change de jeu : le vrai problème n'est pas la performance, c'est que les ordinateurs sont incompréhensibles — le débat se déplace vers l'interface et la simplicité. La pub légendaire ouvre sur « In ancient times, few people used computers » (dans les temps anciens) — tout ce qui précède le produit devient déjà de « l'antiquité », une rupture historique assumée. Puis des images viscérales : « écouter des séminaires pendant que votre estomac gargouillait », « vous endormir devant des manuels » — on ne dit pas que les ordinateurs sont compliqués, on le fait ressentir physiquement. C'est la recontextualisation la plus célèbre de l'histoire de la tech : déplacer le jeu plutôt que jouer mieux au même jeu." },
    { title: "WP Curve — du coût à la liberté d'esprit", long: true, text: "Sur le marché saturé et low-cost du support WordPress, WP Curve ne peut pas gagner en jouant sur le prix. Il déplace le problème : ce n'est plus une question de coût, c'est une question de liberté d'esprit et de temps — un déplacement qui parle directement aux entrepreneurs, prêts à payer cher pour réinvestir ce temps ailleurs. La page ouvre sur « Imaginez ne plus jamais avoir un autre mal de tête avec WordPress » : « mal de tête » est un mot de puissance viscéral, la douleur d'aujourd'hui contrastée avec le bénéfice — le temps libre — juste après. Un témoignage renforce le tout : « WP Curve s'assure que je dors comme un bébé chaque nuit »." },
    { title: "Contactually — du coût au ROI", long: false, text: "Sur le marché encombré et centré-coût des CRM, Contactually déplace le problème vers le retour sur investissement : « le retour en nouveaux clients est démesuré par rapport à ce que vous payez ». Argument clé pour les agents immobiliers : 85 % de leur business vient des références d'anciens clients — dès lors, 100$/mois pour un outil qui sécurise 85 % des revenus devient une évidence, pas une dépense." },
    { title: "Le Plan d'Action — du externe à l'interne", long: true, text: "Sur le marché de la séduction, saturé de techniques, phrases et routines à apprendre (tout est « externe »), l'auteur recontextualise vers l'interne : le vrai problème n'est pas le manque de technique, c'est la peur et le manque de confiance. Le programme s'appelle « Le Plan d'Action » — pas « comment aborder » — avec une promesse déjà mécanisée : une méthode étape par étape. Tous les concurrents qui continuent à vendre des techniques deviennent instantanément hors-sujet, puisqu'ils répondent à un problème que ce produit affirme être secondaire." },
    { title: "Pono — la technologie justifiée par l'art", long: false, text: "En 2014, un lecteur MP3 semble être un produit mort face aux smartphones — pourtant Pono lève 6,2 millions de dollars sur Kickstarter (18 000 personnes). Le déplacement : ce n'est plus de la technologie, c'est de l'art — « la musique compressée sacrifie l'impact émotionnel que seule une haute qualité peut délivrer ». Cet argument ne parle à personne d'occasionnel, mais parle très fort à qui s'identifie comme mélomane exigeant : cibler une identité forte permet de faire payer ce qu'on veut." },
  ],
  "2-6": [
    { title: "Les théories du complot du 11 septembre", long: false, text: "Un argument pseudo-scientifique (le carburant ne peut pas faire fondre l'acier) combiné à un mobile (accéder au pétrole) suffit à convaincre, même si aucun des deux croyants n'est qualifié pour juger la métallurgie. Une mécanisation n'a pas besoin d'être vraie pour fonctionner — elle a juste besoin d'être explicable et cohérente en surface." },
    { title: "Les arnaques au gain facile", long: false, text: "« J'ai un système magique pour gagner à tous les coups au poker » fonctionne sur le même ressort qu'une mécanisation légitime : une explication qui semble cohérente convainc, peu importe sa véracité réelle. C'est un rappel que la mécanisation est un outil puissant qui engage une responsabilité — à utiliser honnêtement." },
  ],
  "2-7": [],
  "3-1": [
    { title: "Une pub Facebook Monarch (plugin de partage)", long: false, text: "Intérêt : une phrase qui identifie l'outil pour son problème. Désir : « Augmentez vos partages LIKE CRAZY » avec les mécanismes qui soutiennent la promesse (pop-ups, fly-ins, sidebars). Action : appuyée uniquement sur l'URL et le bouton Facebook, sans CTA textuel explicite (une pratique que l'auteur recommande de doubler). Même une pub de 3 lignes contient les 4 étapes d'AIDA de façon rigoureuse." },
    { title: "Une page d'accueil e-commerce (autocollants de plaque)", long: false, text: "L'intérêt tient en une phrase, sans flou. Le désir n'est pas « acheter » mais « chercher son département » — une projection immédiate dans son cas personnel. L'action est un champ de recherche, pas un bouton d'achat : à l'entrée du tunnel, chaque étape a son propre AIDA, avec sa propre micro-action à obtenir." },
  ],
  "3-2": [
    { title: "John Caples, 1927 — la pub du pianiste", long: true, text: "Une pub centenaire pour un cours de piano par correspondance reste étudiée dans toutes les écoles de copywriting. Premier paragraphe : « Arthur venait de jouer ‘The Rosary'... je marchai avec confiance vers le piano et je m'assis » — le lecteur veut savoir ce qui va se passer. L'ambiance installe l'attente d'une blague (« Encore Jack qui fait sa blague »), puis le narrateur joue toute une cérémonie théâtrale avant le sous-titre décisif : « Et alors, j'ai commencé à jouer. » À cet instant précis, le lecteur ne peut plus s'arrêter — le suspense est construit si méthodiquement que la lecture devient physique, viscérale. Puis la révélation : « Un triomphe complet », les invités impressionnés, le fantasme universel d'être admiré vécu à travers l'histoire plutôt que listé en bullet points. C'est l'exemple absolu du toboggan glissant : chaque phrase pousse vers la suivante sans qu'aucune ne permette de s'arrêter." },
  ],
  "3-3": [
    { title: "Les titres de Cosmopolitan", long: true, text: "« 12 preuves que la phase de séduction est mieux que la vie de couple » coche Utile/Unique/Ultra-spécifique grâce au chiffre et au contre-pied de l'idée reçue. « L'highlighting, la technique ultime pour défatiguer son regard » applique la mécanisation (nommer la technique) au titre lui-même. « De sublimes robes de mariée inspirées des princesses Disney » montre qu'un seul ajout (la référence Disney) transforme un titre plat en titre irrésistible. « La routine de Selena Gomez pour un corps de rêve » emprunte l'autorité d'une célébrité nommée. Les magazines féminins sont d'excellents professeurs de titres parce que leur business entier — vendre le même magazine chaque semaine à des lectrices blasées — repose uniquement sur cette mécanique." },
    { title: "Le clickbait viral (Upworthy et consorts)", long: true, text: "Chez Upworthy, un auteur passe la moitié de son temps à écrire l'article, l'autre moitié à générer 30 à 40 titres testés en A/B avant publication. « En vidant l'armoire de sa copine, il pousse un coup de gueule nécessaire » : le mot « nécessaire » fait basculer une anecdote amusante en manifeste social. « Vous allez aimer ce zoo où les humains sont en cage et les animaux en liberté » joue sur la pure curiosité du renversement d'attente. « Une femme a eu une expérience étrange qui lui a ouvert les yeux dans les toilettes d'un Target » combine juxtaposition improbable et lieu ultra-spécifique. Le niveau d'exigence sur les titres (30-40 versions testées) est le vrai standard professionnel, pas l'exception." },
    { title: "Les titres légendaires du copywriting", long: true, text: "« Ils ont rigolé quand je me suis assis au piano — mais quand j'ai commencé à jouer... » coche tous les U et n'a jamais vieilli. « Le secret incroyable de marketing direct d'un geek désespéré de l'Ohio » (Gary Halbert) : le détail « de l'Ohio », apparemment inutile, crée une image mentale précise et rend le titre inoubliable — un titre trop générique glisse, un titre plein de détails précis s'accroche. « À 60 miles à l'heure, le bruit le plus fort dans cette nouvelle Rolls-Royce vient de l'horloge électrique » (David Ogilvy) : au lieu de dire « la voiture la mieux construite au monde », un détail ultra-spécifique prouve la promesse par lui-même — montrer, ne jamais dire." },
  ],
  "3-4": [
    { title: "Tony Robbins et la femme en pleurs", long: true, text: "Face à une femme en détresse émotionnelle sur scène, Tony Robbins la prend par les épaules et la secoue — un geste choquant, à l'opposé de ce qu'on attend. Une personne en détresse est enfermée dans un schéma qui attend un schéma complémentaire (compassion, tapotements) qui, paradoxalement, prolonge la détresse en la faisant tourner en boucle. En faisant l'inverse de ce qu'elle attend, Robbins interrompt le schéma pendant quelques secondes de choc — et c'est précisément dans cette brèche, et seulement là, qu'un nouveau message peut être reçu. Transposé au marketing : le prospect arrive déjà avec un schéma en tête (« encore une pub, je vais scroller ») ; tant que ce schéma n'est pas interrompu, aucun message ne passe vraiment, quel que soit son contenu." },
    { title: "L'homme à la chemise Hathaway (David Ogilvy)", long: false, text: "Pour une pub de chemises, banale et concurrentielle, Ogilvy fait porter au mannequin un cache-œil de pirate — sans aucun rapport avec le produit. Le lecteur qui feuillette distraitement s'arrête, intrigué, et lit le titre puis les paragraphes suivants : l'image ne dit rien du produit, sa seule fonction est de stopper le scroll et d'amorcer le toboggan glissant." },
    { title: "La campagne Dove (mannequins non conventionnels)", long: false, text: "Après des décennies du même type de mannequin en publicité cosmétique, une femme de 90 ans posant fièrement pour Dove casse un schéma tellement installé qu'il n'était plus remarqué consciemment. Le souvenir de cette campagne des années après, même hors cible, prouve la puissance durable d'un simple pattern interrupt visuel." },
    { title: "Le golfeur en surpoids (John Carlton)", long: false, text: "« Comment un golfeur de 55 ans, hors de forme, en surpoids de 32 kilos et estropié par l'arthrite parvient à humilier régulièrement les pros du golf » — la vraie promesse (taper plus loin et plus droit) n'arrive qu'à la fin. Le rôle du début n'est pas de promettre, c'est de créer un choc cognitif qui force à continuer la lecture ; la promesse peut attendre." },
    { title: "L'effet miroir — la silhouette dans la vitrine", long: false, text: "En marchant dans la rue, apercevoir du coin de l'œil une silhouette dans une vitrine et réaliser que c'est soi-même arrête net l'attention — le cerveau humain est fasciné par tout ce qui le concerne directement. C'est le principe de l'effet miroir : décrire le problème du prospect de façon si précise et viscérale qu'il se reconnaît immédiatement, « c'est exactement moi »." },
    { title: "Basecamp — l'effet miroir par l'image", long: false, text: "Le titre « Vous travaillez avec d'autres personnes ? Vous avez du mal à garder tout le monde au même niveau ? » s'accompagne d'un dessin chaotique mêlant les icônes Slack, Dropbox, Trello, mail, SMS. Le prospect cible se reconnaît instantanément dans ce bordel visuel : l'image n'explique rien, elle incarne le problème vécu chaque jour — un effet miroir peut se jouer en 3 secondes, sans texte long." },
  ],
  "3-5": [
    { title: "Le golfeur unijambiste — Problème/Aggraver/Résoudre en action", long: false, text: "La fameuse lettre de John Carlton, déjà croisée dans plusieurs chapitres (storytelling, mécanisation, ancrage), sert aussi de cas d'école pour la structure PAS elle-même : poser le problème, l'aggraver longuement, puis résoudre par contraste. Le chapitre invite à la redécomposer ligne par ligne sous cet angle précis, en observant la proportion réellement consacrée à chaque étape." },
    { title: "Une page B2B pour prestations Facebook Ads", long: false, text: "Pour montrer que la structure PAS fonctionne aussi hors storytelling spectaculaire, le cours prend un cas plus sobre : une page vendant des prestations de publicité Facebook à des entrepreneurs. Même sur un sujet B2B peu narratif, le même enchaînement (poser, aggraver, résoudre) structure efficacement l'argumentaire." },
  ],
  "3-6": [
    { title: "« Relooker son thème » — bénéfice + twist", long: false, text: "Bloc 1 : bénéfice « comprendre le code », twist « pour ne plus vous sentir démuni face à un fichier .php » — le rationnel bascule en libération psychologique. Bloc 2 : bénéfice clicheté « gagner du temps », twist « grâce à des exemples qui vous disent où mettre les mains » — précision et image mécanique rendent la promesse tangible. Le principe : le bénéfice seul est plat, c'est le twist qui active l'émotion ou la visualisation — bénéfice + twist = la bullet qui tue." },
    { title: "Charisma on Command — le sommaire déguisé en bullets", long: true, text: "Plutôt qu'un sommaire classique (« Module 1 : Introduction »), chaque module affiche une liste qui ressemble à un sommaire mais fonctionne comme un argumentaire de bénéfices pur. Bullet 1 : « Les 4 émotions qui garantissent une excellente première impression, quelle que soit la personne » — un chiffre précis, un power word, une mécanisation implicite (« les 4 émotions » comme framework) et une extension universelle, contre la version plate « comment garantir une bonne première impression ». Bullet 2 : « Quelles questions poser — et plus important, comment savoir quand vous ne devriez PAS en poser » — le twist contre-intuitif installe un doute et une culpabilité immédiate chez le lecteur, qui ne peut plus ne pas vouloir la réponse. La leçon : déguiser des bénéfices en sommaire donne à la fois la crédibilité d'un plan structuré et la force émotionnelle d'une vraie bullet." },
  ],
  "3-7": [
    { title: "Charisma University — structure visuelle exemplaire", long: false, text: "Titre mis en avant sur une image de fond sobre, texte au premier plan (confiance dans l'écriture plutôt que dans le visuel), couleurs limitées à deux teintes (bleu + vert), citations de transition mises en emphase pour rythmer la lecture. Chaque module a sa propre image et sa liste de bullets, avec un fond légèrement différent pour signaler le changement de section sans jamais surcharger la page." },
    { title: "La plateforme visualisée sur plusieurs appareils", long: false, text: "Montrer des captures de la plateforme sur ordinateur, tablette et smartphone fait visualiser au prospect ses propres moments d'utilisation (bureau, transports, pause déjeuner) — anticipant au passage l'objection implicite « est-ce que ça marche sur mon appareil ? » pour les moins technophiles." },
  ],
  "4-1": [
    { title: "La lettre des armoiries (Gary Halbert)", long: false, text: "Une lettre vendant un poster d'armoiries familiales, écrite du point de vue de l'épouse de l'auteur, désamorce en deux phrases l'objection « qui est cette inconnue qui m'écrit ? » : ils ont fait une recherche pour des amis, les amis ont adoré, ils partagent maintenant avec d'autres du même nom. Une histoire d'origine n'a pas besoin d'être spectaculaire pour installer la crédibilité — parfois deux phrases suffisent." },
    { title: "Le golfeur unijambiste (John Carlton)", long: false, text: "La méthode de golf « triple ressort swing » est attribuée à l'observation d'un golfeur unijambiste frappant plus loin et plus précis que des golfeurs valides. Cette origine improbable désamorce l'objection « pourquoi je croirais que cette méthode marche » — une source aléatoire et unique rend la découverte plausible, et en copywriting la plausibilité fait 80 % du travail." },
    { title: "Charisma University — la douleur avant l'argumentaire", long: true, text: "La page de vente ouvre directement sur l'histoire du fondateur : « Je n'ai pas eu l'offre d'emploi... J'avais passé des nuits sans compter, les yeux injectés de sang. » Aucune information rationnelle, uniquement la douleur ressentie à travers des détails viscéraux. Le récit continue jusqu'à l'humiliation (« j'avais l'impression qu'on m'avait donné un coup de poing dans l'estomac »), puis bascule sur une simple ellipse : « Ou plutôt, c'est ce que je pensais... Quatre ans plus tard, j'ai un meilleur travail, payé deux fois et demi plus. » Ce flash-forward, qui saute la période de transformation sans l'expliquer, crée une curiosité insoutenable sur ce qui s'est passé entre les deux — exactement ce que la formation promet de révéler." },
  ],
  "4-2": [
    { title: "Une page de pré-vente entièrement construite sur l'inclusion/exclusion", long: true, text: "Le titre « La recette (longue et difficile) pour créer un business internet prospère » prend l'exact contre-pied des promesses habituelles (« facilement », « rapidement ») — pattern interrupt et graine d'exclusion en une phrase. Puis : « À ce stade, toute personne saine d'esprit aurait pris ses jambes à son cou. Mais tu es encore là » — une inclusion douce et factuelle qui range déjà le lecteur dans un groupe restreint et flatteur. Puis le rejet explicite de l'attente classique (« si tu espères une technique miracle, je vais te décevoir ») ouvre la porte à une recontextualisation plus profonde. Toute la page se construit ainsi, couche après couche, sur ce même principe : inclure et exclure alternativement pour renforcer l'appartenance de ceux qui restent." },
    { title: "L'annonce de développeur au langage extrême", long: false, text: "Sur un marché saturé d'annonces uniformes à San Francisco, une offre à 115 000$/an utilise un langage cru et exclut explicitement (« si tu ne connais pas JavaScript, tu peux aller te recoucher »). Sur 90 % de candidats repoussés, les 10-15 % restants sont hyper-qualifiés et hyper-motivés — la polarisation par le langage agit comme un filtre naturel." },
    { title: "L'offre d'emploi au Vietnam", long: false, text: "Pour recruter un assistant prêt à tout quitter pour Ho Chi Minh, l'offre annonce d'abord les bénéfices puis avertit : « Ce n'est pas une position pour les âmes sensibles », suivi de trois exclusions explicites (stabilité, argent/prestige, envie de se la couler douce) formulées avec élégance (« rien de mal à ça, mais... »). Cette élégance dans l'exclusion renforce paradoxalement le sentiment d'appartenance de ceux qui restent." },
  ],
  "4-3": [
    { title: "« Moi, président » — François Hollande", long: true, text: "Lors du débat de 2012, Hollande égrène une anaphore : « Moi, président de la République, je ne serai pas le chef de la majorité... je ne recevrai pas les parlementaires à l'Élysée... » Deux mécanismes simultanés : une attaque implicite contre le sortant (chaque phrase est le négatif d'un reproche qu'on lui fait), et une boule de cristal parfaite qui fait visualiser concrètement, scène par scène, à quoi ressemblerait cette présidence. Le téléspectateur ne se dit plus « il promet une politique différente », il se dit « je vois déjà son mandat » — et voter devient la validation d'une image mentale déjà présente, pas un pari abstrait. Preuve de l'impact : le hashtag #MoiPrésident est devenu le plus utilisé sur Twitter dans les heures qui ont suivi, et l'expression reste étudiée aujourd'hui comme cas d'école — une phrase mémorable et reprise est souvent le signe d'un mécanisme de persuasion redoutable." },
    { title: "Le livre papier qui n'existe qu'en PDF", long: false, text: "Un livre vendu uniquement en PDF affiche pourtant l'image d'un livre papier, avec couverture et épaisseur. Le cerveau émotionnel ne fait pas la différence entre recevoir un objet physique et un fichier — voir l'image suffit à faire feuilleter, tenir et poser le livre mentalement, un plaisir anticipé qui pèse dans la décision d'achat même si l'objet ne se matérialisera jamais." },
    { title: "Charisma University — la plateforme sur plusieurs appareils", long: false, text: "Montrer la plateforme sur ordinateur, tablette et smartphone fait visualiser au prospect sa propre vie avec la formation dedans (bureau, transports, pause déjeuner) plutôt que « juste une formation en ligne ». Une fois qu'il se voit déjà en train de l'utiliser, la barrière à l'achat s'effondre." },
    { title: "La phrase qui guide le premier geste", long: false, text: "« Quand vous recevrez le livre, rendez-vous directement au chapitre 3 pour un exercice qui vous indiquera en 7 minutes si votre idée est viable » fait visualiser une scène précise seconde par seconde. Le chiffre « 7 minutes » rend le bénéfice immédiat et le cerveau traite cette anticipation comme une quasi-certitude — décrire le premier geste post-achat est l'une des applications les plus sous-employées de la boule de cristal." },
    { title: "Le manuel du golfeur unijambiste — les mots sensoriels", long: false, text: "Plutôt que « vous recevrez également un manuel complémentaire » (plat, oubliable), John Carlton écrit « un manuel solide », « une référence au bout de vos doigts », « à emmener sur les cours de golf » — chaque mot ajoute une sensation physique et une scène précise. La boule de cristal peut se glisser dans n'importe quel paragraphe de bénéfices, il suffit de remplacer les adjectifs plats par des adjectifs sensoriels et de préciser la scène d'usage." },
  ],
  "4-4": [
    { title: "L'expérience des agents immobiliers (William Poundstone)", long: false, text: "Face à la même maison présentée avec un prix affiché variant entre 119 900$ et 149 900$, même des agents immobiliers professionnels ajustent leur estimation de 16 000$ selon le seul chiffre initial montré. Même l'expertise ne protège pas du biais d'ancrage : le premier chiffre vu devient la référence de tout le raisonnement qui suit." },
    { title: "Le numéro de sécurité sociale (Dan Ariely)", long: false, text: "Des étudiants notent d'abord les deux derniers chiffres de leur numéro de sécurité sociale (0 à 99, purement aléatoire), puis estiment le prix d'un clavier : ceux avec un chiffre bas l'estiment à 16$, ceux avec un chiffre haut à 56$ — un rapport de 1 à 3,5 basé sur un nombre totalement sans rapport. Le cerveau ne distingue même pas un chiffre pertinent d'un chiffre aléatoire, tout chiffre récemment vu devient un point d'ancrage." },
    { title: "Le livre « Relouker son thème » — l'échelle de prix", long: false, text: "Trois éditions à 29 / 59 / 149 € : sans ancrage, 29 € pour un ebook paraît cher comparé à un livre classique ; avec les trois prix côte à côte, 29 € devient « presque un cadeau ». L'édition à 149 € n'a pas besoin de bien se vendre — sa fonction est d'ancrer le prix haut pour rendre les autres raisonnables, une option « leurre » assumée." },
    { title: "Le golfeur unijambiste — l'ancrage narratif", long: true, text: "Avant d'annoncer le prix, Carlton plante l'ancre par le récit : « Milt aurait pu continuer à donner des leçons privées pour des prix exorbitants » — sans donner de chiffre, il installe dans l'esprit du lecteur l'idée d'un tarif très élevé. Il ajoute ensuite la raison du prix bas (la santé de Milt décline, il ne peut plus donner autant de leçons), essentielle pour éviter la méfiance du « pourquoi c'est si peu cher ». Le contraste est renforcé par des mots choisis chirurgicalement : « éviscérer des golfeurs riches » et « frais Cadillac » pour évoquer le prix normal, face à « petite monnaie » et « piécettes » pour le prix proposé. Une urgence complète le dispositif (l'offre pourrait être retirée si elle ne marche pas) — l'ancrage narratif transforme un prix en histoire plutôt qu'en simple chiffre." },
    { title: "Charisma University — la cascade avec plan de paiement", long: false, text: "L'ancre haute est plantée (« en coaching privé, ça coûterait 6 000$ »), puis le prix réel apparaît en pourcentage de cette ancre, puis se divise en mensualités (99$/mois). Le cerveau ne compare plus au coaching à 6000$ ni même au prix comptant, il compare uniquement à 99$ ce mois-ci — un prix objectivement conséquent devient une dépense mentale insignifiante, sans que le total payé ne change." },
    { title: "« Get Your Ex-Boyfriend Back » — l'addition de bonus", long: false, text: "Manuel principal 47$ + bonus 29$, 37$ et 122$ = 235$ de valeur affichée, pour un prix aujourd'hui de 47$ — une remise apparente de 80 %. La méthode fonctionne mais reste visible et datée (efficace sur les niches habituées à ce langage, risquée sur des marchés sophistiqués) et exige que chaque valeur annoncée reste justifiable, sous peine de se retourner contre la crédibilité de l'offre." },
  ],
  "4-5": [
    { title: "La garantie insistante de Ramit Sethi", long: true, text: "Sur une garantie classique (30 jours, satisfait ou remboursé), Ramit Sethi ajoute un badge visuel volontairement voyant et un titre en majuscules : « UNE GARANTIE IMBATTABLE ». La formulation clé : « J'insiste pour que vous obteniez 100 % de votre argent » — le mot « j'insiste » inverse le rapport, ce n'est plus le client qui demande un remboursement, c'est le vendeur qui l'exige si le produit ne satisfait pas pleinement. Une boule de cristal du remboursement précise le processus exact (« envoyez-moi un email », « sans poser de questions ») pour réduire à zéro toute friction perçue. Le bonus final — garder les bonus même en cas de remboursement — pousse l'excès encore plus loin, jusqu'à rendre la garantie elle-même une preuve de la qualité du produit." },
    { title: "La garantie obligatoire de « 10K Subs »", long: true, text: "« Garantie obligatoire de 7 jours : si vous n'avez pas obtenu vos 100 premiers abonnés email, je vous OBLIGE à demander un remboursement. » La réaction immédiate du lecteur est un choc (« attends, quoi ? ») — un vrai pattern interrupt, parce que personne n'a jamais lu une garantie « obligatoire ». Le cerveau cherche une explication et n'en trouve qu'une : le vendeur ne prendrait un tel risque que s'il savait sa méthode fiable — la garantie devient une démonstration de qualité, pas juste un renversement de risque. Elle fonctionne pour trois raisons : elle est ultra-spécifique (100 abonnés, 7 jours — mesurable), elle inverse la charge mentale du remboursement (habituellement un effort, ici presque imposé), et elle ne peut être proposée que par quelqu'un ayant une conviction produit réelle." },
    { title: "Le prix le plus bas garanti (double, triple remboursement)", long: false, text: "« Si vous trouvez moins cher ailleurs, nous vous remboursons deux (ou trois) fois la différence » pousse le même mécanisme que la garantie obligatoire, mais sur l'ampleur de la compensation plutôt que sur l'obligation. Le prospect élimine lui-même le besoin de comparer, parce que la garantie prouve que le vendeur y croit plus que lui." },
    { title: "La triple garantie personnelle (vidéo de vente)", long: true, text: "Pour une formation en séduction pour hommes timides, la garantie occupe 8 slides entières d'une vidéo. Première étape : désamorcer la pression de décision (« vous n'avez même pas besoin de décider maintenant »). Puis une boule de cristal du parcours (« regardez toutes les vidéos, dévorez tous les bonus, retournez ma méthode dans tous les sens ») fait visualiser l'usage complet du produit avant même l'achat. Vient une promesse ultra-précise et court terme (« dès la semaine prochaine, si vous ne pouvez pas parler à n'importe quelle femme aussi longtemps que vous le voulez »), suivie de bénéfices émotionnels (confiance, liberté) et d'une touche d'exagération volontaire qui pousse la garantie jusqu'à l'absurde assumé. Chaque slide ajoute une couche — rationnelle, émotionnelle, identitaire — au même argument central : le risque n'est plus du tout du côté du client." },
  ],
};

// ─── GÉNÉRATEUR DE CONTENU ────────────────────────────────────────────────
// Arborescence Plateforme → Axe → Schéma. Chaque schéma = un framework réel
// (PAS, AIDA, BAB, PASTOR, hooks OpusClip/Copyhackers) dont les "ingrédients"
// pointent vers des chapitres du PIPELINE. `beats` = l'ossature narrative que
// le contenu doit suivre. `uses` = codes chapitres dont on injecte la data.
// ─── INGREDIENT SYSTEM ────────────────────────────────────────────────────
// Mappe chaque type d'ingrédient vers le chapitre source + le champ à extraire
const INGREDIENT_MAP = {
  douleur:         { code: "1-4", fields: ["douleur"],                          label: "Douleur / frein immédiat" },
  inaction:        { code: "1-4", fields: ["inaction"],                         label: "Douleur de l'inaction" },
  futur:           { code: "1-4", fields: ["futur"],                            label: "Bénéfice futur" },
  plaisir:         { code: "1-4", fields: ["plaisir"],                          label: "Plaisir immédiat" },
  objection:       { code: "1-7", fields: ["obj"],                              label: "Objection" },
  credibilite:     { code: "1-5", fields: ["preuve", "autorite", "engagement"], label: "Élément de crédibilité" },
  pvu:             { code: "2-1", fields: ["pvu"],                              label: "PVU" },
  differentiation: { code: "2-4", fields: ["avantage", "strategie", "relation"],label: "Différenciation" },
  recontextualisation: { code: "2-5", fields: ["pivot", "cache", "jeu"],        label: "Recontextualisation" },
  mecanisme:       { code: "2-6", fields: ["nom", "promesse", "pourquoi", "visuel"], label: "Mécanisme unique" },
  histoire:        { code: "4-1", fields: ["histoire"],                         label: "Histoire de marque" },
  resultat:        { code: "4-3", fields: ["moments", "geste", "materialisation"], label: "Projection du résultat" },
  garantie:        { code: "4-5", fields: ["forme", "resultat", "process", "bonus"], label: "Garantie" },
  ancrage:         { code: "4-4", fields: ["ancre", "methode", "raison", "reference"], label: "Ancrage prix" },
  inclusion:       { code: "4-2", fields: ["pourtoi", "pasfaite"],              label: "Signal inclusion / exclusion" },
  storytelling:    { code: "2-7", fields: ["ennemi", "protagoniste", "initiale", "perturbateur", "climax", "finale"], label: "Matière storytelling" },
};

// Extrait toutes les valeurs disponibles pour un ingrédient, pour l'avatar donné.
// badge et repeat sont lus depuis la définition réelle du chapitre (pas dupliqués ici),
// pour qu'un changement de champ dans PIPELINE n'invalide jamais ce mapping en silence.
// Retourne [{ text, from }] — `from` = label du champ source, affiché dans le sélecteur.
function extractIngredient(data, type, avId) {
  const map = INGREDIENT_MAP[type];
  if (!map) return [];
  const step = stepByCode(map.code);
  if (!step) return [];

  const pullFromSlot = (slot, pieceLabel) => {
    if (!slot) return [];
    const out = [];
    map.fields.forEach((key) => {
      const def = step.fields.find((f) => f.k === key);
      if (!def) return;
      const src = pieceLabel ? `${def.label} · ${pieceLabel}` : def.label;
      if (def.repeat) {
        ((slot.lists || {})[key] || []).forEach((v) => {
          if (v && v.trim()) out.push({ text: v.trim(), from: src });
        });
      } else {
        const v = ((slot.notes || {})[key] || "").trim();
        if (v) out.push({ text: v, from: src });
      }
    });
    return out;
  };

  if (step.badge === "avatar") {
    if (!avId) return [];
    return pullFromSlot((data.avatar[map.code] || {})[avId]);
  }
  if (step.badge === "fixed") {
    return pullFromSlot(data.fixed[map.code]);
  }
  if (step.badge === "multi") {
    const out = [];
    (data.multi[map.code] || []).forEach((p) => pullFromSlot(p, p.label).forEach((x) => out.push(x)));
    return out;
  }
  return [];
}

const PLATFORMS = [
  // ─── LINKEDIN ─────────────────────────────────────────────────────────────
  {
    id: "linkedin", name: "LinkedIn",
    note: "Dwell time = roi de l'algo. Zéro lien externe dans le post. Les 60 premières minutes décident du reach. Carrousel/document = format le plus performant.",
    formats: [
      {
        id: "li-text", name: "Post texte",
        note: "Les 2-3 premières lignes (avant le « voir plus ») décident de tout. Aère avec des sauts de ligne. Un seul CTA, souvent en commentaire.",
        schemas: [
          { id: "li-text-story", axis: "Awareness", name: "Story-Lesson", needs: ["histoire","douleur"],
            desc: "Une histoire perso ou client qui débouche sur UNE leçon business claire. Le format qui construit le plus l'autorité.",
            beats: ["Hook : entre dans la scène au moment de tension (pas de préambule)", "Le récit : situation, bascule, ce qui s'est passé — détails concrets", "Le tournant : ce que tu as compris", "La leçon actionnable, reliée directement au lecteur"] },
          { id: "li-text-contrarian", axis: "Awareness", name: "Contrarian — contre-pied", needs: ["differentiation","inclusion"],
            desc: "Tu attaques frontalement une croyance répandue de ton secteur. Fort en reach et en tri de l'audience.",
            beats: ["Hook : l'affirmation à contre-courant (« Tout le monde fait X. C'est l'erreur. »)", "Pourquoi la croyance commune est fausse", "Ce qu'il faut faire à la place, ton angle", "Signal identitaire : qui comprend ça vs qui reste bloqué"] },
          { id: "li-text-obs", axis: "Awareness", name: "Observation / prédiction", needs: ["differentiation","recontextualisation"],
            desc: "Tu partages une observation de terrain ou une prédiction sur ton marché. Positionne en penseur, pas en vendeur.",
            beats: ["Hook : l'observation ou la prédiction, nette", "Les signaux concrets qui la soutiennent", "Ce que ça implique pour le lecteur", "Ta position assumée + invitation au débat"] },
          { id: "li-text-liste", axis: "Awareness", name: "Liste de vérités", needs: ["douleur","pvu"],
            desc: "Une liste numérotée de vérités inconfortables sur ton secteur. Format ultra-partageable.",
            beats: ["Hook : promesse de vérité chiffrée (« 7 choses que personne ne dit sur X »)", "Les vérités, une par ligne, sans édulcorer", "La vérité la plus forte gardée pour la fin", "Ta prise de position assumée + CTA"] },
          { id: "li-text-comparison", axis: "Awareness", name: "X vs Y — la vraie différence", needs: ["differentiation","recontextualisation"],
            desc: "Tu compares deux approches, deux outils, deux mindsets. Très fort en engagement et partages.",
            beats: ["Hook : les deux options clairement posées", "Ce que chacune donne vraiment (concret, pas théorique)", "Pourquoi tu as choisi / recommandes X", "CTA : « et toi tu fais quoi ? »"] },
          { id: "li-text-mistake", axis: "Awareness", name: "Erreur décortiquée", needs: ["objection","mecanisme"],
            desc: "UNE seule erreur analysée en profondeur : pourquoi on la fait, ce qu'elle coûte, comment l'éviter. Plus profond qu'une liste.",
            beats: ["Hook : l'erreur nommée sans détour", "Pourquoi c'est tentant de la faire (tu ne juges pas)", "Le mécanisme caché : ce qu'elle coûte vraiment", "La correction précise + comment vérifier"] },
          { id: "li-text-reverse", axis: "Awareness", name: "Reverse engineering", needs: ["credibilite","mecanisme"],
            desc: "Tu démontes un succès (le tien ou celui d'un autre) pour en extraire le mécanisme reproductible.",
            beats: ["Hook : le résultat observé (« Ce post a fait 400k vues. Voici pourquoi. »)", "Ce que tout le monde croit expliquer le succès", "Le vrai mécanisme, décomposé", "Comment le lecteur peut le reproduire"] },
          { id: "li-text-data", axis: "Awareness", name: "Le chiffre qui dérange", needs: ["credibilite","douleur"],
            desc: "Tu partes d'une donnée précise et tu déroules ce qu'elle révèle. L'inverse du post d'opinion : la donnée porte l'argument.",
            beats: ["Hook : le chiffre seul, brut", "Ce qu'il signifie concrètement pour ta cible", "Pourquoi personne n'en parle / ce qu'on préfère croire", "Ce qu'il faut en faire + CTA débat"] },
          { id: "li-text-question", axis: "Awareness", name: "Question ouverte au marché", needs: ["douleur","objection"],
            desc: "Tu poses une vraie question à ton secteur, sans réponse toute faite. Génère des commentaires longs, donc du reach.",
            beats: ["Hook : la question, posée franchement", "Pourquoi elle te travaille (contexte perso court)", "Les 2-3 réponses possibles, sans trancher", "Tu passes la main : « je lis tout en commentaire »"] },
          { id: "li-text-timeline", axis: "Awareness", name: "Avant / Maintenant du marché", needs: ["recontextualisation","differentiation"],
            desc: "Tu montres comment ton marché a changé et ce que ça implique. Positionne comme quelqu'un qui a du recul.",
            beats: ["Hook : le contraste temporel (« En 2019 X marchait. Aujourd'hui c'est mort. »)", "Ce qui a changé concrètement", "Ce que la plupart continuent de faire quand même", "La nouvelle règle du jeu + CTA"] },
          { id: "li-text-analogy", axis: "Awareness", name: "Analogie hors-secteur", needs: ["mecanisme","pvu"],
            desc: "Tu expliques ton mécanisme via une analogie venue d'un autre domaine. Rend mémorable une idée abstraite.",
            beats: ["Hook : l'analogie posée d'emblée (surprenante)", "Tu développes l'analogie pour elle-même", "Le pont vers ton sujet, point par point", "Ce que ça change pour le lecteur"] },
          { id: "li-text-identity", axis: "Awareness", name: "Signal identitaire", needs: ["inclusion","douleur"],
            desc: "Tu décris une tribu précise avec ses réalités, sans rien vendre. Le format qui fait le plus « c'est exactement moi ».",
            beats: ["Hook : l'appel à la tribu (« Si tu as déjà… tu sais. »)", "Les réalités partagées, nommées avec précision", "Ce qui vous sépare des autres", "L'invitation à se reconnaître en commentaire"] },
          { id: "li-text-pas", axis: "Conversion", name: "PAS — Problème / Aggraver / Solution", needs: ["douleur","inaction","mecanisme"],
            desc: "Tu nommes un problème du lecteur, tu le rends viscéral, puis tu ouvres vers ta solution. La douleur porte tout.",
            beats: ["Hook : le problème dans SES mots (effet miroir, 1-2 lignes)", "Aggravation : conséquences concrètes, ce qui arrive si rien ne change", "Bascule vers ta solution nommée (mécanisme)", "CTA doux : commentaire ou DM"] },
          { id: "li-text-win", axis: "Conversion", name: "Client win — résultat raconté", needs: ["credibilite","resultat"],
            desc: "Un résultat client concret raconté comme une mini-histoire. Preuve sociale narrative, pas un témoignage sec.",
            beats: ["Hook : le résultat chiffré en ouverture", "Le point de départ du client (sa douleur, sa situation)", "Ce qui a changé : le mécanisme appliqué", "Ce que ça prouve pour le lecteur + CTA doux"] },
          { id: "li-text-objection", axis: "Conversion", name: "Objection Flip", needs: ["objection","credibilite"],
            desc: "Tu prends l'objection nº1 et tu la retournes publiquement. Désamorce les freins de ceux qui lisent sans commenter.",
            beats: ["Hook : l'objection énoncée mot pour mot (« Oui mais c'est trop cher »)", "Pourquoi cette objection est compréhensible", "Le retournement : le vrai calcul, la vraie comparaison", "La preuve concrète + CTA"] },
          { id: "li-text-challenge", axis: "Conversion", name: "Challenge public", needs: ["resultat","garantie"],
            desc: "Tu lances un défi à ton audience avec un résultat mesurable. Génère de l'engagement et de l'accountability.",
            beats: ["Hook : le défi annoncé avec le résultat attendu", "Pourquoi ce défi maintenant, le contexte", "Les règles du jeu + comment participer", "CTA fort : commentaire ou DM pour rejoindre"] },
          { id: "li-text-inaction", axis: "Conversion", name: "Le coût de l'inaction", needs: ["inaction","futur"],
            desc: "Tu ne vends pas ta solution : tu chiffres ce que coûte de ne rien faire. Convertit ceux qui repoussent depuis des mois.",
            beats: ["Hook : le coût de l'attente, chiffré ou daté", "Le calcul détaillé (temps, argent, opportunités)", "La projection : où il en sera dans 12 mois sans rien changer", "L'alternative + CTA"] },
          { id: "li-text-anchor", axis: "Conversion", name: "Recadrage du prix", needs: ["ancrage","objection"],
            desc: "Tu recadres la perception du prix par comparaison. Pour les offres où le prix est le frein principal.",
            beats: ["Hook : le prix énoncé franchement (pas caché)", "Le point de comparaison naturel du prospect", "Le recadrage : à quoi ça devrait vraiment se comparer", "Ce que ça rend évident + CTA"] },
          { id: "li-text-guarantee", axis: "Conversion", name: "Renversement du risque", needs: ["garantie","objection"],
            desc: "Tu déplaces le risque de son côté vers le tien. Débloque les prospects prêts mais prudents.",
            beats: ["Hook : la peur réelle nommée (« Et si ça marche pas ? »)", "Tu valides que le risque est légitime", "La garantie détaillée, sans astérisque", "Ce qu'il risque vraiment (rien) + CTA"] },
          { id: "li-text-mecha", axis: "Conversion", name: "Mécanisme unique révélé", needs: ["mecanisme","differentiation"],
            desc: "Tu expliques POURQUOI ta méthode marche, avec son nom. Transforme une offre banale en approche propriétaire.",
            beats: ["Hook : le nom du mécanisme + sa promesse", "Le problème que les approches classiques ne résolvent pas", "Comment ton mécanisme s'y prend différemment", "La preuve que ça tient + CTA"] },
          { id: "li-text-filter", axis: "Conversion", name: "C'est pour toi si / pas si", needs: ["inclusion","pvu"],
            desc: "Tu filtres explicitement qui doit acheter et qui ne doit pas. L'exclusion volontaire augmente la conversion des bons profils.",
            beats: ["Hook : « Ce n'est pas pour tout le monde. »", "C'est pour toi si… (3-4 critères précis)", "Ce n'est pas pour toi si… (assume de repousser)", "Si tu es dans la première liste : CTA"] },
          { id: "li-text-beforeafter", axis: "Conversion", name: "Avant / Après narratif", needs: ["douleur","resultat"],
            desc: "La transformation racontée en deux temps nets. Plus incarné qu'un case study, plus court qu'une story.",
            beats: ["Hook : l'état « avant », décrit de l'intérieur", "Le point de bascule (bref, pas le cœur du post)", "L'état « après », en scènes concrètes", "Ce qui a permis le passage + CTA"] },
          { id: "li-text-offer", axis: "Conversion", name: "Offre décomposée", needs: ["pvu","garantie","ancrage","plaisir"],
            desc: "Tu déballes exactement ce que contient l'offre, sans storytelling. Pour une audience déjà chaude en fin de lancement.",
            beats: ["Hook : ce que c'est, en une phrase", "Ce qu'il y a dedans, point par point", "Le prix + l'ancrage + la garantie", "La deadline ou la limite + CTA direct"] },
          { id: "li-text-vulnerable", axis: "Nurture", name: "Confession / erreur", needs: ["histoire"],
            desc: "Tu avoues une erreur ou un échec vécu. La vulnérabilité spécifique crée une connexion forte et de l'engagement.",
            beats: ["Hook : l'aveu direct (« J'ai perdu X à cause de… »)", "Ce qui s'est passé, sans enjoliver", "Ce que ça t'a coûté et appris", "La leçon transférable au lecteur"] },
          { id: "li-text-framework", axis: "Nurture", name: "Framework en X étapes", needs: ["mecanisme","pvu"],
            desc: "Tu livres ta méthode propriétaire décomposée. Construit l'expertise et la différenciation en même temps.",
            beats: ["Hook : la promesse du framework (le résultat qu'il permet)", "Chaque étape nommée et expliquée brièvement", "L'erreur commune à chaque étape", "Invitation à approfondir + CTA"] },
          { id: "li-text-behind", axis: "Nurture", name: "Behind the scenes", needs: ["histoire","storytelling"],
            desc: "Tu montres les coulisses d'un projet, d'une décision, d'un lancement. Humanise et crée de la proximité.",
            beats: ["Hook : ce que tu as fait / décidé / lancé", "Les coulisses : ce que personne ne voit", "Une tension ou un moment difficile", "La leçon + invitation à commenter"] },
          { id: "li-text-lessons", axis: "Nurture", name: "Ce que m'a appris [période]", needs: ["histoire","mecanisme"],
            desc: "Bilan d'une période ou d'un projet en leçons numérotées. Différent de la confession : plusieurs apprentissages, pas un seul échec.",
            beats: ["Hook : la période + le nombre de leçons", "Chaque leçon en 1-2 lignes, concrète", "Celle qui t'a le plus surpris, développée", "Ce que tu fais différemment maintenant"] },
          { id: "li-text-resources", axis: "Nurture", name: "Ressources / stack", needs: ["mecanisme"],
            desc: "Tu partages tes outils, livres ou ressources avec le pourquoi de chaque choix. Fort en saves et en DMs.",
            beats: ["Hook : la promesse (« ma stack complète pour X »)", "Chaque ressource + pourquoi tu l'utilises (pas juste le nom)", "Celle que personne ne cite", "CTA : « tu utilises quoi ? »"] },
          { id: "li-text-process", axis: "Nurture", name: "Mon process interne", needs: ["mecanisme","differentiation"],
            desc: "Tu montres comment tu travailles concrètement, étape par étape. Transparence qui crée la confiance avant l'achat.",
            beats: ["Hook : ce que tu vas montrer (« Comment je livre un X en Y jours »)", "Le déroulé réel, avec les durées", "Ce que tu refuses de faire et pourquoi", "Invitation à questionner"] },
          { id: "li-text-celebrate", axis: "Nurture", name: "Célébration client", needs: ["credibilite","resultat"],
            desc: "Tu mets un client en lumière sans te mettre au centre. Preuve sociale généreuse, sans pitch.",
            beats: ["Hook : le résultat du client, nommé", "Qui il est et d'où il vient", "Ce qu'IL a fait (le mérite lui revient)", "Ce que ça montre + zéro CTA commercial"] },
          { id: "li-text-nuance", axis: "Nurture", name: "J'ai changé d'avis", needs: ["recontextualisation","differentiation"],
            desc: "Tu reviens publiquement sur une position que tu défendais. Rare, donc très fort en crédibilité et en commentaires.",
            beats: ["Hook : ce que tu pensais avant, assumé", "Ce qui t'a fait douter (fait précis, pas vague)", "Ta position actuelle, nuancée", "Ce que ça implique + ouverture au débat"] },
          { id: "li-text-qa", axis: "Nurture", name: "Réponse à une question reçue", needs: ["objection","mecanisme"],
            desc: "Tu réponds publiquement à une question qu'on t'a posée en DM. Prouve que tu écoutes et sert tous ceux qui se la posaient.",
            beats: ["Hook : la question, citée telle quelle", "Pourquoi c'est une bonne question", "Ta réponse complète et honnête", "CTA : « d'autres questions ? »"] },
          { id: "li-text-recap", axis: "Nurture", name: "Récap / best-of", needs: ["pvu","mecanisme"],
            desc: "Tu compiles tes meilleures idées ou contenus sur un thème. Sert les nouveaux abonnés et recycle sans redite.",
            beats: ["Hook : le thème + ce que le lecteur va y gagner", "Les 5-7 idées clés, reformulées (pas copiées)", "Le fil rouge qui les relie", "CTA : enregistre / dis-moi ce qui manque"] },
        ],
      },
      {
        id: "li-carousel", name: "Carrousel / Document PDF",
        note: "Format nº1 en engagement (~7%). 8-12 slides. Slide 1 = hook + curiosity gap. Chaque slide doit donner envie de swiper. Dernière slide = CTA.",
        schemas: [
          { id: "li-car-framework", axis: "Awareness", name: "Framework enseigné", needs: ["mecanisme","pvu"],
            desc: "Une méthode décomposée en étapes, une par slide. Format sauvegarde par excellence.",
            beats: ["Slide 1 : la promesse (« La méthode en X étapes pour… »)", "1 étape claire et actionnable par slide", "1 slide exemple concret", "Slide finale : récap + CTA « enregistre »"] },
          { id: "li-car-list", axis: "Awareness", name: "Liste actionnable", needs: ["douleur","pvu"],
            desc: "Une liste numérotée, une entrée par slide. Chaque point = 1 idée + 1 twist.",
            beats: ["Slide 1 : promesse chiffrée", "1 point par slide : idée + twist + micro-exemple", "Priorise : les plus forts en premier et en dernier", "CTA : « enregistre »"] },
          { id: "li-car-myth", axis: "Awareness", name: "Mythe déconstruit", needs: ["differentiation","objection"],
            desc: "Slide 1 pose un mythe répandu, les suivantes le démontent point par point.",
            beats: ["Slide 1 : le mythe énoncé", "Slides : pourquoi c'est faux, preuves", "Slides : le vrai mécanisme", "Slide finale : quoi faire + CTA"] },
          { id: "li-car-comparison", axis: "Awareness", name: "Comparaison X vs Y", needs: ["differentiation","pvu"],
            desc: "Tu compares deux approches slide par slide avec un verdict clair.",
            beats: ["Slide 1 : les deux options posées", "2-3 slides par critère de comparaison", "Le verdict tranché avec ta position", "CTA : vote ou commentaire"] },
          { id: "li-car-story", axis: "Awareness", name: "Micro-story visuelle", needs: ["histoire","resultat"],
            desc: "Une histoire au twist contre-intuitif racontée slide par slide.",
            beats: ["Slide 1 : accroche contre-intuitive", "Le récit condensé, slide par slide", "Le twist / la révélation", "La leçon + CTA"] },
          { id: "li-car-roadmap", axis: "Awareness", name: "Roadmap temporelle", needs: ["mecanisme","futur"],
            desc: "Un plan chronologique : où en être à J+30, J+60, J+90.",
            beats: ["Slide 1 : la destination finale (résultat à 90 jours)", "1 slide par étape temporelle", "Les écueils à chaque étape", "Slide finale : par où commencer maintenant + CTA"] },
          { id: "li-car-mistakes", axis: "Awareness", name: "Les X erreurs à éviter", needs: ["objection","douleur"],
            desc: "Une erreur par slide, avec sa correction immédiate. Structure symétrique erreur → fix.",
            beats: ["Slide 1 : le nombre d'erreurs + l'enjeu", "1 slide par erreur : ce qu'on fait / ce qu'il faut faire", "L'erreur la plus coûteuse en avant-dernière", "Slide finale : la checklist récap + CTA"] },
          { id: "li-car-reverse", axis: "Awareness", name: "Déconstruction d'un exemple", needs: ["credibilite","mecanisme"],
            desc: "Tu prends un cas réel (pub, page, post) et tu l'annotes slide par slide. Très pédagogique.",
            beats: ["Slide 1 : le cas + son résultat", "Slides : chaque élément décortiqué et annoté", "Slide : ce que la plupart auraient fait à la place", "Slide finale : les règles à retenir + CTA"] },
          { id: "li-car-data", axis: "Awareness", name: "Data viz / chiffres clés", needs: ["credibilite","douleur"],
            desc: "Un chiffre marquant par slide, visualisé. La donnée porte l'argument, pas l'opinion.",
            beats: ["Slide 1 : le chiffre le plus frappant", "1 donnée par slide, visualisée simplement", "Slide : ce que l'ensemble révèle", "Slide finale : ce qu'il faut en faire + CTA"] },
          { id: "li-car-glossaire", axis: "Awareness", name: "Glossaire de niche", needs: ["pvu","mecanisme"],
            desc: "Tu définis les termes clés de ton domaine à ta façon. Positionne comme référence.",
            beats: ["Slide 1 : la promesse (« X termes que tu dois maîtriser »)", "1 terme par slide : définition + pourquoi ça compte", "Ta définition propriétaire là où tu t'écartes du standard", "Slide finale : récap + CTA"] },
          { id: "li-car-faq", axis: "Awareness", name: "FAQ visuelle", needs: ["objection","mecanisme"],
            desc: "Une question par slide, la réponse dessous. Différent des objections : questions d'information, pas de freins d'achat.",
            beats: ["Slide 1 : « Les X questions qu'on me pose le plus »", "1 question + réponse courte par slide", "La question que personne n'ose poser", "Slide finale : « ta question ? » + CTA"] },
          { id: "li-car-identity", axis: "Awareness", name: "Signal identitaire", needs: ["inclusion","douleur"],
            desc: "Tu décris une tribu avec ses réalités partagées. Le format qui fidélise le plus fort.",
            beats: ["Slide 1 : l'appel direct à ta tribu", "1 réalité partagée par slide (« tu sais que… »)", "Ce qui vous sépare des autres", "Slide finale : invitation à se reconnaître + CTA"] },
          { id: "li-car-case", axis: "Conversion", name: "Case study visuel", needs: ["credibilite","resultat"],
            desc: "Un parcours client en slides : point de départ → mécanisme → résultat.",
            beats: ["Slide 1 : le résultat obtenu (accroche)", "Slides : la situation de départ, la douleur", "Slides : ce qui a été fait (le mécanisme)", "Slide finale : résultat détaillé + CTA"] },
          { id: "li-car-objections", axis: "Conversion", name: "Les X objections + réponses", needs: ["objection","credibilite"],
            desc: "Tu listes les vraies objections de ta cible et tu y réponds slide par slide.",
            beats: ["Slide 1 : « Tu te dis peut-être que… »", "1 objection par slide, nommée frontalement", "La réponse au bon niveau (rationnel / émotionnel / identitaire)", "Slide finale : garantie + CTA"] },
          { id: "li-car-beforeafter", axis: "Conversion", name: "Avant / Après détaillé", needs: ["douleur","resultat"],
            desc: "Transformation complète : état avant, processus, état après.",
            beats: ["Slide 1 : l'état avant (douleur identifiable)", "Slides : le point de bascule, pourquoi ça change", "Slides : le processus de transformation", "Slide finale : l'état après + CTA"] },
          { id: "li-car-proofstack", axis: "Conversion", name: "Empilement de preuves", needs: ["credibilite","resultat"],
            desc: "Une preuve par slide, de plus en plus forte. La masse fait l'argument, pas un seul cas.",
            beats: ["Slide 1 : la promesse mise en doute (« Tu me crois pas ? »)", "1 preuve par slide : capture, chiffre, témoignage", "Les plus fortes en fin de séquence", "Slide finale : « à ton tour » + CTA"] },
          { id: "li-car-inaction", axis: "Conversion", name: "Le coût de l'inaction", needs: ["inaction","futur"],
            desc: "Tu chiffres slide par slide ce que coûte de ne rien faire. Pour les prospects qui repoussent.",
            beats: ["Slide 1 : « Ne rien faire a un prix. Le voici. »", "1 slide par coût (temps, argent, opportunité)", "Slide : la projection à 12 mois", "Slide finale : l'alternative + CTA"] },
          { id: "li-car-offer", axis: "Conversion", name: "Offre décomposée", needs: ["pvu","garantie","ancrage","plaisir"],
            desc: "Tu déballes ce que contient l'offre, slide par slide. Pour une audience chaude en fin de lancement.",
            beats: ["Slide 1 : ce que c'est en une phrase", "1 slide par composant de l'offre", "Slide prix + ancrage + garantie", "Slide finale : deadline + CTA direct"] },
          { id: "li-car-mecha", axis: "Conversion", name: "Mécanisme unique expliqué", needs: ["mecanisme","differentiation"],
            desc: "Tu expliques visuellement POURQUOI ta méthode marche. Transforme une offre banale en approche propriétaire.",
            beats: ["Slide 1 : le nom du mécanisme + sa promesse", "Slides : ce que les approches classiques ratent", "Slides : comment le tien s'y prend", "Slide finale : la preuve + CTA"] },
          { id: "li-car-filter", axis: "Conversion", name: "C'est pour toi si / pas si", needs: ["inclusion","pvu"],
            desc: "Tu filtres explicitement qui doit acheter. L'exclusion volontaire augmente la conversion des bons profils.",
            beats: ["Slide 1 : « Ce n'est pas pour tout le monde »", "Slides : c'est pour toi si… (1 critère par slide)", "Slides : ce n'est pas pour toi si…", "Slide finale : si tu es dans la 1re liste → CTA"] },
          { id: "li-car-guarantee", axis: "Conversion", name: "Renversement du risque", needs: ["garantie","objection"],
            desc: "Tu déplaces le risque de son côté vers le tien, slide par slide.",
            beats: ["Slide 1 : la peur réelle nommée", "Slides : pourquoi le risque est légitime", "Slides : la garantie détaillée, sans astérisque", "Slide finale : ce qu'il risque vraiment + CTA"] },
          { id: "li-car-anchor", axis: "Conversion", name: "Recadrage du prix", needs: ["ancrage","objection"],
            desc: "Tu recadres la perception du prix par comparaison visuelle.",
            beats: ["Slide 1 : le prix annoncé franchement", "Slides : les comparaisons naturelles du prospect", "Slides : à quoi ça devrait vraiment se comparer", "Slide finale : l'évidence + CTA"] },
          { id: "li-car-checklist", axis: "Nurture", name: "Checklist / template", needs: ["mecanisme"],
            desc: "Une checklist ou un modèle prêt à appliquer. Taux de sauvegarde très élevé.",
            beats: ["Slide 1 : à quoi sert la checklist (bénéfice)", "1 item vérifiable par slide", "Slide « comment l'utiliser »", "CTA : « enregistre »"] },
          { id: "li-car-tools", axis: "Nurture", name: "Ressources / outils", needs: ["mecanisme"],
            desc: "Tu partages ta stack avec le pourquoi de chaque choix. Fort en saves et en DMs.",
            beats: ["Slide 1 : ta promesse (« ma stack complète pour X »)", "1 outil par slide : ce que c'est + pourquoi", "Le plus inattendu en avant-dernière", "Slide finale : CTA + « ton outil préféré ? »"] },
          { id: "li-car-process", axis: "Nurture", name: "Mon process interne", needs: ["mecanisme","differentiation"],
            desc: "Tu montres comment tu travailles, slide par slide. Transparence qui crée la confiance.",
            beats: ["Slide 1 : ce que tu vas montrer", "1 slide par étape réelle, avec les durées", "Slide : ce que tu refuses de faire et pourquoi", "Slide finale : invitation à questionner"] },
          { id: "li-car-lessons", axis: "Nurture", name: "Ce que m'a appris [période]", needs: ["histoire","mecanisme"],
            desc: "Bilan en leçons, une par slide. Plusieurs apprentissages, pas un seul échec.",
            beats: ["Slide 1 : la période + le nombre de leçons", "1 leçon par slide, concrète", "Celle qui t'a le plus surpris, développée", "Slide finale : ce que tu fais différemment"] },
          { id: "li-car-behind", axis: "Nurture", name: "Coulisses d'un projet", needs: ["histoire","storytelling"],
            desc: "Les coulisses en slides : ce que personne ne voit d'un projet livré.",
            beats: ["Slide 1 : le projet + son résultat visible", "Slides : les coulisses, les vraies étapes", "Slide : le moment où ça a failli mal tourner", "Slide finale : la leçon + CTA"] },
          { id: "li-car-tips", axis: "Nurture", name: "X tips pratiques", needs: ["mecanisme"],
            desc: "Des conseils actionnables, un par slide. Le format le plus partagé en DM.",
            beats: ["Slide 1 : le nombre + la promesse", "1 tip concret par slide avec exemple", "Le plus contre-intuitif en avant-dernière", "Slide finale : récap + « enregistre »"] },
          { id: "li-car-qa", axis: "Nurture", name: "Questions reçues en DM", needs: ["objection","mecanisme"],
            desc: "Tu réponds aux questions qu'on te pose vraiment, une par slide.",
            beats: ["Slide 1 : « Les questions qu'on me pose en DM »", "1 question citée + réponse par slide", "La question que personne n'ose poser", "Slide finale : « ta question ? » + CTA"] },
          { id: "li-car-nuance", axis: "Nurture", name: "J'ai changé d'avis", needs: ["recontextualisation","differentiation"],
            desc: "Tu reviens sur une position que tu défendais. Rare, donc très fort en crédibilité.",
            beats: ["Slide 1 : ce que tu pensais avant, assumé", "Slides : ce qui t'a fait douter (faits précis)", "Slides : ta position actuelle, nuancée", "Slide finale : ce que ça implique + débat"] },
          { id: "li-car-recap", axis: "Nurture", name: "Récap / best-of", needs: ["pvu","mecanisme"],
            desc: "Tu compiles tes meilleures idées sur un thème. Sert les nouveaux abonnés sans redite.",
            beats: ["Slide 1 : le thème + ce que le lecteur y gagne", "1 idée clé par slide, reformulée", "Slide : le fil rouge qui les relie", "Slide finale : CTA + « ce qui manque ? »"] },
        ],
      },
      {
        id: "li-video", name: "Vidéo native",
        note: "Sous 90s idéalement 30-60s. Sous-titres obligatoires. Hook visuel + verbal dans les 3 premières secondes.",
        schemas: [
          { id: "li-vid-insight", axis: "Awareness", name: "Talking-head insight", needs: ["differentiation","pvu"],
            desc: "Face caméra, tu livres une idée forte en 60s. Construit la connexion personnelle plus vite que le texte.",
            beats: ["0-3s : hook verbal + texte à l'écran (l'idée choc)", "Le développement en 2-3 points rapides", "Un exemple concret", "CTA : « suis pour plus » / commentaire"] },
          { id: "li-vid-tuto", axis: "Awareness", name: "Mini-tuto", needs: ["mecanisme"],
            desc: "Tu montres comment faire une chose précise, étape par étape.",
            beats: ["0-3s : la promesse (« Comment faire X en 60s »)", "Les étapes montrées, une à une", "Le résultat obtenu", "CTA : « enregistre pour tester »"] },
          { id: "li-vid-story", axis: "Nurture", name: "Storytime court", needs: ["histoire","douleur"],
            desc: "Une histoire perso racontée face caméra, naturelle. Format le plus humain de LinkedIn.",
            beats: ["0-3s : l'annonce de l'histoire (au point fort)", "Le récit rapide, sans fioriture", "Le moment de bascule ou la leçon", "CTA doux : « est-ce que ça vous parle ? »"] },
          { id: "li-vid-objection", axis: "Conversion", name: "Réponse à une objection", needs: ["objection","credibilite"],
            desc: "Tu répondes face caméra à LA vraie objection de ton marché. Désarme avant même que le prospect la formule.",
            beats: ["0-3s : l'objection énoncée (tu la joues)", "Pourquoi on la comprend", "Le retournement", "CTA : DM ou lien"] },
          { id: "li-vid-resultat", axis: "Conversion", name: "Résultat client raconté", needs: ["credibilite","resultat"],
            desc: "Tu racontes en 60s le parcours d'un client. La preuve sociale la plus convertissante en vidéo.",
            beats: ["0-3s : le résultat chiffré annoncé", "D'où il partait (douleur initiale)", "Ce qui a changé (mécanisme)", "CTA vers l'offre"] },
        ],
      },
      {
        id: "li-multi", name: "Post multi-images",
        note: "Idéal pour preuve sociale et portée. Images portrait 1080×1350.",
        schemas: [
          { id: "li-multi-proof", axis: "Conversion", name: "Preuve sociale visuelle", needs: ["credibilite","resultat"],
            desc: "Plusieurs captures de résultats, témoignages ou coulisses en un post.",
            beats: ["Image 1 : le message ou le résultat le plus fort", "Images : captures de preuves, témoignages, chiffres", "Légende : le contexte + ce que ça prouve", "CTA doux"] },
          { id: "li-multi-event", axis: "Nurture", name: "Coulisses / événement", needs: ["histoire"],
            desc: "Une série de photos qui montrent l'envers du décor. Humanise la marque.",
            beats: ["Image 1 : la photo la plus parlante", "Images : le déroulé, les moments", "Légende : l'histoire derrière", "CTA de connexion"] },
          { id: "li-multi-transfo", axis: "Conversion", name: "Avant / Après visuel", needs: ["douleur","resultat"],
            desc: "Le contraste avant/après en images. Le format le plus immédiatement lisible pour prouver la transformation.",
            beats: ["Images « avant » : l'état initial documenté", "Images « après » : le résultat visible", "Légende : les chiffres + le mécanisme en 2 lignes", "CTA + invitation à partager"] },
        ],
      },
      {
        id: "li-poll", name: "Sondage (poll)",
        note: "Génère des votes mais peu de commentaires. Utile pour tester ou créer un débat d'ouverture.",
        schemas: [
          { id: "li-poll-polar", axis: "Awareness", name: "Question polarisante", needs: ["inclusion","differentiation"],
            desc: "Tu forces un choix binaire qui révèle la posture de ton audience.",
            beats: ["La question qui divise ta cible (2-4 options tranchées)", "En légende : pourquoi la question compte", "Ton propre avis, assumé, en commentaire", "Relance : « pourquoi ce choix ? »"] },
          { id: "li-poll-research", axis: "Nurture", name: "Recherche terrain publique", needs: ["douleur","objection"],
            desc: "Tu sonds publiquement ta cible sur ses vrais freins ou désirs. Génère du reach ET de la matière terrain.",
            beats: ["La question directe sur une douleur ou un désir", "2-4 options très précises (pas généralistes)", "Légende : pourquoi tu demandes (transparence)", "CTA : « commente si ton cas n'est pas là »"] },
        ],
      },
      {
        id: "li-news", name: "Newsletter / Article",
        note: "Profondeur long-format, indexé Google, durée de vie permanente.",
        schemas: [
          { id: "li-news-deep", axis: "Nurture", name: "Deep-dive éducatif", needs: ["mecanisme","pvu","differentiation"],
            desc: "Un sujet traité en profondeur avec structure et exemples. Construit l'autorité sur la durée.",
            beats: ["Titre + intro : la promesse et pourquoi lire maintenant", "Le corps structuré en sections claires", "Exemples concrets à chaque point clé", "Conclusion actionnable + CTA vers ton offre"] },
          { id: "li-news-manifesto", axis: "Awareness", name: "Manifeste / prise de position", needs: ["inclusion","differentiation"],
            desc: "Tu défends une vision de ton marché sur le fond. Fédère ceux qui partagent ta vision.",
            beats: ["L'affirmation centrale, sans détour", "Le constat sur l'état du marché", "Ce que tu défends, avec arguments", "L'appel à rejoindre ta vision"] },
          { id: "li-news-casestudy", axis: "Conversion", name: "Case study long format", needs: ["credibilite","resultat","mecanisme"],
            desc: "Un cas client traité en profondeur : contexte, méthode, chiffres, leçons. L'arme la plus lourde en B2B.",
            beats: ["Le contexte initial du client (situation, douleur)", "Les objectifs fixés ensemble", "La méthode appliquée step by step", "Les résultats chiffrés + les leçons clés + CTA"] },
        ],
      },
    ],
  },

  // ─── INSTAGRAM ────────────────────────────────────────────────────────────
  {
    id: "instagram", name: "Instagram",
    note: "4 algos séparés (Feed, Reels, Stories, Explore). Reels = reach vers non-followers. Carrousel = engagement + saves. Stories = fidélisation. DM shares = signal nº1.",
    formats: [
      {
        id: "ig-reel", name: "Reel",
        note: "Reach maximal. 8-30s idéal. Hook dans les 3 premières secondes. Texte à l'écran. Pas de watermark d'autre plateforme.",
        schemas: [
          { id: "ig-reel-identity", axis: "Awareness", name: "Identity Call", needs: ["inclusion","douleur"],
            desc: "« Si tu es… » — tu appelles ta cible ultra-précise dès la 1re seconde.",
            beats: ["0-3s : l'appel identitaire", "Tu décris SA réalité (effet miroir viscéral)", "Ce qu'il devrait savoir ou faire", "CTA : « suis si c'est toi »"] },
          { id: "ig-reel-mistake", axis: "Awareness", name: "Mistake Warning", needs: ["objection","mecanisme"],
            desc: "« Arrête de… » — tu pointes une erreur que le viewer fait probablement.",
            beats: ["0-3s : l'erreur nommée", "Pourquoi c'est contre-productif", "Quoi faire à la place", "CTA"] },
          { id: "ig-reel-story", axis: "Awareness", name: "Micro-story cliffhanger", needs: ["histoire","douleur"],
            desc: "Une histoire courte qui démarre au point de tension.",
            beats: ["0-3s : entrée dans l'histoire au moment fort", "Le récit qui avance vite", "Le twist / la résolution", "CTA / boucle vers le profil"] },
          { id: "ig-reel-listicle", axis: "Awareness", name: "Listicle rapide", needs: ["mecanisme","pvu"],
            desc: "« 3 trucs que… » — une liste énergique en quelques secondes.",
            beats: ["0-3s : la promesse chiffrée", "Chaque item rythmé avec texte à l'écran", "Le meilleur item gardé pour la fin", "CTA : « enregistre »"] },
          { id: "ig-reel-contrarian", axis: "Awareness", name: "Hot take / opinion", needs: ["differentiation","inclusion"],
            desc: "Une prise de position tranchée. Fort en commentaires et reach.",
            beats: ["0-3s : la position tranchée annoncée", "Pourquoi tu penses ça", "Ce que la plupart font à tort", "CTA : « t'es d'accord ? »"] },
          { id: "ig-reel-myth", axis: "Awareness", name: "Mythe déconstruit", needs: ["differentiation","objection"],
            desc: "Tu démontes une croyance commune de ta niche en 30s.",
            beats: ["0-3s : le mythe annoncé (« Tout le monde dit X »)", "Pourquoi c'est faux en 2 points", "Ce qu'il faut faire à la place", "CTA : « sauve ça »"] },
          { id: "ig-reel-pov", axis: "Awareness", name: "POV immersif", needs: ["inclusion","histoire"],
            desc: "« POV : tu es… » — tu places le viewer dans une situation qu'il reconnaît.",
            beats: ["0-3s : le POV annoncé en texte à l'écran", "La mise en situation (tu joues la scène)", "Le twist ou la révélation", "CTA : « commente si c'est toi »"] },
          { id: "ig-reel-comparison", axis: "Awareness", name: "Ça vs Ça", needs: ["differentiation","recontextualisation"],
            desc: "Deux approches montrées en split ou en alternance rapide. Le contraste visuel fait tout.",
            beats: ["0-3s : les deux options posées visuellement", "Alternance rapide : ce que donne chacune", "Le verdict, assumé", "CTA : « tu fais lequel ? »"] },
          { id: "ig-reel-reverse", axis: "Awareness", name: "Décryptage d'un exemple", needs: ["credibilite","mecanisme"],
            desc: "Tu prends un cas réel à l'écran et tu l'annotes en direct. Très pédagogique et sauvegardé.",
            beats: ["0-3s : le cas montré + son résultat", "Tu annotes les éléments clés un par un", "Ce que la plupart auraient fait", "CTA : « enregistre »"] },
          { id: "ig-reel-timeline", axis: "Awareness", name: "Avant / Maintenant du marché", needs: ["recontextualisation","differentiation"],
            desc: "Tu montres ce qui a changé dans ton secteur et ce que ça implique.",
            beats: ["0-3s : le contraste temporel annoncé", "Ce qui marchait avant / ce qui marche maintenant", "Ce que la plupart continuent de faire", "CTA : la nouvelle règle"] },
          { id: "ig-reel-data", axis: "Awareness", name: "Le chiffre qui dérange", needs: ["credibilite","douleur"],
            desc: "Tu ouvres sur une donnée brute affichée en grand, puis tu déroules ce qu'elle révèle.",
            beats: ["0-3s : le chiffre seul, plein écran", "Ce qu'il signifie pour ta cible", "Pourquoi personne n'en parle", "CTA : commentaire"] },
          { id: "ig-reel-question", axis: "Awareness", name: "Question au marché", needs: ["douleur","objection"],
            desc: "Tu poses une vraie question sans réponse toute faite. Génère des commentaires, donc du reach.",
            beats: ["0-3s : la question posée franchement", "Pourquoi elle te travaille", "Les réponses possibles, sans trancher", "CTA : « je lis tout »"] },
          { id: "ig-reel-pain", axis: "Conversion", name: "Pain First", needs: ["douleur","mecanisme"],
            desc: "Tu ouvres direct sur la frustration du viewer, sans intro.",
            beats: ["0-3s : la douleur nommée frontalement", "Tu creuses : pourquoi ça arrive", "La solution : ton mécanisme en 1 phrase", "CTA : « suis pour la suite »"] },
          { id: "ig-reel-results", axis: "Conversion", name: "Results First", needs: ["credibilite","resultat"],
            desc: "Tu montres le résultat (avant/après, chiffre) avant d'expliquer.",
            beats: ["0-3s : le résultat choc", "« Voilà comment » : le mécanisme rapide", "Preuve que c'est reproductible", "CTA clair"] },
          { id: "ig-reel-objection", axis: "Conversion", name: "Objection en direct", needs: ["objection","credibilite"],
            desc: "Tu prends une objection réelle face caméra et tu la retournes en temps réel.",
            beats: ["0-3s : tu joues l'objection (« Oui mais… »)", "Le retournement direct, sans détour", "La preuve rapide", "CTA : « commente si tu pensais pareil »"] },
          { id: "ig-reel-transformation", axis: "Conversion", name: "Transformation rapide", needs: ["douleur","resultat"],
            desc: "Avant/après en Reel. Le contraste visuel fait le travail persuasif.",
            beats: ["0-3s : l'état avant (le problème)", "La bascule (ce qui a changé)", "L'état après (le résultat visible)", "CTA + mécanisme en légende"] },
          { id: "ig-reel-inaction", axis: "Conversion", name: "Le coût d'attendre", needs: ["inaction","futur"],
            desc: "Tu chiffres ce que coûte de repousser. Pour ceux qui hésitent depuis des mois.",
            beats: ["0-3s : le coût de l'attente, chiffré", "Le calcul rapide à l'écran", "Où il en sera dans 12 mois", "CTA : l'alternative"] },
          { id: "ig-reel-mecha", axis: "Conversion", name: "Mécanisme révélé", needs: ["mecanisme","differentiation"],
            desc: "Tu nommes et expliques POURQUOI ta méthode marche en 45s.",
            beats: ["0-3s : le nom du mécanisme + sa promesse", "Ce que les approches classiques ratent", "Comment le tien s'y prend", "CTA"] },
          { id: "ig-reel-filter", axis: "Conversion", name: "C'est pour toi si / pas si", needs: ["inclusion","pvu"],
            desc: "Tu filtres explicitement. L'exclusion volontaire augmente la conversion des bons profils.",
            beats: ["0-3s : « Ce n'est pas pour tout le monde »", "C'est pour toi si… (3 critères rapides)", "Ce n'est pas pour toi si…", "CTA pour la 1re liste"] },
          { id: "ig-reel-guarantee", axis: "Conversion", name: "Renversement du risque", needs: ["garantie","objection"],
            desc: "Tu déplaces le risque de son côté vers le tien.",
            beats: ["0-3s : la peur nommée (« Et si ça marche pas ? »)", "Tu valides que le risque est légitime", "La garantie, sans astérisque", "CTA : « tu risques rien »"] },
          { id: "ig-reel-anchor", axis: "Conversion", name: "Recadrage du prix", needs: ["ancrage","objection"],
            desc: "Tu recadres la perception du prix par comparaison visuelle rapide.",
            beats: ["0-3s : le prix annoncé franchement", "La comparaison naturelle du prospect", "À quoi ça devrait se comparer", "CTA"] },
          { id: "ig-reel-testimony", axis: "Conversion", name: "Témoignage monté", needs: ["credibilite","resultat"],
            desc: "Un extrait client monté serré avec son résultat en surimpression.",
            beats: ["0-3s : le résultat en texte + la voix du client", "Son point de départ", "Ce qui a changé pour lui", "CTA vers l'offre"] },
          { id: "ig-reel-tuto", axis: "Nurture", name: "Mini-tuto express", needs: ["mecanisme"],
            desc: "Tu montres comment faire quelque chose en moins de 30 secondes.",
            beats: ["0-3s : ce que tu vas montrer", "Les étapes rapides, bien rythmées", "Le résultat visible", "CTA : « enregistre »"] },
          { id: "ig-reel-grwm", axis: "Nurture", name: "GRWM + insight", needs: ["histoire","pvu"],
            desc: "Tu livres un insight business pendant que tu fais autre chose. Très naturel.",
            beats: ["0-3s : le contexte + l'annonce du sujet", "Le contenu livré pendant l'activité", "Le point fort / la révélation", "CTA décontracté"] },
          { id: "ig-reel-behind", axis: "Nurture", name: "Coulisses", needs: ["histoire","storytelling"],
            desc: "Tu montres l'envers du décor d'un projet ou d'une journée.",
            beats: ["0-3s : ce qu'on va voir", "Les coulisses réelles, sans filtre", "Le moment de tension ou d'imprévu", "CTA : « la suite en story »"] },
          { id: "ig-reel-lessons", axis: "Nurture", name: "Ce que m'a appris [période]", needs: ["histoire","mecanisme"],
            desc: "Bilan en leçons rapides. Plusieurs apprentissages enchaînés.",
            beats: ["0-3s : la période + le nombre de leçons", "Chaque leçon en 3-4s max", "Celle qui t'a surpris, développée", "CTA : « enregistre »"] },
          { id: "ig-reel-tools", axis: "Nurture", name: "Ma stack / mes outils", needs: ["mecanisme"],
            desc: "Tu montres tes outils à l'écran avec le pourquoi de chaque choix.",
            beats: ["0-3s : la promesse (« ma stack pour X »)", "Chaque outil montré + pourquoi", "Le plus inattendu en dernier", "CTA : « tu utilises quoi ? »"] },
          { id: "ig-reel-qa", axis: "Nurture", name: "Réponse à une question DM", needs: ["objection","mecanisme"],
            desc: "Tu réponds face caméra à une question reçue. Prouve que tu écoutes.",
            beats: ["0-3s : la question affichée à l'écran", "Pourquoi c'est une bonne question", "Ta réponse complète et rapide", "CTA : « pose la tienne »"] },
          { id: "ig-reel-nuance", axis: "Nurture", name: "J'ai changé d'avis", needs: ["recontextualisation","differentiation"],
            desc: "Tu reviens sur une position que tu défendais. Rare, donc fort en crédibilité.",
            beats: ["0-3s : ce que tu pensais avant, assumé", "Ce qui t'a fait douter", "Ta position actuelle", "CTA : débat en commentaire"] },
          { id: "ig-reel-celebrate", axis: "Nurture", name: "Célébration client", needs: ["credibilite","resultat"],
            desc: "Tu mets un client en lumière sans te mettre au centre. Preuve sociale généreuse.",
            beats: ["0-3s : le résultat du client, nommé", "Qui il est, d'où il vient", "Ce qu'IL a fait (le mérite lui revient)", "Zéro CTA commercial"] },
        ],
      },
      {
        id: "ig-carousel", name: "Carrousel",
        note: "Engagement et saves les plus hauts. Algo « 2e chance ». 6-10 slides. Slide 1 = hook. Dernière = CTA + save bait.",
        schemas: [
          { id: "ig-car-framework", axis: "Awareness", name: "Framework enseigné", needs: ["mecanisme","pvu"],
            desc: "Roadmap étape par étape, une par slide. Éducatif et fortement sauvegardé.",
            beats: ["Slide 1 : promesse (« La méthode en X étapes »)", "1 étape par slide, actionnable", "1 slide exemple", "Slide finale : récap + « enregistre »"] },
          { id: "ig-car-save", axis: "Awareness", name: "Liste sauvegarde", needs: ["mecanisme","pvu"],
            desc: "Bold promise slide 1, valeur sur 5-8 slides. Optimisé pour les saves.",
            beats: ["Slide 1 : promesse forte", "1 item de valeur par slide", "Diversifie les angles", "Slide finale : « enregistre pour plus tard »"] },
          { id: "ig-car-story", axis: "Awareness", name: "Micro-story visuelle", needs: ["histoire","resultat"],
            desc: "Une histoire au twist racontée slide par slide.",
            beats: ["Slide 1 : accroche contre-intuitive", "Le récit condensé", "Le twist / la révélation", "La leçon + CTA"] },
          { id: "ig-car-comparison", axis: "Awareness", name: "Comparaison X vs Y", needs: ["differentiation","pvu"],
            desc: "Tu compares deux approches visuellement. Génère du débat et des sauvegardes.",
            beats: ["Slide 1 : les deux options posées clairement", "1 critère de comparaison par slide", "Le verdict tranché", "CTA : « tu choisis quoi ? »"] },
          { id: "ig-car-glossaire", axis: "Awareness", name: "Glossaire de niche", needs: ["pvu","mecanisme"],
            desc: "Tu définis les termes clés à ta façon. Positionne comme référence.",
            beats: ["Slide 1 : la promesse", "1 terme par slide avec ta définition", "Ta définition propriétaire là où tu te démarques", "Slide finale : récap + CTA"] },
          { id: "ig-car-roadmap", axis: "Awareness", name: "Roadmap temporelle", needs: ["mecanisme","futur"],
            desc: "Un plan chronologique visuellement attractif. Très fort en sauvegardes.",
            beats: ["Slide 1 : la destination (résultat final)", "1 slide par étape clé", "Les pièges à chaque étape", "Slide finale : par où commencer + CTA"] },
          { id: "ig-car-identite", axis: "Awareness", name: "Signal identitaire", needs: ["inclusion","douleur"],
            desc: "Tu appelles une tribu précise et tu la reconnais. Le format qui fidélise le plus fort.",
            beats: ["Slide 1 : l'appel direct à ta tribu", "Ce que vous avez en commun (valeurs, réalités)", "Ce qui vous différencie des autres", "Slide finale : invitation à se reconnaître + CTA"] },
          { id: "ig-car-mistakes", axis: "Awareness", name: "Les X erreurs à éviter", needs: ["objection","douleur"],
            desc: "Une erreur par slide avec sa correction. Structure symétrique erreur → fix.",
            beats: ["Slide 1 : le nombre d'erreurs + l'enjeu", "1 slide par erreur : ce qu'on fait / ce qu'il faut faire", "La plus coûteuse en avant-dernière", "Slide finale : checklist récap + CTA"] },
          { id: "ig-car-myth", axis: "Awareness", name: "Mythe déconstruit", needs: ["differentiation","objection"],
            desc: "Tu démontes une croyance slide après slide.",
            beats: ["Slide 1 : le mythe", "Slides : pourquoi c'est faux", "Slides : le vrai mécanisme", "CTA"] },
          { id: "ig-car-reverse", axis: "Awareness", name: "Déconstruction d'un exemple", needs: ["credibilite","mecanisme"],
            desc: "Tu prends un cas réel et tu l'annotes slide par slide. Très pédagogique.",
            beats: ["Slide 1 : le cas + son résultat", "Slides : chaque élément décortiqué", "Slide : ce que la plupart auraient fait", "Slide finale : règles à retenir + CTA"] },
          { id: "ig-car-data", axis: "Awareness", name: "Data viz / chiffres clés", needs: ["credibilite","douleur"],
            desc: "Un chiffre marquant par slide, visualisé. La donnée porte l'argument.",
            beats: ["Slide 1 : le chiffre le plus frappant", "1 donnée par slide, visualisée", "Slide : ce que l'ensemble révèle", "Slide finale : quoi en faire + CTA"] },
          { id: "ig-car-faq", axis: "Awareness", name: "FAQ visuelle", needs: ["objection","mecanisme"],
            desc: "Une question par slide. Questions d'information, pas freins d'achat.",
            beats: ["Slide 1 : « Les X questions qu'on me pose le plus »", "1 question + réponse par slide", "La question que personne n'ose poser", "Slide finale : « ta question ? » + CTA"] },
          { id: "ig-car-beforeafter", axis: "Conversion", name: "Avant / Après", needs: ["douleur","resultat"],
            desc: "Transformation visuelle en slides. Slide 1 = l'état avant, dernières = le après.",
            beats: ["Slide 1 : l'état « avant »", "Slides : la bascule, ce qui change", "Slides : l'état « après »", "CTA : comment obtenir la même transfo"] },
          { id: "ig-car-objections", axis: "Conversion", name: "X objections + réponses", needs: ["objection","credibilite"],
            desc: "Tu listes et réponds aux vraies objections de ta cible. Très fort en conversion.",
            beats: ["Slide 1 : « Tu te demandes si… »", "1 objection par slide nommée", "La réponse précise et convaincante", "Slide finale : garantie + CTA"] },
          { id: "ig-car-casestudy", axis: "Conversion", name: "Case study visuel", needs: ["credibilite","resultat","mecanisme"],
            desc: "Un parcours client en slides. La preuve sociale en format swipe.",
            beats: ["Slide 1 : le résultat (accroche)", "La situation de départ", "Le mécanisme appliqué", "Le résultat détaillé + CTA"] },
          { id: "ig-car-proofstack", axis: "Conversion", name: "Empilement de preuves", needs: ["credibilite","resultat"],
            desc: "Une preuve par slide, de plus en plus forte. La masse fait l'argument.",
            beats: ["Slide 1 : la promesse mise en doute (« Tu me crois pas ? »)", "1 preuve par slide : capture, chiffre, témoignage", "Les plus fortes en fin", "Slide finale : « à ton tour » + CTA"] },
          { id: "ig-car-inaction", axis: "Conversion", name: "Le coût de l'inaction", needs: ["inaction","futur"],
            desc: "Tu chiffres slide par slide ce que coûte de ne rien faire.",
            beats: ["Slide 1 : « Ne rien faire a un prix »", "1 slide par coût (temps, argent, opportunité)", "Slide : la projection à 12 mois", "Slide finale : l'alternative + CTA"] },
          { id: "ig-car-offer", axis: "Conversion", name: "Offre décomposée", needs: ["pvu","garantie","ancrage","plaisir"],
            desc: "Tu déballes ce que contient l'offre, slide par slide. Pour audience chaude.",
            beats: ["Slide 1 : ce que c'est en une phrase", "1 slide par composant de l'offre", "Slide prix + ancrage + garantie", "Slide finale : deadline + CTA direct"] },
          { id: "ig-car-mecha", axis: "Conversion", name: "Mécanisme unique expliqué", needs: ["mecanisme","differentiation"],
            desc: "Tu expliques visuellement POURQUOI ta méthode marche.",
            beats: ["Slide 1 : le nom du mécanisme + sa promesse", "Slides : ce que les approches classiques ratent", "Slides : comment le tien s'y prend", "Slide finale : la preuve + CTA"] },
          { id: "ig-car-filter", axis: "Conversion", name: "C'est pour toi si / pas si", needs: ["inclusion","pvu"],
            desc: "Tu filtres explicitement qui doit acheter. Augmente la conversion des bons profils.",
            beats: ["Slide 1 : « Ce n'est pas pour tout le monde »", "Slides : c'est pour toi si… (1 critère par slide)", "Slides : ce n'est pas pour toi si…", "Slide finale : CTA pour la 1re liste"] },
          { id: "ig-car-guarantee", axis: "Conversion", name: "Renversement du risque", needs: ["garantie","objection"],
            desc: "Tu déplaces le risque de son côté vers le tien, slide par slide.",
            beats: ["Slide 1 : la peur réelle nommée", "Slides : pourquoi le risque est légitime", "Slides : la garantie détaillée", "Slide finale : ce qu'il risque vraiment + CTA"] },
          { id: "ig-car-anchor", axis: "Conversion", name: "Recadrage du prix", needs: ["ancrage","objection"],
            desc: "Tu recadres la perception du prix par comparaison visuelle.",
            beats: ["Slide 1 : le prix annoncé franchement", "Slides : les comparaisons naturelles du prospect", "Slides : à quoi ça devrait vraiment se comparer", "Slide finale : l'évidence + CTA"] },
          { id: "ig-car-tips", axis: "Nurture", name: "X tips pratiques", needs: ["mecanisme"],
            desc: "Des conseils actionnables, un par slide. Le format le plus partagé en DM.",
            beats: ["Slide 1 : le nombre + la promesse", "1 tip concret par slide avec exemple", "Le tip le plus contre-intuitif en avant-dernière", "Slide finale : récap + « enregistre »"] },
          { id: "ig-car-checklist", axis: "Nurture", name: "Checklist / template", needs: ["mecanisme"],
            desc: "Une checklist prête à appliquer. Taux de sauvegarde très élevé.",
            beats: ["Slide 1 : à quoi sert la checklist", "1 item vérifiable par slide", "Slide « comment l'utiliser »", "CTA : « enregistre »"] },
          { id: "ig-car-tools", axis: "Nurture", name: "Ressources / outils", needs: ["mecanisme"],
            desc: "Tu partages ta stack avec le pourquoi de chaque choix.",
            beats: ["Slide 1 : ta promesse (« ma stack pour X »)", "1 outil par slide : ce que c'est + pourquoi", "Le plus inattendu en avant-dernière", "Slide finale : CTA + « ton préféré ? »"] },
          { id: "ig-car-process", axis: "Nurture", name: "Mon process interne", needs: ["mecanisme","differentiation"],
            desc: "Tu montres comment tu travailles. Transparence qui crée la confiance.",
            beats: ["Slide 1 : ce que tu vas montrer", "1 slide par étape réelle, avec les durées", "Slide : ce que tu refuses de faire", "Slide finale : invitation à questionner"] },
          { id: "ig-car-lessons", axis: "Nurture", name: "Ce que m'a appris [période]", needs: ["histoire","mecanisme"],
            desc: "Bilan en leçons, une par slide.",
            beats: ["Slide 1 : la période + le nombre de leçons", "1 leçon par slide, concrète", "Celle qui t'a le plus surpris, développée", "Slide finale : ce que tu fais différemment"] },
          { id: "ig-car-behind", axis: "Nurture", name: "Coulisses d'un projet", needs: ["histoire","storytelling"],
            desc: "Les coulisses en slides : ce que personne ne voit d'un projet livré.",
            beats: ["Slide 1 : le projet + son résultat visible", "Slides : les vraies étapes", "Slide : le moment où ça a failli mal tourner", "Slide finale : la leçon + CTA"] },
          { id: "ig-car-qa", axis: "Nurture", name: "Questions reçues en DM", needs: ["objection","mecanisme"],
            desc: "Tu réponds aux questions qu'on te pose vraiment, une par slide.",
            beats: ["Slide 1 : « Les questions qu'on me pose en DM »", "1 question citée + réponse par slide", "La question que personne n'ose poser", "Slide finale : « ta question ? » + CTA"] },
          { id: "ig-car-celebrate", axis: "Nurture", name: "Célébration client", needs: ["credibilite","resultat"],
            desc: "Tu mets un client en lumière sans te mettre au centre.",
            beats: ["Slide 1 : le résultat du client, nommé", "Slides : qui il est, d'où il vient", "Slides : ce qu'IL a fait", "Slide finale : ce que ça montre, zéro pitch"] },
        ],
      },
      {
        id: "ig-story", name: "Story",
        note: "Fidélisation de l'audience existante. Stickers interactifs = engagement. Idéal pour quotidien et offres limitées.",
        schemas: [
          { id: "ig-story-bts", axis: "Nurture", name: "Coulisses / BTS", needs: ["histoire"],
            desc: "Tu montres l'envers du décor, ton quotidien. Renforce la proximité.",
            beats: ["Story 1 : plante le contexte", "Le déroulé authentique", "Un moment de vulnérabilité ou d'humour", "Sticker interactif"] },
          { id: "ig-story-poll", axis: "Nurture", name: "Sondage / question interactive", needs: ["douleur","objection"],
            desc: "Tu utilises un sticker sondage pour faire participer et récolter des verbatims.",
            beats: ["La question qui intrigue ou divise", "Le sticker (sondage / question)", "Tu relaies quelques réponses", "Tu ouvres vers ton sujet"] },
          { id: "ig-story-offer", axis: "Conversion", name: "Compte à rebours / offre", needs: ["ancrage","garantie"],
            desc: "Tu crées de l'urgence sur un lancement avec un sticker compte à rebours.",
            beats: ["Story 1 : l'annonce + le compte à rebours", "Ce qu'ils obtiennent (les bénéfices)", "La rareté ou la date limite", "CTA swipe ou DM"] },
          { id: "ig-story-testimony", axis: "Conversion", name: "Témoignage relayé", needs: ["credibilite","resultat"],
            desc: "Tu partages un témoignage client avec contexte. La preuve sociale la plus directe en Story.",
            beats: ["Story 1 : le résultat annoncé", "La capture / le verbatim du client", "Le contexte en 1-2 lignes", "CTA vers l'offre"] },
          { id: "ig-story-serie", axis: "Nurture", name: "Série de tips", needs: ["mecanisme","pvu"],
            desc: "3-5 stories consécutives, une idée par story. Garde l'audience jusqu'au bout.",
            beats: ["Story 1 : annonce de la série (X tips sur Y)", "1 tip par story, visuel et clair", "Le meilleur tip gardé pour l'avant-dernière", "Dernière story : récap + lien"] },
          { id: "ig-story-qa", axis: "Nurture", name: "Q&A questions/réponses", needs: ["objection","credibilite"],
            desc: "Tu ouvres une box question et tu y réponds en stories. Format très fort en engagement.",
            beats: ["Story 1 : la box question ouverte", "1 question par story, bien choisie", "La réponse franche + un peu de toi", "Dernière story : CTA vers la suite"] },
        ],
      },
      {
        id: "ig-static", name: "Post statique",
        note: "Reach faible vs Reels mais forte conversion en abonnés qualifiés. Idéal pour citations, quotes et visuels forts.",
        schemas: [
          { id: "ig-static-quote", axis: "Awareness", name: "Citation / Quote visuelle", needs: ["pvu","differentiation"],
            desc: "Une phrase forte sur fond visuel. Format ultra-simple, très partagé en DM.",
            beats: ["La citation choisie : tranchée et mémorable", "Le visuel épuré qui met la phrase en valeur", "La légende : le contexte de la citation + ton angle", "CTA : « partage si tu penses pareil »"] },
          { id: "ig-static-stat", axis: "Conversion", name: "Statistique choc", needs: ["credibilite","douleur"],
            desc: "Un chiffre frappant mis en avant visuellement. Déclenche la réflexion et les partages.",
            beats: ["Le chiffre seul sur le visuel (grand, lisible)", "La légende : ce que ça signifie concrètement", "Pourquoi c'est important pour ta cible", "CTA : « tag quelqu'un qui devrait savoir ça »"] },
          { id: "ig-static-meme", axis: "Awareness", name: "Meme de niche", needs: ["inclusion","douleur"],
            desc: "Un meme sur une réalité de ta cible. Très fort en partages et en identification.",
            beats: ["Le meme lui-même : reconnaissable + drôle ou douloureux", "La légende : le contexte de ta cible", "Ton angle / ta prise de position", "CTA : « tag celui qui se reconnaît »"] },
        ],
      },
    ],
  },

  // ─── TIKTOK ───────────────────────────────────────────────────────────────
  {
    id: "tiktok", name: "TikTok",
    note: "Vidéo = roi (watch time). Photo Mode/carrousel = boosté en 2026. Contenu aligné niche > viral aléatoire.",
    formats: [
      {
        id: "tt-video", name: "Vidéo",
        note: "Rétention décidée dans les 1,5 premières secondes. Watch time = signal core. Le hook fait ou défait la vidéo.",
        schemas: [
          { id: "tt-vid-identity", axis: "Awareness", name: "Identity Call", needs: ["inclusion","douleur"],
            desc: "« Si tu es… » — appel ultra-ciblé. Le hook nº1 en rétention.",
            beats: ["0-2s : l'appel identitaire précis", "Tu décris SA réalité (effet miroir)", "Ce qu'il devrait savoir", "CTA : « suis si c'est toi »"] },
          { id: "tt-vid-storytime", axis: "Awareness", name: "Storytime", needs: ["histoire","douleur"],
            desc: "Récit perso format natif TikTok. Très fort en watch time.",
            beats: ["0-2s : l'annonce de l'histoire au point fort", "Le récit sans temps mort (toboggan)", "Le climax / la révélation", "La chute + CTA"] },
          { id: "tt-vid-mistake", axis: "Awareness", name: "Mistake Warning", needs: ["objection","mecanisme"],
            desc: "« Arrête de… » — tu pointes une erreur commune.",
            beats: ["0-2s : l'erreur nommée", "Pourquoi c'est contre-productif", "Quoi faire à la place", "CTA"] },
          { id: "tt-vid-contrarian", axis: "Awareness", name: "Contrarian Strike", needs: ["differentiation","inclusion"],
            desc: "Affirmation à contre-courant dès la 1re seconde. Fort en commentaires.",
            beats: ["0-2s : la phrase qui casse le consensus", "Pourquoi tout le monde se trompe", "Ton angle, le vrai mécanisme", "CTA"] },
          { id: "tt-vid-tuto", axis: "Awareness", name: "Tuto / hack", needs: ["mecanisme"],
            desc: "Tu enseignes une chose précise étape par étape.",
            beats: ["0-2s : la promesse", "Les étapes montrées, rapides", "Le résultat", "CTA : « enregistre »"] },
          { id: "tt-vid-reaction", axis: "Awareness", name: "Réaction / Stitch", needs: ["differentiation","objection"],
            desc: "Tu réagis à un contenu viral de ta niche. Emprunte le reach de l'original.",
            beats: ["0-2s : l'extrait du contenu original", "Ta réaction / ton angle différent", "Ce que tu ferais à la place", "CTA : « t'es d'accord ? »"] },
          { id: "tt-vid-pov", axis: "Awareness", name: "POV immersif", needs: ["inclusion","histoire"],
            desc: "« POV : tu es… » — format immersif qui place le viewer dans une situation.",
            beats: ["0-2s : le POV annoncé (texte à l'écran)", "La mise en situation (tu joues le rôle)", "Le twist ou la révélation", "CTA : « commente si c'est toi »"] },
          { id: "tt-vid-myth", axis: "Awareness", name: "Mythe déconstruit", needs: ["differentiation","objection"],
            desc: "Tu démontes une croyance commune de ta niche en moins d'une minute.",
            beats: ["0-2s : le mythe annoncé", "Pourquoi c'est faux en 2 points", "Ce qu'il faut faire à la place", "CTA : « sauve ça »"] },
          { id: "tt-vid-data", axis: "Awareness", name: "Le chiffre qui dérange", needs: ["credibilite","douleur"],
            desc: "Tu ouvres sur une donnée brute affichée en grand, puis tu déroules.",
            beats: ["0-2s : le chiffre seul, plein écran", "Ce qu'il signifie pour ta cible", "Pourquoi personne n'en parle", "CTA : commentaire"] },
          { id: "tt-vid-reverse", axis: "Awareness", name: "Décryptage d'un exemple", needs: ["credibilite","mecanisme"],
            desc: "Tu prends un cas réel à l'écran et tu l'annotes en direct.",
            beats: ["0-2s : le cas montré + son résultat", "Tu annotes les éléments clés un par un", "Ce que la plupart auraient fait", "CTA : « enregistre »"] },
          { id: "tt-vid-comparison", axis: "Awareness", name: "Ça vs Ça", needs: ["differentiation","recontextualisation"],
            desc: "Deux approches montrées en alternance rapide. Le contraste visuel fait tout.",
            beats: ["0-2s : les deux options posées visuellement", "Alternance rapide : ce que donne chacune", "Le verdict, assumé", "CTA : « tu fais lequel ? »"] },
          { id: "tt-vid-timeline", axis: "Awareness", name: "Avant / Maintenant du marché", needs: ["recontextualisation","differentiation"],
            desc: "Tu montres ce qui a changé dans ton secteur et ce que ça implique.",
            beats: ["0-2s : le contraste temporel annoncé", "Ce qui marchait avant / ce qui marche maintenant", "Ce que la plupart continuent de faire", "CTA : la nouvelle règle"] },
          { id: "tt-vid-pain", axis: "Conversion", name: "Pain First", needs: ["douleur","mecanisme"],
            desc: "Tu ouvres direct sur la douleur du viewer.",
            beats: ["0-2s : la douleur nommée", "Pourquoi ça arrive, ce que ça coûte", "La solution en 1 phrase", "CTA : « suis » / lien en bio"] },
          { id: "tt-vid-objection", axis: "Conversion", name: "Objection Flip", needs: ["objection","credibilite"],
            desc: "Tu prends l'objection nº1 et tu la retournes en 1re seconde.",
            beats: ["0-2s : l'objection énoncée", "Le retournement : le vrai calcul", "La preuve ou l'ancrage", "CTA"] },
          { id: "tt-vid-results", axis: "Conversion", name: "Résultats prouvés", needs: ["credibilite","resultat"],
            desc: "Tu montres un résultat réel (capture, chiffre) et tu expliques comment.",
            beats: ["0-2s : le résultat choc affiché", "D'où il part (le contexte)", "Ce qui a permis ce résultat", "CTA : « suis pour la méthode »"] },
          { id: "tt-vid-transformation", axis: "Conversion", name: "Transformation rapide", needs: ["douleur","resultat"],
            desc: "Avant/après en vidéo courte. Le contraste visuel fait le travail.",
            beats: ["0-2s : l'état avant (le problème)", "La bascule (ce qui a changé)", "L'état après (le résultat visible)", "CTA + mécanisme en légende"] },
          { id: "tt-vid-inaction", axis: "Conversion", name: "Le coût d'attendre", needs: ["inaction","futur"],
            desc: "Tu chiffres ce que coûte de repousser. Pour ceux qui hésitent depuis des mois.",
            beats: ["0-2s : le coût de l'attente, chiffré", "Le calcul rapide à l'écran", "Où il en sera dans 12 mois", "CTA : l'alternative"] },
          { id: "tt-vid-mecha", axis: "Conversion", name: "Mécanisme révélé", needs: ["mecanisme","differentiation"],
            desc: "Tu nommes et expliques POURQUOI ta méthode marche.",
            beats: ["0-2s : le nom du mécanisme + sa promesse", "Ce que les approches classiques ratent", "Comment le tien s'y prend", "CTA"] },
          { id: "tt-vid-filter", axis: "Conversion", name: "C'est pour toi si / pas si", needs: ["inclusion","pvu"],
            desc: "Tu filtres explicitement. L'exclusion volontaire qualifie l'audience.",
            beats: ["0-2s : « Ce n'est pas pour tout le monde »", "C'est pour toi si… (3 critères rapides)", "Ce n'est pas pour toi si…", "CTA pour la 1re liste"] },
          { id: "tt-vid-guarantee", axis: "Conversion", name: "Renversement du risque", needs: ["garantie","objection"],
            desc: "Tu déplaces le risque de son côté vers le tien.",
            beats: ["0-2s : la peur nommée (« Et si ça marche pas ? »)", "Tu valides que le risque est légitime", "La garantie, sans astérisque", "CTA : « tu risques rien »"] },
          { id: "tt-vid-anchor", axis: "Conversion", name: "Recadrage du prix", needs: ["ancrage","objection"],
            desc: "Tu recadres la perception du prix par comparaison rapide.",
            beats: ["0-2s : le prix annoncé franchement", "La comparaison naturelle du prospect", "À quoi ça devrait se comparer", "CTA"] },
          { id: "tt-vid-testimony", axis: "Conversion", name: "Témoignage monté", needs: ["credibilite","resultat"],
            desc: "Un extrait client monté serré avec son résultat en surimpression.",
            beats: ["0-2s : le résultat en texte + la voix du client", "Son point de départ", "Ce qui a changé pour lui", "CTA vers l'offre"] },
          { id: "tt-vid-grwm", axis: "Nurture", name: "GRWM", needs: ["histoire","pvu"],
            desc: "Tu parles de ton sujet en faisant autre chose. Très naturel.",
            beats: ["0-2s : le décor + l'annonce du sujet", "Tu racontes en faisant ton activité", "Le point clé / la leçon", "CTA décontracté"] },
          { id: "tt-vid-checklist", axis: "Nurture", name: "Checklist express", needs: ["mecanisme","pvu"],
            desc: "Tu déroules une checklist à l'oral face caméra. Ultra-simple, fort en saves.",
            beats: ["0-2s : la promesse (« X choses à faire avant X »)", "Les items cochés visuellement", "Le plus inattendu gardé pour la fin", "CTA : « enregistre la liste »"] },
          { id: "tt-vid-behind", axis: "Nurture", name: "Coulisses", needs: ["histoire","storytelling"],
            desc: "Tu montres l'envers du décor d'un projet ou d'une journée.",
            beats: ["0-2s : ce qu'on va voir", "Les coulisses réelles, sans filtre", "Le moment de tension ou d'imprévu", "CTA : « la suite demain »"] },
          { id: "tt-vid-lessons", axis: "Nurture", name: "Ce que m'a appris [période]", needs: ["histoire","mecanisme"],
            desc: "Bilan en leçons rapides enchaînées.",
            beats: ["0-2s : la période + le nombre de leçons", "Chaque leçon en 3-4s max", "Celle qui t'a surpris, développée", "CTA : « enregistre »"] },
          { id: "tt-vid-tools", axis: "Nurture", name: "Ma stack / mes outils", needs: ["mecanisme"],
            desc: "Tu montres tes outils à l'écran avec le pourquoi de chaque choix.",
            beats: ["0-2s : la promesse (« ma stack pour X »)", "Chaque outil montré + pourquoi", "Le plus inattendu en dernier", "CTA : « tu utilises quoi ? »"] },
          { id: "tt-vid-qa", axis: "Nurture", name: "Réponse à un commentaire", needs: ["objection","mecanisme"],
            desc: "Tu réponds en vidéo à un commentaire reçu. Format ultra-natif TikTok.",
            beats: ["0-2s : le commentaire affiché à l'écran", "Pourquoi c'est une bonne question", "Ta réponse complète et rapide", "CTA : « pose la tienne »"] },
          { id: "tt-vid-nuance", axis: "Nurture", name: "J'ai changé d'avis", needs: ["recontextualisation","differentiation"],
            desc: "Tu reviens sur une position que tu défendais. Rare, donc fort en crédibilité.",
            beats: ["0-2s : ce que tu pensais avant, assumé", "Ce qui t'a fait douter", "Ta position actuelle", "CTA : débat en commentaire"] },
          { id: "tt-vid-celebrate", axis: "Nurture", name: "Célébration client", needs: ["credibilite","resultat"],
            desc: "Tu mets un client en lumière sans te mettre au centre.",
            beats: ["0-2s : le résultat du client, nommé", "Qui il est, d'où il vient", "Ce qu'IL a fait (le mérite lui revient)", "Zéro CTA commercial"] },
        ],
      },
      {
        id: "tt-photo", name: "Photo Mode / Carrousel",
        note: "Boosté par l'algo 2026. 5-7 slides. Swipe-through rate = signal clé. CTA sur la dernière.",
        schemas: [
          { id: "tt-photo-listicle", axis: "Awareness", name: "Listicle", needs: ["mecanisme","pvu"],
            desc: "« 5 trucs que… » — une liste, un item par slide.",
            beats: ["Slide 1 : promesse chiffrée", "1 item surprenant par slide", "Garde le meilleur pour la fin", "Dernière : « suis pour plus »"] },
          { id: "tt-photo-beforeafter", axis: "Conversion", name: "Before / After", needs: ["douleur","resultat"],
            desc: "Slide 1 pose le contraste, dernière livre le payoff.",
            beats: ["Slide 1 : l'avant (le contraste)", "Slides : la bascule / le process", "Avant-dernière : le résultat", "Dernière : payoff + CTA"] },
          { id: "tt-photo-tuto", axis: "Awareness", name: "Mini-tuto", needs: ["mecanisme"],
            desc: "Un pas-à-pas, une étape par slide.",
            beats: ["Slide 1 : la promesse", "1 étape claire par slide", "1 slide résultat", "Dernière : « enregistre »"] },
          { id: "tt-photo-hottake", axis: "Awareness", name: "Hot take / opinion", needs: ["differentiation","inclusion"],
            desc: "Une prise de position. Fait commenter, booste le reach.",
            beats: ["Slide 1 : l'opinion tranchée", "1 argument par slide", "Un point qui divise volontairement", "Dernière : « t'es d'accord ? » + CTA"] },
          { id: "tt-photo-tier", axis: "Awareness", name: "Tier list / ranking", needs: ["differentiation","pvu"],
            desc: "Tu classes des choses de ta niche. Génère du débat.",
            beats: ["Slide 1 : ce que tu classes + les critères", "Le classement révélé progressivement", "Le choix controversé qui fait réagir", "Dernière : « t'aurais mis quoi ? »"] },
          { id: "tt-photo-objections", axis: "Conversion", name: "Objections répondues", needs: ["objection","credibilite"],
            desc: "Tu listes et réponds aux vraies objections une par slide.",
            beats: ["Slide 1 : « Tu penses que… » (l'objection principale)", "1 objection par slide nommée", "La réponse convaincante + preuve", "Slide finale : CTA + garantie"] },
          { id: "tt-photo-glossaire", axis: "Nurture", name: "Glossaire / définitions", needs: ["mecanisme","pvu"],
            desc: "Tu définis les termes de ta niche à ta façon.",
            beats: ["Slide 1 : la promesse (« X termes que tu dois savoir »)", "1 terme par slide avec ta définition", "Ton angle propriétaire", "Dernière : CTA"] },
        ],
      },
    ],
  },

  // ─── FACEBOOK ─────────────────────────────────────────────────────────────
  {
    id: "facebook", name: "Facebook",
    note: "Algo favorise les contenus qui génèrent de vraies conversations (commentaires longs). Groupes = reach organique encore fort. Vidéo native performante. Audience 25-50 ans.",
    formats: [
      {
        id: "fb-text", name: "Post texte long",
        note: "Facebook récompense les textes longs qui retiennent (dwell time). Aère avec des lignes courtes. Une seule question à la fin.",
        schemas: [
          { id: "fb-text-story", axis: "Awareness", name: "Story personnelle longue", needs: ["histoire","douleur"],
            desc: "Une histoire développée avec des détails sensoriels. Facebook permet la longueur que LinkedIn tolère à peine.",
            beats: ["Hook : une scène concrète au moment de tension", "Le développement de l'histoire, les détails qui rendent réel", "La bascule / le moment décisif", "La leçon + une question ouverte au lecteur"] },
          { id: "fb-text-rant", axis: "Awareness", name: "Rant assumé", needs: ["inclusion","differentiation"],
            desc: "Tu prends position sur quelque chose qui t'énerve dans ton secteur. Fort en engagement et partages.",
            beats: ["Hook : l'énoncé de ce qui t'énerve (sans précaution oratoire)", "Pourquoi c'est un problème, les conséquences", "Ce que tu défends à la place", "CTA : « et toi ? » ou « partage si tu penses pareil »"] },
          { id: "fb-text-value", axis: "Nurture", name: "Post valeur pure", needs: ["mecanisme","pvu"],
            desc: "Tu donnes un enseignement complet sans rien vendre. Active la réciprocité.",
            beats: ["Hook : la promesse de la valeur", "L'enseignement délivré en entier, structuré", "Les exemples concrets", "CTA doux : commentaire ou question"] },
          { id: "fb-text-question", axis: "Nurture", name: "Question engageante", needs: ["douleur","objection"],
            desc: "Tu poses UNE vraie question à ta cible. Génère des commentaires et de la matière terrain.",
            beats: ["La question ouverte, précise et engageante", "Un mini-contexte (pourquoi tu demandes)", "Tu donnes ton avis pour amorcer", "Tu réponds à chaque commentaire"] },
          { id: "fb-text-testimonial", axis: "Conversion", name: "Post testimonial long", needs: ["credibilite","resultat"],
            desc: "Un témoignage détaillé raconté en profondeur. Le temps de lecture crée de la crédibilité.",
            beats: ["Hook : le résultat ou la transformation", "Le parcours complet du client", "Les détails qui rendent crédible", "Ce que ça ouvre pour le lecteur + CTA"] },
          { id: "fb-text-objection", axis: "Conversion", name: "Traitement d'objection long", needs: ["objection","ancrage"],
            desc: "Tu prends une seule objection et tu la traites à fond sur 300-500 mots.",
            beats: ["Hook : l'objection nommée frontalement", "Pourquoi elle est légitime (tu la valides)", "Le retournement complet avec preuves", "La garantie + CTA"] },
          { id: "fb-text-liste", axis: "Awareness", name: "Liste de vérités inconfortables", needs: ["differentiation","inclusion"],
            desc: "Des vérités que ta cible doit entendre. Fort en partages dans les groupes.",
            beats: ["Hook : annonce chiffrée (« 8 vérités que… »)", "Chaque vérité, une par ligne, directe", "La vérité la plus inconfortable gardée pour la fin", "Ta position + invitation à débattre"] },
          { id: "fb-text-case", axis: "Conversion", name: "Case study raconté", needs: ["credibilite","resultat","mecanisme"],
            desc: "Un parcours client raconté comme une histoire. Très fort en conversion Facebook.",
            beats: ["Hook : la transformation annoncée", "La situation initiale (douleur identifiable)", "Le processus (mécanisme expliqué)", "Le résultat détaillé + CTA"] },
        ],
      },
      {
        id: "fb-video", name: "Vidéo native",
        note: "Auto-play en muted = sous-titres obligatoires. 1-3 minutes idéal. Facebook booste les vidéos téléchargées directement.",
        schemas: [
          { id: "fb-vid-live-replay", axis: "Nurture", name: "Live replay / replay éducatif", needs: ["mecanisme","pvu"],
            desc: "Un extrait ou replay d'un live éducatif. Format très engageant sur Facebook.",
            beats: ["0-5s : hook verbal + sous-titre accrocheur", "L'enseignement délivré sans fioritures", "Un exemple ou cas concret", "CTA : commentaire + lien en bas"] },
          { id: "fb-vid-testimonial", axis: "Conversion", name: "Vidéo témoignage", needs: ["credibilite","resultat"],
            desc: "Un client qui parle face caméra. La preuve sociale la plus puissante en vidéo.",
            beats: ["0-5s : le résultat annoncé par le client", "Son point de départ (la douleur)", "Ce qui a changé", "Sa recommandation + CTA"] },
          { id: "fb-vid-story", axis: "Awareness", name: "Story vidéo personnelle", needs: ["histoire","douleur"],
            desc: "Une histoire racontée face caméra, naturelle. Très forte en proximité.",
            beats: ["0-5s : le point de tension de l'histoire", "Le récit sans détour", "La bascule / la leçon", "CTA + question"] },
          { id: "fb-vid-tuto", axis: "Nurture", name: "Tutoriel court", needs: ["mecanisme"],
            desc: "Tu montres comment faire une chose précise. Fort en sauvegardes.",
            beats: ["0-5s : la promesse du tuto", "Les étapes montrées clairement", "Le résultat obtenu", "CTA : « sauvegarde »"] },
        ],
      },
      {
        id: "fb-story", name: "Story",
        note: "Touche surtout tes followers existants. Parfait pour nourrir la relation et relayer les offres.",
        schemas: [
          { id: "fb-story-offer", axis: "Nurture", name: "Coulisses / offre", needs: ["histoire","ancrage"],
            desc: "Tu montres les coulisses ou relaies une offre à ton audience chaude.",
            beats: ["Story 1 : le contexte ou l'offre", "Le déroulé ou le bénéfice", "La preuve ou l'urgence", "CTA : swipe / lien / DM"] },
          { id: "fb-story-tip", axis: "Nurture", name: "Tip rapide", needs: ["mecanisme","pvu"],
            desc: "Un conseil actionnable en 1-2 stories. Format ultra-simple.",
            beats: ["Story 1 : le tip annoncé", "L'explication rapide", "L'exemple ou le résultat", "CTA : « réponds pour en savoir plus »"] },
          { id: "fb-story-proof", axis: "Conversion", name: "Preuve flash", needs: ["credibilite","resultat"],
            desc: "Une capture de résultat ou de témoignage mise en avant rapidement.",
            beats: ["La capture ou le résultat visible", "1 ligne de contexte", "Ce que ça signifie pour le prospect", "Lien ou CTA vers l'offre"] },
        ],
      },
    ],
  },

  // ─── YOUTUBE ──────────────────────────────────────────────────────────────
  {
    id: "youtube", name: "YouTube",
    note: "Watch time et CTR thumbnail = signaux principaux. Long format : 8-20 min idéal. Shorts : <60s, hook dans les 2 premières secondes. Titres = promesse précise + curiosité.",
    formats: [
      {
        id: "yt-long", name: "Vidéo longue (8-20 min)",
        note: "CTR thumbnail + watch time >50% = succès. Hook dans les 30 premières secondes. Intro courte (< 30s). Structure claire : promesse → développement → CTA.",
        schemas: [
          { id: "yt-long-tuto", axis: "Awareness", name: "Tutoriel complet", needs: ["mecanisme","pvu"],
            desc: "Tu enseignes une compétence complète de A à Z. Le format le plus recherché sur YouTube.",
            beats: ["Hook : le résultat qu'ils obtiendront (30s max)", "L'aperçu du plan (ce qu'on va couvrir)", "Le tutoriel step by step avec exemples visuels", "Résumé + CTA abonnement + prochain épisode"] },
          { id: "yt-long-casestudy", axis: "Conversion", name: "Case study détaillé", needs: ["credibilite","resultat","mecanisme"],
            desc: "Tu analyses un succès ou un échec réel en profondeur. Fort en autorité et conversions.",
            beats: ["Hook : le résultat ou l'échec annoncé (accroche choc)", "Le contexte complet + les enjeux", "L'analyse step by step (ce qui s'est passé vraiment)", "Les leçons actionnables + CTA vers l'offre"] },
          { id: "yt-long-story", axis: "Awareness", name: "Mon histoire / Parcours", needs: ["histoire","douleur","resultat"],
            desc: "Tu racontes ton parcours complet. Le format qui construit le plus la connexion.",
            beats: ["Hook : le résultat final ou le moment décisif", "Les débuts difficiles (douleur identifiable)", "Les erreurs, les bascules, les apprentissages", "Où tu en es aujourd'hui + leçon + CTA"] },
          { id: "yt-long-comparison", axis: "Awareness", name: "Comparatif approfondi", needs: ["differentiation","mecanisme"],
            desc: "Tu compares plusieurs solutions/approches. Très cherché, fort en durée de vue.",
            beats: ["Hook : le critère de comparaison annoncé", "Les options présentées avec équité", "L'analyse critique de chacune", "Ton verdict + pour qui chaque option + CTA"] },
          { id: "yt-long-objections", axis: "Conversion", name: "FAQ / Objections répondues", needs: ["objection","credibilite"],
            desc: "Tu traites les vraies questions et objections de ta cible en profondeur.",
            beats: ["Hook : la question centrale (la plus fréquente)", "Les X objections/questions traitées une par une", "Réponse honnête à chaque fois (y compris les inconfortables)", "CTA + abonnement"] },
          { id: "yt-long-framework", axis: "Nurture", name: "Ma méthode complète", needs: ["mecanisme","pvu","differentiation"],
            desc: "Tu livres ta méthode propriétaire en profondeur. L'autorité la plus durable sur YouTube.",
            beats: ["Hook : le résultat que la méthode permet", "Contexte : pourquoi cette méthode et pas une autre", "Chaque étape détaillée avec exemples", "Comment commencer maintenant + CTA"] },
          { id: "yt-long-reaction", axis: "Awareness", name: "Réaction / Analyse de contenu", needs: ["differentiation","inclusion"],
            desc: "Tu analyses un contenu viral ou une tendance. Emprunte le reach, ajoute ta valeur.",
            beats: ["Hook : ce sur quoi tu réagis + pourquoi ça compte", "L'extrait ou la tendance analysée", "Ton analyse et ton angle différent", "Ce qu'il faut retenir + CTA"] },
          { id: "yt-long-documentary", axis: "Nurture", name: "Mini-documentaire", needs: ["histoire","storytelling","credibilite"],
            desc: "Un format narratif sur un sujet de ta niche. Fort en watch time et abonnements.",
            beats: ["Hook : la question centrale ou la tension narrative", "L'exploration du sujet (interviews, données, terrain)", "Les révélations / tournants narratifs", "La conclusion + ton point de vue + CTA"] },
        ],
      },
      {
        id: "yt-short", name: "YouTube Short",
        note: "Vertical, <60s. Hook dans les 2 premières secondes. Pas de coupures ou de temps morts. CTA en dernier plan.",
        schemas: [
          { id: "yt-short-tip", axis: "Awareness", name: "Tip express", needs: ["mecanisme","pvu"],
            desc: "Un conseil actionnable en moins de 60 secondes.",
            beats: ["0-2s : la promesse du tip", "Le tip livré rapidement et clairement", "Un exemple concret", "CTA : « abonne-toi pour plus »"] },
          { id: "yt-short-mistake", axis: "Awareness", name: "Erreur commune", needs: ["objection","mecanisme"],
            desc: "« Arrête de… » — tu pointes l'erreur et tu corriges en moins d'une minute.",
            beats: ["0-2s : l'erreur annoncée", "Pourquoi c'est contre-productif", "Ce qu'il faut faire à la place", "CTA rapide"] },
          { id: "yt-short-hook", axis: "Conversion", name: "Teaser / Hook vers longue vidéo", needs: ["douleur","resultat"],
            desc: "Tu extrais le moment le plus fort d'une longue vidéo pour attirer vers elle.",
            beats: ["0-2s : le moment le plus accrocheur extrait", "Le contexte minimal", "La révélation ou le résultat", "CTA : « regarde la vidéo complète »"] },
          { id: "yt-short-results", axis: "Conversion", name: "Résultat en 60s", needs: ["credibilite","resultat"],
            desc: "Tu montres un résultat réel et expliques le pourquoi rapidement.",
            beats: ["0-2s : le résultat choc affiché", "D'où ça vient", "Ce qui l'a permis", "CTA : « comment faire pareil »"] },
          { id: "yt-short-opinion", axis: "Awareness", name: "Opinion tranchée", needs: ["differentiation","inclusion"],
            desc: "Une prise de position en moins d'une minute. Fort en commentaires.",
            beats: ["0-2s : l'opinion annoncée directement", "Les 2-3 arguments clés rapides", "Le point le plus controversé", "CTA : « t'es d'accord ? »"] },
          { id: "yt-short-story", axis: "Nurture", name: "Mini-story 60s", needs: ["histoire","douleur"],
            desc: "Une histoire complète avec tension et résolution en moins d'une minute.",
            beats: ["0-2s : le point de tension annoncé", "Le récit ultra-condensé", "La résolution / la leçon", "CTA doux"] },
        ],
      },
      {
        id: "yt-community", name: "Post Communauté",
        note: "Touche uniquement les abonnés. Parfait pour engagement, sondages et teasers. Texte, images ou sondages.",
        schemas: [
          { id: "yt-com-poll", axis: "Nurture", name: "Sondage d'audience", needs: ["douleur","objection"],
            desc: "Tu sonds tes abonnés sur leurs vrais blocages ou désirs.",
            beats: ["La question directe sur un sujet de ta niche", "2-4 options tranchées et pertinentes", "Ton avis en commentaire épinglé", "Annonce que tu feras une vidéo sur le résultat"] },
          { id: "yt-com-teaser", axis: "Conversion", name: "Teaser de vidéo", needs: ["mecanisme","resultat"],
            desc: "Tu annonces ta prochaine vidéo avec assez de curiosité pour activer la cloche.",
            beats: ["Ce qui arrive dans la prochaine vidéo (la promesse)", "Pourquoi c'est important maintenant", "Un aperçu ou une info exclusive", "CTA : « active la cloche »"] },
          { id: "yt-com-exclusive", axis: "Nurture", name: "Contenu exclusif abonnés", needs: ["credibilite","pvu"],
            desc: "Tu partages une info, ressource ou update réservée à ta communauté.",
            beats: ["Le contenu exclusif livré directement", "Pourquoi tu le partages avec eux en premier", "La valeur concrète pour eux", "Invitation à commenter / demander plus"] },
        ],
      },
    ],
  },

  // ─── EMAIL ────────────────────────────────────────────────────────────────
  {
    id: "email", name: "Email",
    note: "Pas d'algo : la structure fait tout. 1 email = 1 objectif. Objet = valeur ou curiosité. CTA unique et à faible friction.",
    formats: [
      {
        id: "em-sales", name: "Email de vente",
        note: "Objectif : convertir. Un seul CTA, clair. Ancrage et garantie proches du CTA. La douleur avant l'offre.",
        schemas: [
          { id: "em-sales-pastor", axis: "Conversion", name: "PASTOR", needs: ["douleur","histoire","credibilite","mecanisme","garantie"],
            desc: "Problem → Amplify → Story → Testimonial → Offer → Response. Le framework de vente le plus complet.",
            beats: ["Problem : le problème du lecteur, nommé", "Amplify : ce qui se passe si rien ne change", "Story : une histoire courte et relatable", "Testimonial : une preuve, un résultat", "Offer : ta solution présentée clairement", "Response : CTA unique et direct"] },
          { id: "em-sales-aida", axis: "Conversion", name: "AIDA email", needs: ["douleur","mecanisme","ancrage"],
            desc: "Attention → Intérêt → Désir → Action. Le workhorse des lancements et promos.",
            beats: ["Objet + 1re ligne : l'attention (le hook)", "Intérêt : le problème du lecteur", "Désir : bénéfices, preuves, projection", "Action : CTA unique, faible friction"] },
          { id: "em-sales-hardthing", axis: "Conversion", name: "« Hard Thing »", needs: ["douleur","objection","mecanisme"],
            desc: "Tu nommes le vrai « dur » du sujet, pas l'apparent. Très efficace en B2B.",
            beats: ["Objet : « Le plus dur avec [le sujet] »", "Ouvre en nommant le vrai problème", "Agite avec les solutions déjà tentées qui échouent", "Introduis le concept de solution", "CTA léger vers la suite"] },
          { id: "em-sales-pain-drive", axis: "Conversion", name: "Pain-Driven", needs: ["douleur","inaction","mecanisme"],
            desc: "Tu consacres l'essentiel à faire ressentir le problème avant de proposer.",
            beats: ["Objet : la douleur ou sa conséquence", "Tu ouvres et amplifies le problème", "Tu actualises la douleur (présent, futur)", "Bascule courte vers la solution + CTA"] },
          { id: "em-sales-psy", axis: "Conversion", name: "Bénéfice identitaire", needs: ["inclusion","pvu","ancrage","plaisir"],
            desc: "Tu vends non pas le produit mais l'identité que l'achat confère. Pour les offres premium.",
            beats: ["Objet : une phrase sur qui tu deviens (pas ce que tu achètes)", "Le portrait de la personne qui fait ce choix", "Ce que ça dit d'eux", "L'offre présentée comme un choix identitaire + CTA"] },
          { id: "em-sales-scarcity", axis: "Conversion", name: "Urgence / rareté légitime", needs: ["garantie","ancrage","credibilite"],
            desc: "Tu crées une raison légitime d'agir maintenant. La rareté doit être réelle.",
            beats: ["Objet : la deadline ou la limite (spécifique)", "Ce qui se ferme / disparaît / change", "Ce qu'ils perdent concrètement s'ils attendent", "CTA direct + lien de garantie visible"] },
          { id: "em-sales-objection", axis: "Conversion", name: "Anti-objection", needs: ["objection","credibilite","garantie"],
            desc: "Tu traites UNE objection en profondeur pour débloquer les hésitants.",
            beats: ["Objet : l'objection posée comme question", "Tu l'énonces franchement (sans détour)", "Tu la traites au bon niveau", "Preuve + garantie + CTA"] },
          { id: "em-sales-storytelling", axis: "Conversion", name: "Narratif de vente", needs: ["histoire","douleur","resultat"],
            desc: "Une histoire complète qui mène naturellement vers l'offre sans forcer.",
            beats: ["Objet : l'accroche narrative", "L'histoire racontée (avec tension)", "Le moment de bascule", "La connexion naturelle vers l'offre + CTA"] },
          { id: "em-sales-filter", axis: "Conversion", name: "C'est pour toi si / pas si", needs: ["inclusion","pvu"],
            desc: "Tu filtres explicitement qui doit acheter. L'exclusion volontaire augmente la conversion des bons profils.",
            beats: ["Objet : « Ce n'est probablement pas pour toi »", "C'est pour toi si… (3-4 critères précis)", "Ce n'est pas pour toi si… (assume de repousser)", "Si tu es dans la 1re liste : CTA"] },
          { id: "em-sales-offer", axis: "Conversion", name: "Offre décomposée", needs: ["pvu","garantie","ancrage"],
            desc: "Tu déballes exactement ce que contient l'offre, sans storytelling. Pour une liste déjà chaude en fin de lancement.",
            beats: ["Objet : ce que c'est, en une phrase", "Ce qu'il y a dedans, point par point", "Le prix + l'ancrage + la garantie", "La deadline ou la limite + CTA direct"] },
          { id: "em-sales-inaction", axis: "Conversion", name: "Coût de l'inaction", needs: ["inaction","futur"],
            desc: "Tu ne vends pas ta solution : tu chiffres ce que coûte de ne rien faire. Pour ceux qui repoussent depuis des mois.",
            beats: ["Objet : le coût de l'attente, chiffré ou daté", "Le calcul détaillé (temps, argent, opportunités)", "La projection : où il en sera dans 12 mois", "L'alternative + CTA"] },
          { id: "em-sales-proof", axis: "Conversion", name: "Empilement de preuves", needs: ["credibilite","resultat"],
            desc: "L'email entier est une accumulation de preuves. La masse fait l'argument, pas un seul cas.",
            beats: ["Objet : la promesse mise en doute (« Tu me crois pas ? »)", "Les preuves enchaînées : captures, chiffres, verbatims", "Les plus fortes en fin de liste", "Le seul commentaire que tu ajoutes + CTA"] },
        ],
      },
      {
        id: "em-nurture", name: "Email nurture",
        note: "Objectif : construire la relation et la confiance. Value-first. Le CTA peut être un simple « réponds-moi ».",
        schemas: [
          { id: "em-nurt-story", axis: "Nurture", name: "Story → Value", needs: ["histoire","mecanisme"],
            desc: "Une histoire courte + un enseignement. Construit la relation sans vendre.",
            beats: ["Objet : curiosité ou bénéfice", "Une histoire courte (perso ou client)", "L'enseignement qu'on en tire", "Micro-CTA : répondre, cliquer, lire la suite"] },
          { id: "em-nurt-objection", axis: "Nurture", name: "1 email = 1 objection", needs: ["objection","credibilite"],
            desc: "Tu prends une seule objection et tu la traites à fond, sans pitch.",
            beats: ["Objet : l'objection sous forme de question", "Nomme l'objection ouvertement", "Traite-la au bon niveau", "Preuve ou garantie + CTA doux"] },
          { id: "em-nurt-crystal", axis: "Nurture", name: "Boule de cristal", needs: ["futur","resultat","pvu"],
            desc: "Tu fais visualiser la vie « après ». Actualise le futur dans le présent.",
            beats: ["Objet : une promesse de futur", "Projette le lecteur dans sa vie après (scènes sensorielles)", "Le premier geste, les premières victoires", "Relie au produit + CTA"] },
          { id: "em-nurt-value", axis: "Nurture", name: "Pure valeur", needs: ["mecanisme","pvu"],
            desc: "Tu donnes un enseignement complet sans rien vendre. Active la réciprocité.",
            beats: ["Objet : le bénéfice de ce que tu offres", "L'enseignement livré en entier, actionnable", "Un exemple concret", "Micro-CTA doux"] },
          { id: "em-nurt-behind", axis: "Nurture", name: "Behind the scenes", needs: ["histoire","storytelling"],
            desc: "Tu montres les coulisses de ton travail. Crée de la proximité et de la confiance.",
            beats: ["Objet : une coulisse intrigante", "Ce que tu construis / as décidé / as raté", "Pourquoi tu le partages (transparence)", "Micro-CTA : répondre ou suivre la suite"] },
          { id: "em-nurt-preuve", axis: "Nurture", name: "Preuve sociale narrative", needs: ["credibilite","resultat","histoire"],
            desc: "Un résultat client raconté comme une histoire, sans appel à l'achat.",
            beats: ["Objet : le résultat du client (accroche)", "Son point de départ (identifiable)", "Ce qui a changé (mécanisme mentionné)", "La morale + micro-CTA doux"] },
          { id: "em-nurt-lessons", axis: "Nurture", name: "Ce que m'a appris [période]", needs: ["histoire","mecanisme"],
            desc: "Bilan d'une période en leçons numérotées. Plusieurs apprentissages, pas un seul échec.",
            beats: ["Objet : la période + le nombre de leçons", "Chaque leçon en 2-3 lignes, concrète", "Celle qui t'a le plus surpris, développée", "Ce que tu fais différemment + micro-CTA"] },
          { id: "em-nurt-resources", axis: "Nurture", name: "Ressources / stack", needs: ["mecanisme"],
            desc: "Tu partages tes outils, livres ou ressources avec le pourquoi de chaque choix.",
            beats: ["Objet : la promesse (« ma stack complète pour X »)", "Chaque ressource + pourquoi tu l'utilises", "Celle que personne ne cite", "CTA : « tu utilises quoi ? »"] },
          { id: "em-nurt-process", axis: "Nurture", name: "Mon process interne", needs: ["mecanisme","differentiation"],
            desc: "Tu montres comment tu travailles concrètement. Transparence qui crée la confiance avant l'achat.",
            beats: ["Objet : ce que tu vas montrer (« Comment je livre un X en Y jours »)", "Le déroulé réel, avec les durées", "Ce que tu refuses de faire et pourquoi", "Invitation à questionner"] },
          { id: "em-nurt-nuance", axis: "Nurture", name: "J'ai changé d'avis", needs: ["recontextualisation","differentiation"],
            desc: "Tu reviens sur une position que tu défendais. Rare, donc très fort en crédibilité.",
            beats: ["Objet : ce que tu pensais avant, assumé", "Ce qui t'a fait douter (fait précis)", "Ta position actuelle, nuancée", "Ce que ça implique + micro-CTA"] },
          { id: "em-nurt-qa", axis: "Nurture", name: "Réponse à une question reçue", needs: ["objection","mecanisme"],
            desc: "Tu réponds à une question posée par un abonné. Prouve que tu lis et sert tous ceux qui se la posaient.",
            beats: ["Objet : la question, citée telle quelle", "Pourquoi c'est une bonne question", "Ta réponse complète et honnête", "CTA : « d'autres questions ? »"] },
          { id: "em-nurt-mistake", axis: "Nurture", name: "Erreur décortiquée", needs: ["objection","mecanisme"],
            desc: "UNE erreur analysée en profondeur : pourquoi on la fait, ce qu'elle coûte, comment l'éviter.",
            beats: ["Objet : l'erreur nommée sans détour", "Pourquoi c'est tentant de la faire (tu ne juges pas)", "Ce qu'elle coûte vraiment", "La correction précise + comment vérifier"] },
        ],
      },
      {
        id: "em-sequence", name: "Séquence automatisée",
        note: "Plusieurs emails enchaînés selon un objectif. Chaque email = un angle différent.",
        schemas: [
          { id: "em-seq-welcome", axis: "Nurture", name: "Welcome (3-5 emails)", needs: ["histoire","mecanisme","credibilite"],
            desc: "Séquence de bienvenue qui pose la relation et délivre de la valeur tôt.",
            beats: ["Email 1 : accueil + livraison valeur promise + qui tu es", "Email 2 : ton histoire d'origine (pourquoi tu fais ça)", "Email 3 : un enseignement à forte valeur", "Email 4 : preuve sociale / résultats clients", "Email 5 : première invitation douce vers l'offre"] },
          { id: "em-seq-launch", axis: "Conversion", name: "Séquence de lancement", needs: ["douleur","mecanisme","credibilite","ancrage","garantie"],
            desc: "Enchaînement qui monte vers une offre : problème → solution → preuve → urgence.",
            beats: ["Email 1 : le problème + une histoire (pas encore l'offre)", "Email 2 : la solution + le mécanisme nommé", "Email 3 : preuves, témoignages, case study", "Email 4 : l'offre complète + ancrage + garantie", "Email 5 : urgence / dernière chance"] },
          { id: "em-seq-reengage", axis: "Nurture", name: "Re-engagement (froids)", needs: ["douleur","pvu"],
            desc: "Réveiller les contacts inactifs.",
            beats: ["Objet : pattern interrupt", "Tu nommes le silence, sans reproche", "Tu redonnes une raison de rester (valeur ou question)", "CTA binaire : rester ou partir"] },
          { id: "em-seq-abandon", axis: "Conversion", name: "Relance abandon", needs: ["objection","garantie","ancrage"],
            desc: "Relancer un panier ou une inscription non finalisée.",
            beats: ["Objet : rappel + bénéfice", "Tu rappelles ce qu'il allait obtenir", "Tu lèves l'objection probable", "CTA direct pour finaliser"] },
          { id: "em-seq-objections", axis: "Conversion", name: "Séquence anti-objections", needs: ["objection","credibilite","garantie"],
            desc: "Une série d'emails, un par objection majeure. Débloque les hésitants sur une semaine.",
            beats: ["Email 1 : l'objection la plus fréquente traitée", "Email 2 : l'objection prix + ancrage", "Email 3 : l'objection confiance + preuves", "Email 4 : l'objection timing + urgence", "Email 5 : dernière chance + garantie totale"] },
          { id: "em-seq-ascension", axis: "Conversion", name: "Séquence d'ascension", needs: ["resultat","mecanisme","ancrage"],
            desc: "Tu montes un client existant vers une offre supérieure.",
            beats: ["Email 1 : célèbre leur résultat actuel", "Email 2 : l'étape suivante (ce qu'ils pourraient atteindre)", "Email 3 : le gap entre où ils sont et où ils pourraient être", "Email 4 : l'offre supérieure présentée + ancrage", "Email 5 : CTA direct + garantie"] },
        ],
      },
      {
        id: "em-cold", name: "Email cold outreach",
        note: "1 seul objectif : un rendez-vous, pas une vente. Court. Centré sur EUX, pas sur toi. Pas de pitch produit en email 1.",
        schemas: [
          { id: "em-cold-pain", axis: "Conversion", name: "Cold Pain-first", needs: ["douleur","credibilite"],
            desc: "Tu ouvres sur leur douleur spécifique (personnalisé). Le cold le plus efficace.",
            beats: ["Objet : leur situation ou leur problème (pas ton nom)", "Tu nommes leur douleur avec précision (recherche en amont)", "Tu mentionnes UN résultat obtenu pour quelqu'un de similaire", "CTA ultra-faible : 15 minutes ou une question"] },
          { id: "em-cold-compliment", axis: "Nurture", name: "Cold compliment-genuine", needs: ["credibilite","pvu"],
            desc: "Un compliment sincère et précis sur leur travail, puis la connexion naturelle.",
            beats: ["Objet : leur prénom + quelque chose de spécifique à eux", "Le compliment sincère et précis (pas générique)", "La connexion naturelle avec ce que tu fais", "CTA minimal : une question, pas un pitch"] },
          { id: "em-cold-result", axis: "Conversion", name: "Cold résultat similaire", needs: ["credibilite","resultat","mecanisme"],
            desc: "Tu montres un résultat obtenu pour quelqu'un comme eux, sans pitcher.",
            beats: ["Objet : le résultat obtenu (spécifique + crédible)", "La situation de départ du client similaire", "Ce qui a permis ce résultat (bref)", "CTA : « est-ce que c'est un sujet pour vous ? »"] },
        ],
      },
    ],
  },
];

const AXIS_ORDER = ["Conversion", "Awareness", "Nurture"];
const platformById = (id) => PLATFORMS.find((p) => p.id === id);
const formatById = (pid, fid) => (platformById(pid)?.formats || []).find((f) => f.id === fid);
const schemaById = (pid, fid, sid) => (formatById(pid, fid)?.schemas || []).find((s) => s.id === sid);

// Rassemble la data remplie pour une liste de codes chapitres, pour un avatar donné (ou null).
function gatherChapterData(data, codes, avId) {
  const blocks = [];
  codes.forEach((code) => {
    const s = stepByCode(code);
    if (!s || !s.fields.length) return;
    const collect = (slot, label) => {
      const lines = [];
      s.fields.forEach((f) => {
        if (f.repeat) {
          const it = ((slot.lists || {})[f.k] || []).filter((x) => x && x.trim());
          if (it.length) lines.push(`  ${f.label} :`, ...it.map((x) => `    - ${x.trim()}`));
        } else {
          const v = ((slot.notes || {})[f.k] || "").trim();
          if (v) lines.push(`  ${f.label} : ${v}`);
        }
      });
      if (lines.length) blocks.push(`[${s.code} — ${s.title}${label ? ` · ${label}` : ""}]`, ...lines, "");
    };
    if (s.badge === "avatar") {
      const slot = avId ? ((data.avatar[code] || {})[avId] || emptySlot()) : null;
      if (slot) collect(slot, "");
    } else if (s.badge === "fixed") {
      collect(data.fixed[code] || emptySlot(), "");
    } else if (s.badge === "multi") {
      (data.multi[code] || []).forEach((p) => collect(p, p.label));
    }
  });
  return blocks.join("\n");
}

// Compte combien de chapitres "uses" ont de la data remplie (pour la jauge de préparation).
function schemaReadiness(data, schema, avId) {
  const codes = schema.uses || [];
  const needs = schema.needs || [];
  let filled = 0, total = 0;
  // uses (chapitres directs)
  codes.forEach((code) => {
    const s = stepByCode(code);
    if (!s) return;
    total++;
    const slots = [];
    if (s.badge === "avatar" && avId) slots.push((data.avatar[code] || {})[avId]);
    else if (s.badge === "fixed") slots.push(data.fixed[code]);
    else if (s.badge === "multi") (data.multi[code] || []).forEach((p) => slots.push(p));
    if (slots.some((sl) => sl && slotHasContent(sl))) filled++;
  });
  // needs (ingrédients)
  needs.forEach((type) => {
    total++;
    if (extractIngredient(data, type, avId).length > 0) filled++;
  });
  return { filled, total };
}


// ─── FORMULE STRIKE — données ─────────────────────────────────────────────
const STRIKE_CATEGORIES = [
  {
    id: "douleur",
    label: "Douleur / Problème",
    color: "#C0392B",
    colorBg: "#FDF2F0",
    icon: "⚡",
    funnel: ["Découverte (cold)"],
    usages: [
      { label: "Hook vidéo (3 premières secondes)", ok: true },
      { label: "Headline landing page", ok: true },
      { label: "1ère ligne post LinkedIn / Facebook", ok: true },
      { label: "Objet d'email froid", ok: true },
      { label: "Accroche pub Meta / Google (titre)", ok: true },
      { label: "Email nurture (liste déjà engagée)", ok: false, reason: "Résonne faux — ils te connaissent déjà" },
      { label: "Milieu ou bas de funnel", ok: false, reason: "La douleur sans contexte de confiance repousse" },
    ],
    tip: "Attaque en premier quand le prospect ne te connaît pas encore. La douleur capte l'attention parce qu'elle nomme ce que la personne ressent déjà. Ne l'utilise pas si le prospect est déjà dans ta liste ou a déjà acheté — ça sonne comme si tu ne le connaissais pas.",
    formulas: [
      { id: "d1", text: "Vous en avez assez de {problème} ? Commencez avec {solution} dès maintenant !", vars: ["problème", "solution"], example: "Vous en avez assez de passer tout votre temps à gérer vos publicités ? Déléguez à AdsBack dès maintenant." },
      { id: "d2", text: "Vous êtes fatigué de {anxiété}, mais vous ne souhaitez pas {solution classique}. Il est temps de rencontrer {solution}.", vars: ["anxiété", "solution classique", "solution"], example: "Vous en avez assez de perdre vos Airpods mais vous ne souhaitez pas des écouteurs filaires ? Découvrez Eartraps." },
      { id: "d3", text: "Combien de temps allez-vous supporter {douleur} ?", vars: ["douleur"], example: "Combien de temps allez-vous supporter vos chemises froissées ?" },
      { id: "d4", text: "Arrêtez de {résultat indésirable}", vars: ["résultat indésirable"], example: "Arrêtez de faire des publicités qui ne fonctionnent pas." },
      { id: "d5", text: "Arrêtez de gaspiller {temps/argent} pour {résultat indésirable}", vars: ["temps/argent", "résultat indésirable"], example: "Arrêtez de gaspiller votre budget publicitaire pour des leads peu qualifiés." },
      { id: "d6", text: "{Audience} : il est temps d'arrêter le {problème}. Utilisez la {Solution}.", vars: ["Audience", "problème", "Solution"], example: "Entrepreneurs : il est temps d'arrêter la comptabilité. Utilisez notre outil." },
      { id: "d7", text: "Vous {comportement indésirable} ? C'est fini avec {entreprise}", vars: ["comportement indésirable", "entreprise"], example: "Vous continuez de créer des landing pages à partir de 0 ? C'est fini avec lander.io" },
      { id: "d8", text: "Le {problème} ne devrait pas être si difficile.", vars: ["problème"], example: "Déléguer vos publicités ne devrait pas être si difficile." },
      { id: "d9", text: "Vous {verbe lié à l'émotion} {douleur 1} or {douleur 2} ?", vars: ["verbe lié à l'émotion", "douleur 1", "douleur 2"], example: "Vous vous sentez fatigué ou surmené ?" },
      { id: "d10", text: "{Supprimez la douleur} {manière inattendue}.", vars: ["Supprimez la douleur", "manière inattendue"], example: "Arrêtez de perdre du temps à faire votre comptabilité, grâce à cet assistant virtuel." },
      { id: "d11", text: "Dites adieu à {problème} avec {solution}", vars: ["problème", "solution"], example: "Dites adieu à vos impayés avec Assureo." },
      { id: "d12", text: "Il est temps de reprendre le contrôle de {catégorie de produit}", vars: ["catégorie de produit"], example: "Il est temps de reprendre le contrôle de vos publicités." },
    ],
  },
  {
    id: "resultat",
    label: "Résultat / Promesse",
    color: "#1A7A4A",
    colorBg: "#F0FAF4",
    icon: "🎯",
    funnel: ["Considération", "Conversion", "Nurture"],
    usages: [
      { label: "Hero section landing page (H1)", ok: true },
      { label: "Bouton CTA", ok: true },
      { label: "Objet d'email chaud (liste engagée)", ok: true },
      { label: "Description pub Google Search", ok: true },
      { label: "Bio Instagram / LinkedIn", ok: true },
      { label: "Cold outreach froid", ok: false, reason: "La promesse sans douleur préalable sonne creux — le prospect n'est pas encore chaud" },
    ],
    tip: "Utilise ces formules quand l'intention est déjà là — le prospect sait qu'il a un problème et cherche activement une solution. En cold outreach, commence d'abord par la douleur, puis ramène la promesse.",
    formulas: [
      { id: "r1", text: "Obtenez {résultat} comme {autorité} - sans {douleur}", vars: ["résultat", "autorité", "douleur"], example: "Obtenez un logo unique comme Nike - sans dépenser 50 000€." },
      { id: "r2", text: "{Résultat ambitieux} en {période} ou {promesse}.", vars: ["Résultat ambitieux", "période", "promesse"], example: "Doublez votre nombre de prospects en 15 jours ou nous vous remboursons l'intégralité." },
      { id: "r3", text: "{Verbe d'action} enfin des {résultats}.", vars: ["Verbe d'action", "résultats"], example: "Écrivez enfin des titres vraiment percutants." },
      { id: "r4", text: "Obtenez {résultat} ou {garantie}.", vars: ["résultat", "garantie"], example: "Obtenez 2x plus de ventes ou nous vous remboursons l'intégralité." },
      { id: "r5", text: "Maîtrisez l'art du {résultat souhaité} en seulement {période}.", vars: ["résultat souhaité", "période"], example: "Maîtriser l'art du copywriting en seulement 2 semaines." },
      { id: "r6", text: "Comment {résultat souhaité} sans {contrainte} ?", vars: ["résultat souhaité", "contrainte"], example: "Comment on-boarder parfaitement vos employés - sans perdre une seule minute ?" },
      { id: "r7", text: "Comment {Résultat souhaité} tout en {bénéfice} ?", vars: ["Résultat souhaité", "bénéfice"], example: "Comment générer des leads qualifiés en automatique tout en dormant ?" },
      { id: "r8", text: "Comment transformer votre {produit} en {résultat} ?", vars: ["produit", "résultat"], example: "Comment transformer votre Google Ads en véritable machine à leads ?" },
      { id: "r9", text: "Comment {résultat ambitieux} et {résultat inattendu} ?", vars: ["résultat ambitieux", "résultat inattendu"], example: "Comment obtenir des leads qualifiés et ne plus vous préoccuper de votre prospection." },
      { id: "r10", text: "Obtenez plus de {résultat} avec {catégorie de produit}.", vars: ["résultat", "catégorie de produit"], example: "Obtenez plus de leads qualifiés avec notre agence Google Ads." },
      { id: "r11", text: "Économisez {temps/argent} en {solution}.", vars: ["temps/argent", "solution"], example: "Économisez un temps précieux en déléguant vos ads à nos experts." },
      { id: "r12", text: "Contruisez un {produit désiré} dont vous pouvez être fier.", vars: ["produit désiré"], example: "Construisez une newsletter dont vous pouvez être fier." },
    ],
  },
  {
    id: "audience",
    label: "Audience ciblée",
    color: "#1A5C9A",
    colorBg: "#EEF5FC",
    icon: "🎯",
    funnel: ["Découverte (cold)"],
    usages: [
      { label: "Pub Meta (headline)", ok: true, reason: "L'algo cible, mais la formule double-filtre et booste le CTR" },
      { label: "Post organique communauté niche", ok: true },
      { label: "Objet d'email segmenté", ok: true },
      { label: "Titre de webinaire / lead magnet", ok: true },
      { label: "Audience mixte non segmentée", ok: false, reason: "Trop restrictif — les autres se sentent exclus et ignorent le message" },
    ],
    tip: "Mettre le nom de la cible en premier crée une identification immédiate (\"c'est pour moi\"). Très efficace quand ton audience est homogène. Sur une audience mixte, cette approche coupe la moitié des lecteurs dès le premier mot.",
    formulas: [
      { id: "a1", text: "Pour {Audience} qui ne se contenteront pas moins d'un {résultat}.", vars: ["Audience", "résultat"], example: "Pour tous les CEO qui ne se contenteront pas moins de publicités parfaites." },
      { id: "a2", text: "{Audience} : {résultat indésirable} ?", vars: ["Audience", "résultat indésirable"], example: "Freelances : vous avez du mal à trouver vos clients ?" },
      { id: "a3", text: "{Audience} : il est temps d'arrêter le {problème}. Utilisez la {Solution}.", vars: ["Audience", "problème", "Solution"], example: "Entrepreneurs : il est temps d'arrêter la comptabilité. Utilisez notre outil." },
      { id: "a4", text: "Le meilleur moyen pour les {audience} d'obtenir {résultat}.", vars: ["audience", "résultat"], example: "Le meilleur moyen pour les PME de générer des prospects qualifiés." },
      { id: "a5", text: "La {solution en quelques mots} pour {audience}.", vars: ["solution en quelques mots", "audience"], example: "La plateforme RH all-in-one pour les PME." },
      { id: "a6", text: "{Catégorie} {Superlatif} Pour {Audience}.", vars: ["Catégorie", "Superlatif", "Audience"], example: "L'agence la plus performante pour les start-up." },
      { id: "a7", text: "Vous n'avez pas besoin d'être {autorité} pour {résultat}.", vars: ["autorité", "résultat"], example: "Vous n'avez pas besoin d'être Uber pour avoir de bonnes publicités." },
      { id: "a8", text: "Vous avez du mal à obtenir un {résultat} ? Découvrez pourquoi {Nombre} {autorité} nous ont rejoint {période}", vars: ["résultat", "Nombre", "autorité", "période"], example: "Vous avez du mal à mener des campagnes Google Ads rentables ? Découvrez pourquoi ces 3 grands groupes nous ont délégué leurs ads." },
    ],
  },
  {
    id: "autorite",
    label: "Autorité / Preuve sociale",
    color: "#7A5C1A",
    colorBg: "#FDF8EE",
    icon: "🏆",
    funnel: ["Considération", "Décision", "Nurture"],
    usages: [
      { label: "Section \"Ils nous font confiance\" (landing)", ok: true },
      { label: "Email de nurture séquence J3–J7", ok: true },
      { label: "Pub retargeting (audiences chaudes)", ok: true },
      { label: "Stories Instagram avec chiffre clé", ok: true },
      { label: "Testimonial headline", ok: true },
      { label: "Première impression cold", ok: false, reason: "Avant d'avoir capté l'attention, la preuve sociale ne sert à rien — le prospect ne s'intéresse pas encore à toi" },
    ],
    tip: "La preuve sociale convertit ceux qui hésitent, pas ceux qui ne te connaissent pas encore. En cold, utilise d'abord la douleur ou l'audience pour capter l'attention — la preuve vient confirmer en milieu de funnel.",
    formulas: [
      { id: "au1", text: "Le {nombre} de {autorités} ont approuvé {solution}.", vars: ["nombre", "autorités", "solution"], example: "98% des dentistes ont approuvé notre nouvelle brosse à dent électrique." },
      { id: "au2", text: "{Période}, {nombre} {autorité} ont utilisé notre {solution} pour {résultat}.", vars: ["Période", "nombre", "autorité", "solution", "résultat"], example: "Cette année, 40+ start-ups ont travaillé avec AdsBack pour obtenir plus de prospects via Google Ads." },
      { id: "au3", text: "Quand {autorité et autorité} ont eu besoin de {solution}, ils nous ont appelé.", vars: ["autorité et autorité", "solution"], example: "Quand Uber et SpaceX ont eu besoin de copywriter leurs pages, ils nous ont appelé." },
      { id: "au4", text: "{Statistiques} {Audience} {Résultat indésirable} : Êtes-vous l'une d'entre elle ?", vars: ["Statistiques", "Audience", "Résultat indésirable"], example: "87% des freelances ne trouvent pas assez de clients : êtes-vous l'un d'entre eux ?" },
      { id: "au5", text: "{Solution}, soutenue par {source de confiance}.", vars: ["Solution", "source de confiance"], example: "L'école de formation au business development, soutenue par le gouvernement." },
      { id: "au6", text: "Rejoignez les {nombre} {audience} qui {résultat}.", vars: ["nombre", "audience", "résultat"], example: "Rejoignez les 230 000+ freelances qui utilisent notre solution pour trouver plus de clients." },
      { id: "au7", text: "Nous avons aidé {audience} à obtenir {résultat}.", vars: ["audience", "résultat"], example: "Nous avons aidé plus de 48 agences immobilières à tripler leurs mandats de vente." },
      { id: "au8", text: "Nous avons fait appel {autorité} pour obtenir {produit / service}.", vars: ["autorité", "produit / service"], example: "Nous avons fait appel aux meilleurs experts du secteur pour concevoir ce programme." },
      { id: "au9", text: "Nous {Faisons cela}, mais la particularité est {différenciation}.", vars: ["Faisons cela", "différenciation"], example: "Nous gérons vos publicités, mais la particularité est que nos experts ont 10+ ans d'expérience." },
    ],
  },
  {
    id: "differenciation",
    label: "Différenciation / Repositionnement",
    color: "#6A3A9A",
    colorBg: "#F5F0FC",
    icon: "⚔️",
    funnel: ["Considération", "Décision"],
    usages: [
      { label: "PVU / tagline officielle de marque", ok: true },
      { label: "Hero section H1 (marché saturé)", ok: true },
      { label: "Script VSL (30–60 secondes)", ok: true },
      { label: "Page comparatif / \"Pourquoi nous\"", ok: true },
      { label: "Audience qui ne connaît pas encore la catégorie", ok: false, reason: "La différenciation n'a de sens que si le prospect sait déjà ce qu'il compare — sinon le message ne résonne pas" },
    ],
    tip: "Ces formules supposent que ton prospect connaît déjà ta catégorie de produit et a probablement essayé une alternative. Sur un marché nouveau ou une audience froide, commence par éduquer avant de te différencier.",
    formulas: [
      { id: "di1", text: "La {manière} la plus {adjectif} de {résultat}.", vars: ["manière", "adjectif", "résultat"], example: "Le moyen le plus rentable pour générer des prospects qualifiés rapidement." },
      { id: "di2", text: "{Catégorie de produit} rendue {adjectif}.", vars: ["Catégorie de produit", "adjectif"], example: "La comptabilité rendue facile." },
      { id: "di3", text: "{Catégorie de produit} Avec {différenciation}", vars: ["Catégorie de produit", "différenciation"], example: "Des ordinateurs portables à moins de 400€." },
      { id: "di4", text: "La seule {catégorie de produit} qui ne fait pas {objection}", vars: ["catégorie de produit", "objection"], example: "Le seul SaaS RH qui ne facture pas au nombre d'employés." },
      { id: "di5", text: "{Produit/service} conçus pour {résultat}", vars: ["Produit/service", "résultat"], example: "Des sneakers spécialement conçues pour un confort optimal." },
      { id: "di6", text: "{Produit/Service}, réinventé.", vars: ["Produit/Service"], example: "La comptabilité, réinventée." },
      { id: "di7", text: "Obtenez le pouvoir {adjectif} de {produit} sans {douleur}.", vars: ["adjectif", "produit", "douleur"], example: "Obtenez le pouvoir lumineux de la caféine sans prendre de caféine." },
      { id: "di8", text: "La {solution} que les {audiences} méritent.", vars: ["solution", "audiences"], example: "L'outil de comptabilité que tous les entrepreneurs méritent." },
    ],
  },
  {
    id: "cta",
    label: "Transition / Invitation à l'action",
    color: "#2E7D6B",
    colorBg: "#EEF9F5",
    icon: "→",
    funnel: ["Conversion"],
    usages: [
      { label: "CTA final landing page", ok: true },
      { label: "Dernier email de séquence", ok: true },
      { label: "Slide de clôture webinaire", ok: true },
      { label: "P.S. d'email", ok: true },
      { label: "Caption fin de vidéo", ok: true },
      { label: "Entrée de funnel (cold)", ok: false, reason: "Mettre un CTA avant d'avoir créé le désir est la faute classique — le prospect n'est pas encore prêt à agir" },
    ],
    tip: "Ces formules convertissent quand le désir est déjà créé. En entrée de funnel, elles tombent dans le vide — le prospect n'a pas encore de raison d'agir. Réserve-les pour la fin de séquence ou le bas de page.",
    formulas: [
      { id: "c1", text: "Êtes-vous prêt à accomplir {résultat} avec {offre spéciale} ?", vars: ["résultat", "offre spéciale"], example: "Êtes-vous prêt à obtenir plus de leads avec notre mois d'essai gratuit ?" },
      { id: "c2", text: "Vous souhaitez {résultat} ? Utilisez {solution} dès maintenant.", vars: ["résultat", "solution"], example: "Vous souhaitez obtenir plus de prospects qualifiés ? Déléguez vos publicités à AdsBack dès maintenant." },
      { id: "c3", text: "Vous souhaitez {résultat} ? Alors passez à {solution}", vars: ["résultat", "solution"], example: "Vous souhaitez générer plus de prospects ? Alors passez à notre solution." },
      { id: "c4", text: "{Quoi}. {Comment}. {Pourquoi} !", vars: ["Quoi", "Comment", "Pourquoi"], example: "Essayez Elevate. Connectez-vous à notre plateforme d'apprentissage. Trouvez plus de clients !" },
      { id: "c5", text: "Laissez le {produit} travailler sur votre {problème} pendant seulement {une période} - et vous verrez la différence.", vars: ["produit", "problème", "une période"], example: "Laissez nos experts gérez vos publicités pendant 1 mois - et vous verrez la différence." },
      { id: "c6", text: "{Exemple d'entreprise éprouvée} pour les {produits/services}", vars: ["Exemple d'entreprise éprouvée", "produits/services"], example: "Netflix, pour les mangas." },
      { id: "c7", text: "{Produit/service} conçus pour {résultat}", vars: ["Produit/service", "résultat"], example: "Une formation conçue pour décrocher vos 3 premiers clients en 30 jours." },
    ],
  },
];

// ─── StrikeView — interface pleine page ───────────────────────────────────
function StrikeView() {
  const [activeCat, setActiveCat] = React.useState(STRIKE_CATEGORIES[0].id);
  const [activeFormula, setActiveFormula] = React.useState(null);
  const [vars, setVars] = React.useState({});
  const [result, setResult] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [showGuide, setShowGuide] = React.useState(false);

  const cat = STRIKE_CATEGORIES.find((c) => c.id === activeCat);

  const selectFormula = (f) => {
    setActiveFormula(f);
    setVars({});
    setResult("");
    setCopied(false);
  };

  const generate = () => {
    let out = activeFormula.text;
    activeFormula.vars.forEach((v) => {
      const val = vars[v] || `[${v}]`;
      out = out.replace(`{${v}}`, val);
    });
    setResult(out);
  };

  const doCopy = async () => {
    try { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <div className="view-wrap strike-view">

      {/* HEADER */}
      <div className="view-head">
        <div>
          <h2 className="view-title">⚡ Formule Strike</h2>
          <p className="view-sub">54 formules d'accroche · 6 catégories · guide d'utilisation intégré</p>
        </div>
      </div>

      <div className="strike-layout">

        {/* COLONNE GAUCHE — catégories */}
        <div className="strike-cats">
          <div className="strike-cats-label">Catégories</div>
          {STRIKE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={"strike-cat-btn" + (activeCat === c.id ? " active" : "")}
              style={activeCat === c.id ? { background: c.colorBg, borderColor: c.color, color: c.color } : {}}
              onClick={() => { setActiveCat(c.id); setActiveFormula(null); setResult(""); setShowGuide(false); }}
            >
              <span className="strike-cat-icon">{c.icon}</span>
              <div>
                <div className="strike-cat-name">{c.label}</div>
                <div className="strike-cat-count">{c.formulas.length} formules</div>
              </div>
            </button>
          ))}
        </div>

        {/* COLONNE CENTRE — formules */}
        <div className="strike-formulas">
          <button
            className="strike-guide-toggle"
            style={{ borderColor: cat.color, color: cat.color, background: showGuide ? cat.colorBg : "transparent" }}
            onClick={() => setShowGuide((v) => !v)}
          >
            {showGuide ? "▾" : "▸"} Guide d'utilisation — {cat.label}
          </button>

          {showGuide && (
            <div className="strike-guide" style={{ borderColor: cat.color, background: cat.colorBg }}>
              <p className="strike-guide-tip">{cat.tip}</p>
              <div className="strike-guide-funnel">
                <span className="strike-guide-fl">Funnel :</span>
                {cat.funnel.map((f) => <span key={f} className="strike-guide-ftag" style={{ background: cat.color }}>{f}</span>)}
              </div>
              <div className="strike-guide-usages">
                {cat.usages.map((u, i) => (
                  <div key={i} className={"strike-usage" + (u.ok ? " ok" : " nok")}>
                    <span className="strike-usage-icon">{u.ok ? "✓" : "✗"}</span>
                    <div>
                      <span className="strike-usage-label">{u.label}</span>
                      {u.reason && <span className="strike-usage-reason"> — {u.reason}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="strike-formula-list">
            {cat.formulas.map((f) => (
              <button
                key={f.id}
                className={"strike-formula-btn" + (activeFormula?.id === f.id ? " active" : "")}
                style={activeFormula?.id === f.id ? { borderColor: cat.color, background: cat.colorBg } : {}}
                onClick={() => selectFormula(f)}
              >
                {f.text}
              </button>
            ))}
          </div>
        </div>

        {/* COLONNE DROITE — instanciation */}
        <div className="strike-editor">
          {!activeFormula ? (
            <div className="strike-empty">← Choisis une formule pour l'instancier avec tes données.</div>
          ) : (
            <>
              <div className="strike-editor-title" style={{ color: cat.color }}>Instanciation</div>
              <div className="strike-template">{activeFormula.text}</div>

              {/* EXEMPLE */}
              {activeFormula.example && (
                <div className="strike-example">
                  <div className="strike-example-label">Exemple concret</div>
                  <div className="strike-example-text">{activeFormula.example}</div>
                </div>
              )}

              <div className="strike-vars">
                {activeFormula.vars.map((v) => (
                  <div key={v} className="strike-var-row">
                    <label className="strike-var-label">{`{${v}}`}</label>
                    <input
                      className="strike-var-input"
                      placeholder={`Remplace {${v}} par...`}
                      value={vars[v] || ""}
                      onChange={(e) => setVars((prev) => ({ ...prev, [v]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>

              <button className="strike-gen-btn" style={{ background: cat.color }} onClick={generate}>
                Générer l'accroche
              </button>

              {result && (
                <div className="strike-result">
                  <div className="strike-result-label">Résultat</div>
                  <div className="strike-result-text">{result}</div>
                  <button className="strike-copy-btn" onClick={doCopy}>
                    {copied ? "✓ Copié !" : "Copier"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── storage ───────────────────────────────────────────────────────────────
const _sb = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);
const HAS = true;
const sget = async (k) => {
  try {
    const { data } = await _sb.from("kv_store").select("value").eq("key", k).maybeSingle();
    return data ? data.value : null;
  } catch { return null; }
};
const sset = async (k, v) => {
  try {
    await _sb.from("kv_store").upsert({ key: k, value: v, updated_at: new Date().toISOString() });
  } catch {}
};
const sdel = async (k) => {
  try {
    await _sb.from("kv_store").delete().eq("key", k);
  } catch {}
};
const LIST_KEY = "cw4_projects";
const SEL_KEY  = "cw4_selected";
const projKey  = (id) => `cw4_proj_${id}`;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,6);

const ALL_STEPS   = PIPELINE.flatMap((p) => p.steps);
const CHAP_STEPS  = ALL_STEPS.filter((s) => s.type === "chap");
const TOTAL_CHAPS = CHAP_STEPS.length;
const AVATAR_CHAPS = CHAP_STEPS.filter((s) => s.badge === "avatar" && s.fields.length);
const stepByCode  = (c) => ALL_STEPS.find((s) => s.code === c);

const emptyData = () => ({ avatars: [], fixed: {}, avatar: {}, multi: {}, checks: {}, ui: { multi: {} }, terrain: emptyTerrain() });
const emptyTerrain = () => ({
  entretiens: { enpersonne: [], telephone: [], mail: [] },
  sondage: [],
  autres: [],
  vocabulaire: [],
  regroupements: [],
});
const emptySlot = () => ({ notes: {}, lists: {} });
const BADGE_LABELS = { fixed: "Figé", avatar: "Selon Avatar", multi: "Multi-instance" };
const slotHasContent = (sl) =>
  Object.values(sl.notes || {}).some((v) => v && v.trim()) ||
  Object.values(sl.lists || {}).some((l) => Array.isArray(l) && l.some((v) => v && v.trim()));

// ─── CSV — export/import compatible Google Sheets / Excel ─────────────────
const csvEscape = (v) => {
  const s = (v ?? "").toString();
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const toCSV = (headers, rows) => {
  const lines = [headers.map(csvEscape).join(",")];
  rows.forEach((r) => lines.push(headers.map((h) => csvEscape(r[h])).join(",")));
  return "\uFEFF" + lines.join("\r\n"); // BOM pour accents dans Excel
};
// Parseur CSV simple mais robuste aux guillemets, virgules et retours ligne dans les champs.
function parseCSV(text) {
  const rows = []; let row = []; let field = ""; let inQ = false;
  const clean = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i], n = clean[i + 1];
    if (inQ) {
      if (c === '"' && n === '"') { field += '"'; i++; }
      else if (c === '"') { inQ = false; }
      else field += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\r") { /* skip */ }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).filter((r) => r.some((c) => c && c.trim())).map((r) => {
    const o = {}; headers.forEach((h, i) => o[h] = (r[i] || "").trim()); return o;
  });
}
// downloadText : dans le sandbox Claude, Blob/createObjectURL ne déclenche pas de vrai
// téléchargement. On ouvre une modal copier/coller à la place.
const downloadText = (filename, content) => {
  window.dispatchEvent(new CustomEvent("copy-modal-open", { detail: { filename, content } }));
};

// ─── CopyModal ────────────────────────────────────────────────────────────
function CopyModal() {
  const [data, setData] = React.useState(null); // { filename, content }
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    const h = (e) => { setData(e.detail); setCopied(false); };
    window.addEventListener("copy-modal-open", h);
    return () => window.removeEventListener("copy-modal-open", h);
  }, []);
  if (!data) return null;
  const doCopy = async () => {
    try { await navigator.clipboard.writeText(data.content); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch {}
  };
  const doSelect = (e) => { e.target.select(); };
  return (
    <div className="confirm-bg" onClick={() => setData(null)}>
      <div className="confirm-box" style={{ maxWidth: 560, width: "95%" }} onClick={(e) => e.stopPropagation()}>
        <p style={{ fontWeight: 700, marginBottom: 6 }}>📋 {data.filename}</p>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
          Le téléchargement direct n'est pas disponible dans cet environnement.<br />
          Copie le contenu ci-dessous → colle dans un fichier <code>.csv</code> → ouvre dans Google Sheets ou Excel.
        </p>
        <textarea
          readOnly
          value={data.content}
          onClick={doSelect}
          style={{
            width: "100%", height: 180, fontFamily: "monospace", fontSize: 11,
            background: "var(--bg2)", color: "var(--text)", border: "1px solid var(--border)",
            borderRadius: 6, padding: 8, resize: "vertical", boxSizing: "border-box"
          }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "flex-end" }}>
          <button onClick={() => setData(null)} style={{ background: "var(--bg2)", color: "var(--text)", border: "1px solid var(--border)" }}>Fermer</button>
          <button onClick={doCopy} style={{ background: "var(--accent)", color: "#fff", border: "none" }}>
            {copied ? "✓ Copié !" : "Tout copier"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ConfirmModal ─────────────────────────────────────────────────────────
function ConfirmModal({ msg, onOk, onCancel }) {
  return (
    <div className="confirm-bg" onClick={onCancel}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-msg">{msg}</p>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel}>Annuler</button>
          <button className="confirm-ok" onClick={onOk}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

// hook useConfirm — renvoie [node, askConfirm]
// askConfirm(msg) renvoie une Promise<bool>
function useConfirm() {
  const [state, setState] = useState(null); // {msg, resolve}
  const ask = (msg) => new Promise((resolve) => setState({ msg, resolve }));
  const node = state ? (
    <ConfirmModal msg={state.msg}
      onOk={() => { state.resolve(true);  setState(null); }}
      onCancel={() => { state.resolve(false); setState(null); }} />
  ) : null;
  return [node, ask];
}

// ─── Badge ────────────────────────────────────────────────────────────────
function Badge({ type }) {
  return <span className={`badge badge-${type}`}>{BADGE_LABELS[type]}</span>;
}

// ─── RepField ─────────────────────────────────────────────────────────────
function RepField({ f, notes, lists, setNote, setList, onConfirm }) {
  const val   = notes[f.k] || "";
  const items = lists[f.k] || Array(Math.min(f.min || 1, 3)).fill("");
  const done  = f.repeat ? items.filter((x) => x && x.trim()).length : (val.trim() ? 1 : 0);
  const min   = f.min || 0;
  if (!f.repeat) return (
    <label className="field">
      <span className="field-lbl">{f.label}</span>
      <textarea value={val} rows={3}
        onChange={(e) => setNote(f.k, e.target.value)} />
      {f.ph && <span className="field-hint">{f.ph}</span>}
    </label>
  );
  return (
    <div className="field">
      <span className="field-lbl">
        {f.label}
        {min > 0 && <em className={"min" + (done >= min ? " ok" : "")}>{done}/{min} minimum</em>}
      </span>
      {f.ph && <span className="field-hint">{f.ph}</span>}
      {items.map((v, i) => (
        <div className="rep-row" key={i}>
          <span className="rep-idx">{i + 1}</span>
          <textarea value={v} rows={2}
            onChange={(e) => { const l = [...items]; l[i] = e.target.value; setList(f.k, l); }} />
          <button className="rep-del" onClick={async () => { if (!(await onConfirm("Supprimer cet élément ?"))) return; const l = [...items]; l.splice(i, 1); setList(f.k, l.length ? l : [""]); }}>×</button>
        </div>
      ))}
      <button className="rep-add" onClick={() => setList(f.k, [...items, ""])}>+ Ajouter</button>
    </div>
  );
}

function SlotFields({ s, slot, onUpdate, onConfirm }) {
  const setNote = (k, v) => onUpdate({ ...slot, notes: { ...slot.notes, [k]: v } });
  const setList = (k, l) => onUpdate({ ...slot, lists: { ...slot.lists, [k]: l } });
  return (
    <div className="fields">
      {s.fields.map((f) => (
        <RepField key={f.k} f={f} notes={slot.notes} lists={slot.lists}
          setNote={setNote} setList={setList} onConfirm={onConfirm} />
      ))}
    </div>
  );
}

function AvatarTabs({ s, avatars, getSlot, setSlot, onConfirm }) {
  const [activeAv, setActiveAv] = useState(avatars[0]?.id || null);
  return (
    <>
      <div className="av-tabs">
        {avatars.map((a) => (
          <button key={a.id} className={"av-tab" + (activeAv === a.id ? " active" : "")}
            onClick={() => setActiveAv(a.id)}>{a.name}</button>
        ))}
      </div>
      {activeAv && s.fields.length > 0 && (
        <SlotFields s={s} slot={getSlot(s.code, activeAv)}
          onUpdate={(sl) => setSlot(s.code, activeAv, sl)} onConfirm={onConfirm} />
      )}
    </>
  );
}

// ─── MultiTabs (onglet actif persistant) ──────────────────────────────────
function MultiTabs({ s, pieces, activeId, setActiveId, onAdd, onUpdate, onRename, onDelete, onConfirm }) {
  const piece = pieces.find((p) => p.id === activeId) || pieces[0] || null;
  return (
    <div className="multi-section">
      <div className="multi-bar">
        {pieces.map((p) => (
          <button key={p.id} className={"multi-tab" + (piece?.id === p.id ? " active" : "")}
            onClick={() => setActiveId(s.code, p.id)}>
            {p.label}
            <span className="multi-del" onClick={async (e) => {
              e.stopPropagation();
              if (!(await onConfirm(`Supprimer la pièce "${p.label}" ?`))) return;
              onDelete(p.id);
              if (piece?.id === p.id) setActiveId(s.code, pieces.filter((x) => x.id !== p.id)[0]?.id || null);
            }}>×</span>
          </button>
        ))}
        <button className="multi-add" onClick={() => { const id = onAdd(); setActiveId(s.code, id); }}>+ Nouvelle pièce</button>
      </div>
      {piece ? (
        <div>
          <div className="piece-label-row">
            <label className="piece-label-lbl">Nom de cette pièce</label>
            <input className="piece-label-inp" value={piece.label}
              onChange={(e) => onRename(piece.id, e.target.value)}
              placeholder="Ex: Landing page principale, Email de bienvenue…" />
          </div>
          <SlotFields s={s} slot={piece} onUpdate={(sl) => onUpdate(piece.id, sl)} />
        </div>
      ) : (
        <div className="av-empty">Clique sur « + Nouvelle pièce » pour créer une instance (landing page, email, pub…).</div>
      )}
    </div>
  );
}

// ─── StepDetail ───────────────────────────────────────────────────────────
function StepDetail({ s, avatars, getFixed, setFixed, getAvatarSlot, setAvatarSlot,
                      getMultiPieces, addMultiPiece, updateMultiPiece, renameMultiPiece,
                      deleteMultiPiece, setCompare, activeMulti, setActiveMulti, onConfirm }) {
  return (
    <div className="step-detail">
      <div className="concept"><div className="concept-lbl">Le principe</div><p>{s.concept}</p></div>
      <div className="when"><b>Quand :</b> {s.when}</div>
      <div className="blk-lbl">À couvrir / à répondre</div>
      <ul className="q-list">{s.q.map((x, j) => <li key={j}>{x}</li>)}</ul>

      {s.errors.length > 0 && (
        <details className="errbox">
          <summary>Erreurs à éviter ({s.errors.length})</summary>
          <ul>{s.errors.map((x, j) => <li key={j}>{x}</li>)}</ul>
        </details>
      )}

      {(EXAMPLES[s.code] || []).length > 0 && (
        <details className="exbox">
          <summary>Exemples concrets ({(EXAMPLES[s.code] || []).length})</summary>
          <div className="ex-list">
            {(EXAMPLES[s.code] || []).map((ex, j) => (
              <div className={"ex-item" + (ex.long ? " ex-long" : "")} key={j}>
                <div className="ex-title">
                  {ex.title}
                  {ex.long && <span className="ex-badge">approfondi</span>}
                </div>
                <p className="ex-text">{ex.text}</p>
              </div>
            ))}
          </div>
        </details>
      )}

      {s.linked.length > 0 && (
        <div className="linked">
          <span className="linked-lbl">Indissociable de :</span>
          {s.linked.map((c) => {
            const t = stepByCode(c); if (!t) return null;
            return <button key={c} className="linkbtn" onClick={() => setCompare({ from: s.code, to: c })}>{c} · {t.title}</button>;
          })}
        </div>
      )}

      {s.badge === "fixed" && s.fields.length > 0 && (
        <SlotFields s={s} slot={getFixed(s.code)} onUpdate={(sl) => setFixed(s.code, sl)} onConfirm={onConfirm} />
      )}

      {s.badge === "avatar" && (
        <div className="av-section">
          {avatars.length === 0
            ? <div className="av-empty">Crée d'abord un avatar en haut du cockpit pour remplir ce chapitre.</div>
            : <AvatarTabs s={s} avatars={avatars} getSlot={getAvatarSlot} setSlot={setAvatarSlot} onConfirm={onConfirm} />}
        </div>
      )}

      {s.badge === "multi" && (
        <MultiTabs s={s} pieces={getMultiPieces(s.code)}
          activeId={activeMulti[s.code]} setActiveId={setActiveMulti}
          onAdd={() => addMultiPiece(s.code)}
          onUpdate={(pid, sl) => updateMultiPiece(s.code, pid, sl)}
          onRename={(pid, label) => renameMultiPiece(s.code, pid, label)}
          onDelete={(pid) => deleteMultiPiece(s.code, pid)}
          onConfirm={onConfirm} />
      )}
    </div>
  );
}

function ComparePanel({ compare, onClose, avatars, getFixed, setFixed, getAvatarSlot, setAvatarSlot }) {
  const target = stepByCode(compare.to);
  if (!target) return null;
  return (
    <div className="cmp">
      <div className="cmp-head">
        <div>
          <div className="cmp-eyebrow">En vis-à-vis de {compare.from}</div>
          <h3>{target.code} — {target.title} <Badge type={target.badge} /></h3>
        </div>
        <button className="modal-x" onClick={onClose}>×</button>
      </div>
      <div className="cmp-body">
        <p className="cmp-concept">{target.concept}</p>
        {target.badge === "fixed" && target.fields.length > 0 && (
          <SlotFields s={target} slot={getFixed(target.code)} onUpdate={(sl) => setFixed(target.code, sl)} />
        )}
        {target.badge === "avatar" && (
          <div className="av-section">
            {avatars.length === 0
              ? <div className="av-empty">Crée d'abord un avatar en haut du cockpit.</div>
              : <AvatarTabs s={target} avatars={avatars} getSlot={getAvatarSlot} setSlot={setAvatarSlot} />}
          </div>
        )}
        {target.badge === "multi" && <div className="av-empty">Ouvre ce chapitre directement pour gérer ses pièces.</div>}
      </div>
    </div>
  );
}

function PhaseNav({ activePhase, setActivePhase }) {
  const idx = PIPELINE.findIndex((p) => p.id === activePhase);
  const prev = PIPELINE[idx - 1], next = PIPELINE[idx + 1];
  return (
    <div className="phase-nav">
      {prev ? <button onClick={() => setActivePhase(prev.id)}>← {prev.tag}</button> : <span />}
      {next ? <button className="primary" onClick={() => setActivePhase(next.id)}>{next.tag} : {next.name} →</button>
            : <span className="phase-nav-end">Fin du pipeline. Contrôle terminé → tu publies.</span>}
    </div>
  );
}

// ─── ExportModal (paramètres puis résultat) ───────────────────────────────
function ExportModal({ onClose, data, projectName, chapsDone }) {
  const [stage, setStage]   = useState("params");
  const [avIds, setAvIds]   = useState(data.avatars.map((a) => a.id));
  const [badges, setBadges] = useState({ fixed: true, avatar: true, multi: true });
  const [pieceIds, setPieceIds] = useState(() => {
    const o = {};
    Object.keys(data.multi || {}).forEach((c) => { o[c] = (data.multi[c] || []).map((p) => p.id); });
    return o;
  });
  const [copied, setCopied] = useState(false);

  const multiChapters = Object.keys(data.multi || {}).filter((c) => (data.multi[c] || []).length > 0);
  const toggleAv = (id) => setAvIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const togglePiece = (c, id) => setPieceIds((p) => {
    const cur = p[c] || [];
    return { ...p, [c]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
  });

  const build = () => {
    const out = [`# Brief — ${projectName}`, ``, `_${chapsDone}/${TOTAL_CHAPS} chapitres validés._`, ``];
    const render = (s, slot, label) => {
      const lines = [];
      s.fields.forEach((f) => {
        if (f.repeat) { const it = ((slot.lists || {})[f.k] || []).filter((x) => x && x.trim()); if (it.length) lines.push(`**${f.label}**`, ...it.map((x) => `- ${x.trim()}`), ``); }
        else { const v = ((slot.notes || {})[f.k] || "").trim(); if (v) lines.push(`**${f.label}**`, v, ``); }
      });
      if (lines.length) out.push(`### ${s.code} — ${s.title}${label ? ` (${label})` : ""}`, ``, ...lines);
    };
    PIPELINE.forEach((ph) => {
      const was = out.length;
      ph.steps.forEach((s) => {
        if (!s.fields.length) return;
        if (s.badge === "fixed" && badges.fixed) render(s, data.fixed[s.code] || emptySlot(), "");
        if (s.badge === "avatar" && badges.avatar)
          data.avatars.filter((a) => avIds.includes(a.id))
            .forEach((a) => render(s, (data.avatar[s.code] || {})[a.id] || emptySlot(), a.name));
        if (s.badge === "multi" && badges.multi)
          (data.multi[s.code] || []).filter((p) => (pieceIds[s.code] || []).includes(p.id))
            .forEach((p) => render(s, p, p.label));
      });
      if (out.length > was) out.splice(was, 0, `## ${ph.tag} — ${ph.name}`, ``);
    });
    return out.join("\n");
  };

  const doCopy = async () => { try { await navigator.clipboard.writeText(build()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} };
  const doDownload = () => {
    downloadText(
      `brief-${projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`,
      build()
    );
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h2>{stage === "params" ? "Paramètres d'export" : "Brief de lancement"}</h2>
            <p>{stage === "params"
              ? "Choisis ce que le brief doit contenir. Décoche pour générer un brief ciblé (un seul avatar, un seul format…)."
              : "Ta matière compilée selon tes filtres. Copie ou télécharge."}</p>
          </div>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>

        {stage === "params" ? (
          <div className="exp-params">
            <div className="exp-block">
              <div className="exp-lbl">Types de chapitres</div>
              <div className="exp-chips">
                {["fixed", "avatar", "multi"].map((b) => (
                  <label key={b} className={"exp-chip chip-" + b + (badges[b] ? " on" : "")}>
                    <input type="checkbox" checked={badges[b]} onChange={() => setBadges((p) => ({ ...p, [b]: !p[b] }))} />
                    {BADGE_LABELS[b]}
                  </label>
                ))}
              </div>
            </div>

            {data.avatars.length > 0 && (
              <div className="exp-block">
                <div className="exp-lbl">Avatars à inclure</div>
                <div className="exp-chips">
                  {data.avatars.map((a) => (
                    <label key={a.id} className={"exp-chip chip-avatar" + (avIds.includes(a.id) ? " on" : "")}>
                      <input type="checkbox" checked={avIds.includes(a.id)} onChange={() => toggleAv(a.id)} />
                      {a.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {multiChapters.length > 0 && (
              <div className="exp-block">
                <div className="exp-lbl">Pièces multi-instances à inclure</div>
                {multiChapters.map((c) => {
                  const st = stepByCode(c);
                  return (
                    <div className="exp-sub" key={c}>
                      <div className="exp-sub-lbl">{c} — {st?.title}</div>
                      <div className="exp-chips">
                        {(data.multi[c] || []).map((p) => (
                          <label key={p.id} className={"exp-chip chip-multi" + ((pieceIds[c] || []).includes(p.id) ? " on" : "")}>
                            <input type="checkbox" checked={(pieceIds[c] || []).includes(p.id)} onChange={() => togglePiece(c, p.id)} />
                            {p.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <pre className="brief">{build()}</pre>
        )}

        <div className="modal-actions">
          {stage === "params" ? (
            <button className="primary" onClick={() => setStage("result")}>Générer le brief →</button>
          ) : (
            <>
              <button onClick={() => setStage("params")}>← Paramètres</button>
              <button className="primary" onClick={doCopy}>{copied ? "Copié ✓" : "Copier le texte"}</button>
              <button onClick={doDownload}>Télécharger en .md</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TerrainModal (module Phase 0 — enquête terrain) ──────────────────────
// Objectifs chiffrés du cours : 10-15 entretiens · 100-300 réponses sondage · 2-4 regroupements
const TERRAIN_TABS = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "entretiens", label: "Entretiens" },
  { id: "sondage", label: "Sondage" },
  { id: "autres", label: "Autres sources" },
  { id: "tags", label: "Tags & regroupements" },
  { id: "vocab", label: "Vocabulaire" },
  { id: "export", label: "Export & analyse" },
];
const CANAL_LABELS = { enpersonne: "En personne", telephone: "Téléphone", mail: "Mail" };
const Q_UNIVERSELLES = [
  "Quel est ton objectif principal dans [ton domaine] en ce moment ?",
  "Quel obstacle t'empêche de l'accomplir ?",
  "À quoi ressemblera ta vie / ton business quand tu auras atteint ce but ?",
];
const SONDAGE_HEADERS = ["reponse_q1", "reponse_q2", "reponse_q3", "email", "telephone", "tags"];

function TerrainView({ terrain, setTerrain, projectName }) {
  return <TerrainInner terrain={terrain} setTerrain={setTerrain} projectName={projectName} isView={true} onClose={null} />;
}
function TerrainModal({ onClose, terrain, setTerrain, projectName }) {
  return <TerrainInner terrain={terrain} setTerrain={setTerrain} projectName={projectName} isView={false} onClose={onClose} />;
}
function TerrainInner({ terrain, setTerrain, projectName, isView, onClose }) {
  const [tab, setTab] = useState("overview");
  const [canal, setCanal] = useState("enpersonne");
  const [copiedVocab, setCopiedVocab] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const nbEntretiens = Object.values(terrain.entretiens).reduce((s, arr) => s + arr.length, 0);
  const nbSondage = terrain.sondage.length;
  const nbRegroup = terrain.regroupements.length;

  // ── Entretiens ──
  const addEntretien = () => setTerrain((t) => ({
    ...t,
    entretiens: { ...t.entretiens, [canal]: [...t.entretiens[canal], { id: uid(), date: "", contexte: "", q1: "", q2: "", q3: "", verbatims: "", retenir: "" }] },
  }));
  const updEntretien = (id, patch) => setTerrain((t) => ({
    ...t,
    entretiens: { ...t.entretiens, [canal]: t.entretiens[canal].map((e) => e.id === id ? { ...e, ...patch } : e) },
  }));
  const delEntretien = (id) => setTerrain((t) => ({
    ...t,
    entretiens: { ...t.entretiens, [canal]: t.entretiens[canal].filter((e) => e.id !== id) },
  }));

  // ── Sondage ──
  const addSondageRow = (row = {}) => setTerrain((t) => ({
    ...t,
    sondage: [...t.sondage, { id: uid(), q1: "", q2: "", q3: "", email: "", tel: "", tags: "", ...row }],
  }));
  const updSondageRow = (id, patch) => setTerrain((t) => ({
    ...t, sondage: t.sondage.map((r) => r.id === id ? { ...r, ...patch } : r),
  }));
  const delSondageRow = (id) => setTerrain((t) => ({ ...t, sondage: t.sondage.filter((r) => r.id !== id) }));

  const charCount = (r) => (r.q1 + r.q2 + r.q3).length;
  const sortedSondage = [...terrain.sondage].sort((a, b) => charCount(b) - charCount(a));
  const ultraCount = Math.max(1, Math.ceil(terrain.sondage.length * 0.15)); // top ~15% par défaut

  const downloadTemplate = () => {
    const example = { reponse_q1: "Ex : gagner 5k€/mois avec mon activité freelance", reponse_q2: "Ex : je n'ai pas de méthode claire pour trouver des clients", reponse_q3: "Ex : je pourrais enfin quitter mon CDI et choisir mes clients", email: "", telephone: "", tags: "debutant;peur_instabilite" };
    downloadText(`sondage-template-${projectName.toLowerCase().replace(/\\s+/g,'-')}.csv`, toCSV(SONDAGE_HEADERS, [example]));
  };
  const downloadSondageCSV = () => {
    const rows = terrain.sondage.map((r) => ({ reponse_q1: r.q1, reponse_q2: r.q2, reponse_q3: r.q3, email: r.email, telephone: r.tel, tags: r.tags }));
    downloadText(`sondage-${projectName.toLowerCase().replace(/\\s+/g,'-')}.csv`, toCSV(SONDAGE_HEADERS, rows));
  };
  const importCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = parseCSV(String(e.target.result));
      const rows = parsed.map((o) => ({
        id: uid(), q1: o.reponse_q1 || "", q2: o.reponse_q2 || "", q3: o.reponse_q3 || "",
        email: o.email || "", tel: o.telephone || "", tags: o.tags || "",
      }));
      if (rows.length) setTerrain((t) => ({ ...t, sondage: [...t.sondage, ...rows] }));
    };
    reader.readAsText(file, "utf-8");
  };

  // ── Autres sources ──
  const addAutre = () => setTerrain((t) => ({ ...t, autres: [...t.autres, { id: uid(), source: "", verbatim: "", tags: "" }] }));
  const updAutre = (id, patch) => setTerrain((t) => ({ ...t, autres: t.autres.map((a) => a.id === id ? { ...a, ...patch } : a) }));
  const delAutre = (id) => setTerrain((t) => ({ ...t, autres: t.autres.filter((a) => a.id !== id) }));

  // ── Tags agrégés (fréquence, depuis sondage + autres) ──
  const tagFreq = useMemo(() => {
    const freq = {};
    const feed = (s) => (s || "").split(/[;,]/).map((x) => x.trim()).filter(Boolean).forEach((tag) => { freq[tag] = (freq[tag] || 0) + 1; });
    terrain.sondage.forEach((r) => feed(r.tags));
    terrain.autres.forEach((a) => feed(a.tags));
    return Object.entries(freq).sort((a, b) => b[1] - a[1]);
  }, [terrain.sondage, terrain.autres]);

  // ── Regroupements ──
  const addRegroupement = () => setTerrain((t) => ({ ...t, regroupements: [...t.regroupements, { id: uid(), nom: "", description: "", tags: "" }] }));
  const updRegroupement = (id, patch) => setTerrain((t) => ({ ...t, regroupements: t.regroupements.map((r) => r.id === id ? { ...r, ...patch } : r) }));
  const delRegroupement = (id) => setTerrain((t) => ({ ...t, regroupements: t.regroupements.filter((r) => r.id !== id) }));

  // ── Vocabulaire ──
  const addVocab = () => setTerrain((t) => ({ ...t, vocabulaire: [...t.vocabulaire, { id: uid(), texte: "" }] }));
  const updVocab = (id, texte) => setTerrain((t) => ({ ...t, vocabulaire: t.vocabulaire.map((v) => v.id === id ? { ...v, texte } : v) }));
  const delVocab = (id) => setTerrain((t) => ({ ...t, vocabulaire: t.vocabulaire.filter((v) => v.id !== id) }));

  const copyVocab = async () => {
    const txt = terrain.vocabulaire.map((v) => v.texte).filter(Boolean).join("\n");
    try { await navigator.clipboard.writeText(txt); setCopiedVocab(true); setTimeout(() => setCopiedVocab(false), 2000); } catch {}
  };

  const buildAnalysisPrompt = () => {
    const entretiensTxt = Object.entries(terrain.entretiens).flatMap(([c, arr]) =>
      arr.filter((e) => e.q1 || e.q2 || e.q3 || e.verbatims).map((e, i) =>
        `[${CANAL_LABELS[c]} #${i + 1}]${e.date ? ` (${e.date})` : ""}\nQ1: ${e.q1}\nQ2: ${e.q2}\nQ3: ${e.q3}\nVerbatims libres: ${e.verbatims}\nÀ retenir: ${e.retenir}`
      )).join("\n\n");
    const sondageTxt = terrain.sondage.map((r, i) => `[Répondant ${i + 1}] Q1: ${r.q1} | Q2: ${r.q2} | Q3: ${r.q3}${r.tags ? ` | tags: ${r.tags}` : ""}`).join("\n");
    const autresTxt = terrain.autres.map((a) => `[${a.source || "source non précisée"}] ${a.verbatim}${a.tags ? ` (tags: ${a.tags})` : ""}`).join("\n");
    const vocabTxt = terrain.vocabulaire.map((v) => v.texte).filter(Boolean).join("\n");
    return [
      `Tu es un analyste en recherche marché / copywriting. Voici les données brutes d'une enquête terrain pour le projet "${projectName}". Analyse-les selon la méthode du cours (checklist avatar en 7 catégories : identité, langage, histoire avec le problème, émotions/peurs, vision succès-échec, besoin/peur profonde).`,
      ``,
      `MISSION :`,
      `1. Identifie 2 à 4 regroupements psychologiques distincts (pas démographiques — des postures mentales)`,
      `2. Pour chaque regroupement, extrais : les peurs qui reviennent, le vocabulaire récurrent (mots/expressions exacts), le besoin rationnel/émotionnel/identitaire dominant`,
      `3. Repère les verbatims les plus forts et réutilisables tels quels dans une copy`,
      `4. Signale les patterns qui reviennent le plus souvent (avec une estimation de fréquence si possible)`,
      ``,
      `=== ENTRETIENS DIRECTS ===`,
      entretiensTxt || "(aucun entretien renseigné)",
      ``,
      `=== SONDAGE (${terrain.sondage.length} répondants) ===`,
      sondageTxt || "(aucune réponse renseignée)",
      ``,
      `=== AUTRES SOURCES (commentaires, avis, forums) ===`,
      autresTxt || "(aucune source renseignée)",
      ``,
      `=== VOCABULAIRE DÉJÀ REPÉRÉ ===`,
      vocabTxt || "(vide)",
      ``,
      `Rends ta réponse sous forme de 2 à 4 fiches de regroupement, prêtes à recopier dans les chapitres Avatar / Recherche terrain du cockpit.`,
    ].join("\n");
  };

  const copyPrompt = async () => {
    try { await navigator.clipboard.writeText(buildAnalysisPrompt()); setCopiedPrompt(true); setTimeout(() => setCopiedPrompt(false), 2500); } catch {}
  };

  const Gauge = ({ label, val, min, max, hint }) => {
    const pct = Math.min(100, Math.round((val / min) * 100));
    const ok = val >= min;
    return (
      <div className="terr-gauge">
        <div className="terr-gauge-top">
          <span className="terr-gauge-label">{label}</span>
          <span className={"terr-gauge-val" + (ok ? " ok" : "")}>{val} <span className="terr-gauge-target">/ {min}-{max}</span></span>
        </div>
        <div className="terr-gauge-bar"><div className="terr-gauge-fill" style={{ width: `${pct}%` }} /></div>
        <div className="terr-gauge-hint">{hint}</div>
      </div>
    );
  };

  const inner = (
    <>
      <div className={isView ? "view-head" : "modal-head"}>
        <div>
          <h2>🔬 Enquête terrain</h2>
          <p>Collecte, structure et distille ta matière brute — avant de remplir les chapitres Avatar.</p>
        </div>
        {!isView && <button className="modal-x" onClick={onClose}>×</button>}
      </div>

      <div className="terr-tabs">
        {TERRAIN_TABS.map((t) => (
          <button key={t.id} className={"terr-tab" + (tab === t.id ? " on" : "")} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

        <div className="gen-body terr-body">

          {tab === "overview" && (
            <>
              <div className="terr-gauges">
                <Gauge label="Entretiens directs" val={nbEntretiens} min={10} max={15} hint="En personne ou téléphone, 3 questions ouvertes, laisse parler." />
                <Gauge label="Réponses sondage" val={nbSondage} min={100} max={300} hint="3 questions ouvertes max. En dessous de 100 réponses, reste humble sur les conclusions." />
                <Gauge label="Regroupements identifiés" val={nbRegroup} min={2} max={4} hint="Des profils psychologiques, pas démographiques." />
              </div>
              <div className="terr-step">
                <div className="gen-lbl">Les 3 questions universelles</div>
                <div className="terr-qcard">
                  {Q_UNIVERSELLES.map((q, i) => <div key={i} className="terr-q">{i + 1}. {q}</div>)}
                  <div className="gen-note" style={{ marginTop: 8 }}>Identiques pour les entretiens directs et le sondage. Toujours ouvertes — jamais de QCM. Ce qui remonte en premier = ce qui compte le plus pour le prospect.</div>
                </div>
              </div>
              <div className="terr-step">
                <div className="gen-lbl">Le protocole en 6 étapes (rappel du cours)</div>
                <ol className="terr-protocol">
                  <li>Prépare ton terrain — checklist avatar + doc vocabulaire + feuille de sondage</li>
                  <li>Parle à 10-15 personnes — en personne ou téléphone, 3 questions ouvertes, laisse parler</li>
                  <li>Lance un sondage — 3 questions max, contrepartie (ex : bon de réduction futur), 100-300 réponses</li>
                  <li>Analyse — tague chaque répondant, identifie 2-4 regroupements, extrais le vocabulaire, repère les ultra-répondants</li>
                  <li>Construis tes avatars — checklist complète par groupe, prénom/âge/visage, rationnel/émotionnel/identitaire</li>
                  <li>Écris ton message — une page par avatar, ou un message modulaire, ou une séquence email</li>
                </ol>
              </div>
            </>
          )}

          {tab === "entretiens" && (
            <>
              <div className="terr-canal-tabs">
                {Object.keys(CANAL_LABELS).map((c) => (
                  <button key={c} className={"terr-canal" + (canal === c ? " on" : "")} onClick={() => setCanal(c)}>
                    {CANAL_LABELS[c]} <span className="terr-canal-n">{terrain.entretiens[c].length}</span>
                  </button>
                ))}
              </div>
              <div className="gen-note">
                {canal === "enpersonne" && "Idéal : tu captes les émotions, les hésitations, les silences."}
                {canal === "telephone" && "Très bon : tu perds le visuel mais tu gardes la texture de la voix."}
                {canal === "mail" && "Loin d'être idéal — beaucoup moins de texture émotionnelle. À utiliser en dernier recours."}
              </div>
              {terrain.entretiens[canal].map((e, i) => (
                <div key={e.id} className="terr-card">
                  <div className="terr-card-head">
                    <span className="terr-card-title">{CANAL_LABELS[canal]} #{i + 1}</span>
                    <input className="terr-date" type="text" placeholder="Date" value={e.date} onChange={(ev) => updEntretien(e.id, { date: ev.target.value })} />
                    <button className="terr-del" onClick={() => delEntretien(e.id)}>Supprimer</button>
                  </div>
                  <input className="terr-input" placeholder="Contexte (qui, comment tu l'as trouvé…)" value={e.contexte} onChange={(ev) => updEntretien(e.id, { contexte: ev.target.value })} />
                  <textarea className="terr-textarea" placeholder={"Q1 — " + Q_UNIVERSELLES[0]} value={e.q1} onChange={(ev) => updEntretien(e.id, { q1: ev.target.value })} />
                  <textarea className="terr-textarea" placeholder={"Q2 — " + Q_UNIVERSELLES[1]} value={e.q2} onChange={(ev) => updEntretien(e.id, { q2: ev.target.value })} />
                  <textarea className="terr-textarea" placeholder={"Q3 — " + Q_UNIVERSELLES[2]} value={e.q3} onChange={(ev) => updEntretien(e.id, { q3: ev.target.value })} />
                  <textarea className="terr-textarea" placeholder="Verbatims libres — phrases marquantes dites en dehors des 3 questions" value={e.verbatims} onChange={(ev) => updEntretien(e.id, { verbatims: ev.target.value })} />
                  <input className="terr-input" placeholder="À retenir en une phrase" value={e.retenir} onChange={(ev) => updEntretien(e.id, { retenir: ev.target.value })} />
                </div>
              ))}
              <button className="terr-add" onClick={addEntretien}>+ Ajouter un entretien ({CANAL_LABELS[canal]})</button>
            </>
          )}

          {tab === "sondage" && (
            <>
              <div className="terr-sondage-actions">
                <button onClick={downloadTemplate}>Télécharger le template CSV (Google Sheets / Excel)</button>
                <label className="terr-upload">
                  Importer un CSV rempli
                  <input type="file" accept=".csv,text/csv" style={{ display: "none" }}
                    onChange={(ev) => { const f = ev.target.files?.[0]; if (f) importCSV(f); ev.target.value = ""; }} />
                </label>
                <button onClick={downloadSondageCSV} disabled={!terrain.sondage.length}>Exporter les réponses en CSV</button>
                <button onClick={() => addSondageRow()}>+ Ajouter une ligne manuellement</button>
              </div>
              <div className="gen-note">Colonnes attendues du CSV : {SONDAGE_HEADERS.join(", ")}. Le fichier s'ouvre et se réenregistre directement dans Google Sheets ou Excel.</div>
              {sortedSondage.length > 0 && (
                <div className="terr-table-wrap">
                  <table className="terr-table">
                    <thead><tr><th>#</th><th>Q1</th><th>Q2</th><th>Q3</th><th>Email</th><th>Tél.</th><th>Tags</th><th>Car.</th><th></th></tr></thead>
                    <tbody>
                      {sortedSondage.map((r, i) => (
                        <tr key={r.id} className={i < ultraCount ? "terr-ultra" : ""}>
                          <td>{i + 1}{i < ultraCount && <span className="terr-ultra-tag" title="Ultra-répondant (top ~15% en volume de texte)"> ★</span>}</td>
                          <td><input value={r.q1} onChange={(ev) => updSondageRow(r.id, { q1: ev.target.value })} /></td>
                          <td><input value={r.q2} onChange={(ev) => updSondageRow(r.id, { q2: ev.target.value })} /></td>
                          <td><input value={r.q3} onChange={(ev) => updSondageRow(r.id, { q3: ev.target.value })} /></td>
                          <td><input value={r.email} onChange={(ev) => updSondageRow(r.id, { email: ev.target.value })} /></td>
                          <td><input value={r.tel} onChange={(ev) => updSondageRow(r.id, { tel: ev.target.value })} /></td>
                          <td><input placeholder="tag1;tag2" value={r.tags} onChange={(ev) => updSondageRow(r.id, { tags: ev.target.value })} /></td>
                          <td className="terr-charcount">{charCount(r)}</td>
                          <td><button className="terr-del-sm" onClick={() => delSondageRow(r.id)}>×</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!terrain.sondage.length && <div className="terr-empty">Aucune réponse pour l'instant — importe un CSV ou ajoute une ligne.</div>}
            </>
          )}

          {tab === "autres" && (
            <>
              <div className="gen-note">Commentaires réseaux sociaux, avis clients, forums, groupes Facebook/Reddit — tout verbatim trouvé passivement, pas récolté par un entretien direct.</div>
              {terrain.autres.map((a) => (
                <div key={a.id} className="terr-card">
                  <div className="terr-card-head">
                    <input className="terr-input" style={{ flex: 1 }} placeholder="Source (ex : commentaire Instagram, avis Google, forum X)" value={a.source} onChange={(ev) => updAutre(a.id, { source: ev.target.value })} />
                    <button className="terr-del" onClick={() => delAutre(a.id)}>Supprimer</button>
                  </div>
                  <textarea className="terr-textarea" placeholder="Le verbatim, mot pour mot" value={a.verbatim} onChange={(ev) => updAutre(a.id, { verbatim: ev.target.value })} />
                  <input className="terr-input" placeholder="Tags (séparés par ; )" value={a.tags} onChange={(ev) => updAutre(a.id, { tags: ev.target.value })} />
                </div>
              ))}
              <button className="terr-add" onClick={addAutre}>+ Ajouter une source</button>
            </>
          )}

          {tab === "tags" && (
            <>
              <div className="terr-step">
                <div className="gen-lbl">Fréquence des tags (sondage + autres sources)</div>
                {tagFreq.length ? (
                  <div className="terr-tagcloud">
                    {tagFreq.map(([tag, n]) => (
                      <span key={tag} className="terr-tagchip" style={{ fontSize: `${Math.min(20, 11 + n * 1.5)}px` }}>{tag} <b>{n}</b></span>
                    ))}
                  </div>
                ) : <div className="terr-empty">Ajoute des tags dans le Sondage ou les Autres sources pour les voir apparaître ici.</div>}
              </div>
              <div className="terr-step">
                <div className="gen-lbl">Regroupements psychologiques identifiés (2 à 4 recommandés)</div>
                {terrain.regroupements.map((r, i) => (
                  <div key={r.id} className="terr-card">
                    <div className="terr-card-head">
                      <input className="terr-input" style={{ flex: 1 }} placeholder={`Nom du profil #${i + 1} (ex : le débutant qui doute)`} value={r.nom} onChange={(ev) => updRegroupement(r.id, { nom: ev.target.value })} />
                      <button className="terr-del" onClick={() => delRegroupement(r.id)}>Supprimer</button>
                    </div>
                    <textarea className="terr-textarea" placeholder="Description du profil : sa posture mentale, ce qui le caractérise" value={r.description} onChange={(ev) => updRegroupement(r.id, { description: ev.target.value })} />
                    <input className="terr-input" placeholder="Tags associés (séparés par ; )" value={r.tags} onChange={(ev) => updRegroupement(r.id, { tags: ev.target.value })} />
                  </div>
                ))}
                <button className="terr-add" onClick={addRegroupement}>+ Ajouter un regroupement</button>
              </div>
            </>
          )}

          {tab === "vocab" && (
            <>
              <div className="gen-note">Ton "or noir" — phrases marquantes, expressions récurrentes, mots précis de ton marché. À relire à chaque copy pour ne pas retomber dans ton jargon.</div>
              {terrain.vocabulaire.map((v) => (
                <div key={v.id} className="terr-vocab-row">
                  <input className="terr-input" style={{ flex: 1 }} placeholder="Une phrase ou expression exacte" value={v.texte} onChange={(ev) => updVocab(v.id, ev.target.value)} />
                  <button className="terr-del-sm" onClick={() => delVocab(v.id)}>×</button>
                </div>
              ))}
              <button className="terr-add" onClick={addVocab}>+ Ajouter une entrée</button>
              {terrain.vocabulaire.length > 0 && (
                <button className="primary" style={{ marginTop: 10 }} onClick={copyVocab}>{copiedVocab ? "Copié ✓" : "Copier tout le vocabulaire"}</button>
              )}
            </>
          )}

          {tab === "export" && (
            <>
              <div className="terr-step">
                <div className="gen-lbl">Générer le prompt d'analyse</div>
                <div className="gen-note">Compile tout ce que tu as collecté (entretiens, sondage, autres sources, vocabulaire) dans un prompt prêt à coller dans une nouvelle conversation Claude — pour faire ressortir les regroupements et les patterns.</div>
                <button className="primary" style={{ marginTop: 8 }} onClick={copyPrompt}>{copiedPrompt ? "Copié ✓" : "Copier le prompt d'analyse"}</button>
              </div>
              <div className="terr-step">
                <div className="gen-lbl">Export brut</div>
                <div className="gen-note">Exporte les réponses de sondage en CSV (compatible Google Sheets / Excel) pour archiver ou retravailler ailleurs.</div>
                <button style={{ marginTop: 8 }} onClick={downloadSondageCSV} disabled={!terrain.sondage.length}>Télécharger le sondage en CSV</button>
              </div>
            </>
          )}

        </div>

      {!isView && (
        <div className="modal-actions">
          <button onClick={onClose}>Fermer</button>
        </div>
      )}
    </>
  );

  if (isView) return <div className="view-wrap">{inner}</div>;
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal modal-wide modal-tall" onClick={(e) => e.stopPropagation()}>{inner}</div>
    </div>
  );
}

// ─── ContentModal (générateur de contenu multi-format) ────────────────────
function ContentModal({ onClose, data, projectName }) {
  const [platformId, setPlatformId] = useState(null);
  const [formatId, setFormatId]     = useState(null);
  const [schemaId, setSchemaId]     = useState(null);
  const [avId, setAvId]             = useState(data.avatars[0]?.id || null);
  const [outMode, setOutMode]       = useState("prompt");
  const [stage, setStage]           = useState("pick");
  const [copied, setCopied]         = useState(false);
  // Sélections d'ingrédients : { [type]: valeur choisie }
  const [ingredientSel, setIngredientSel] = useState({});

  const platform = platformId ? platformById(platformId) : null;
  const format   = platform && formatId ? formatById(platformId, formatId) : null;
  const schema   = format && schemaId ? schemaById(platformId, formatId, schemaId) : null;

  // Reset ingrédients quand on change de schéma ou d'avatar
  const selectSchema = (id) => { setSchemaId(id); setIngredientSel({}); };
  const selectAvatar = (id) => { setAvId(id); setIngredientSel({}); };

  // Ingrédients du schéma courant avec leurs options disponibles
  const ingredientOptions = schema
    ? (schema.needs || []).map((type) => ({
        type,
        label: INGREDIENT_MAP[type]?.label || type,
        options: extractIngredient(data, type, avId),
      }))
    : [];

  const allIngredientsFilled = ingredientOptions.every(
    (ing) => ing.options.length === 0 || ingredientSel[ing.type]
  );

  const buildContext = () => {
    const parts = [];
    // Données des chapitres uses (ancien système)
    if ((schema.uses || []).length > 0) {
      const ctx = gatherChapterData(data, schema.uses || [], avId);
      if (ctx) parts.push(ctx);
    }
    // Ingrédients choisis
    ingredientOptions.forEach(({ type, label }) => {
      const val = ingredientSel[type];
      if (val) parts.push(`[${label} — ${val.from}]\n  ${val.text}`);
    });
    return parts.join("\n\n");
  };

  const avName = () => avId ? (data.avatars.find((a) => a.id === avId)?.name || "") : "";

  const buildBrief = () => {
    const ctx = buildContext();
    const av = avName();
    const out = [
      `# Contenu — ${platform.name} · ${format.name}`,
      `## ${schema.name}  (${schema.axis})`,
      ``,
      `Projet : ${projectName}${av ? ` · Avatar : ${av}` : ""}`,
      ``,
      `> ${schema.desc}`,
      ``,
      `## Ossature à suivre`,
      ...schema.beats.map((b, i) => `${i + 1}. ${b}`),
      ``,
      `## Contraintes du format (${platform.name} · ${format.name})`,
      format.note,
      ``,
      `## Ta matière (issue du cockpit)`,
      ctx || "_(aucun ingrédient rempli — complète les chapitres liés pour enrichir ce contenu)_",
    ];
    return out.join("\n");
  };

  const buildPrompt = () => {
    const ctx = buildContext();
    const av = avName();
    const out = [
      `Tu es copywriter expert. Rédige un contenu pour ${platform.name} au format "${format.name}", en suivant EXACTEMENT le schéma "${schema.name}" (axe ${schema.axis}).`,
      ``,
      `INTENTION DU SCHÉMA : ${schema.desc}`,
      ``,
      `OSSATURE À RESPECTER, dans l'ordre :`,
      ...schema.beats.map((b, i) => `${i + 1}. ${b}`),
      ``,
      `CONTRAINTES DU FORMAT (${platform.name} · ${format.name}) : ${format.note}`,
      ``,
      `MATIÈRE À UTILISER${av ? ` (avatar : ${av})` : ""} — puise dedans, ne réinvente pas, garde le langage réel de la cible :`,
      ``,
      ctx || "(aucune matière remplie — complète les chapitres liés d'abord)",
      ``,
      `CONSIGNES : reste concret et incarné, pas de généralités. Respecte l'ordre de l'ossature et les contraintes du format. Un seul CTA. Écris en français.${data.avatars.length > 1 ? ` Adapte le ton à l'avatar : ${av}.` : ""} Propose 2 variantes du hook d'ouverture.`,
    ];
    return out.join("\n");
  };

  const output = stage === "result" ? (outMode === "prompt" ? buildPrompt() : buildBrief()) : "";
  const doCopy = async () => { try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} };
  const doDownload = () => { downloadText(`contenu-${platform.id}-${format.id}-${schema.id}.md`, output); };

  const schemasByAxis = format ? AXIS_ORDER
    .map((ax) => ({ axis: ax, list: format.schemas.filter((s) => s.axis === ax) }))
    .filter((g) => g.list.length) : [];

  // Étape courante pour numéroter les sections
  let stepNum = 1;

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h2>{stage === "pick" ? "Générateur de contenu" : `${platform.name} · ${schema.name}`}</h2>
            <p>{stage === "pick"
              ? "Réseau → format → schéma → avatar → ingrédients → génère."
              : outMode === "prompt" ? "Prompt prêt à coller dans une nouvelle conversation Claude." : "Brief structuré avec ta matière compilée."}</p>
          </div>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>

        {stage === "pick" ? (
          <div className="gen-body">

            {/* ÉTAPE 1 — Réseau */}
            <div className="gen-step">
              <div className="gen-lbl">{stepNum++} · Réseau</div>
              <div className="gen-platforms">
                {PLATFORMS.map((p) => (
                  <button key={p.id} className={"gen-plat" + (platformId === p.id ? " on" : "")}
                    onClick={() => { setPlatformId(p.id); setFormatId(null); selectSchema(null); }}>
                    {p.name}
                  </button>
                ))}
              </div>
              {platform && <div className="gen-note">{platform.note}</div>}
            </div>

            {/* ÉTAPE 2 — Format */}
            {platform && (
              <div className="gen-step">
                <div className="gen-lbl">{stepNum++} · Format natif</div>
                <div className="gen-formats">
                  {platform.formats.map((f) => (
                    <button key={f.id} className={"gen-format" + (formatId === f.id ? " on" : "")}
                      onClick={() => { setFormatId(f.id); selectSchema(null); }}>
                      {f.name}
                    </button>
                  ))}
                </div>
                {format && <div className="gen-note">{format.note}</div>}
              </div>
            )}

            {/* ÉTAPE 3 — Avatar (avant le schéma pour que la jauge soit précise) */}
            {format && data.avatars.length > 0 && (
              <div className="gen-step">
                <div className="gen-lbl">{stepNum++} · Avatar ciblé</div>
                <div className="gen-avatars">
                  {data.avatars.map((a) => (
                    <button key={a.id} className={"gen-av" + (avId === a.id ? " on" : "")} onClick={() => selectAvatar(a.id)}>{a.name}</button>
                  ))}
                </div>
              </div>
            )}

            {/* ÉTAPE 4 — Schéma */}
            {format && (
              <div className="gen-step">
                <div className="gen-lbl">{stepNum++} · Schéma</div>
                {schemasByAxis.map((g) => (
                  <div className="gen-axis-group" key={g.axis}>
                    <div className={"gen-axis-tag axis-" + g.axis.toLowerCase()}>{g.axis}</div>
                    <div className="gen-schemas">
                      {g.list.map((s) => {
                        const r = schemaReadiness(data, s, avId);
                        const ready = r.total > 0 && r.filled === r.total;
                        return (
                          <button key={s.id} className={"gen-schema" + (schemaId === s.id ? " on" : "")}
                            onClick={() => selectSchema(s.id)}>
                            <div className="gen-schema-top">
                              <span className="gen-schema-name">{s.name}</span>
                              {r.total > 0 && <span className={"gen-ready" + (ready ? " ok" : r.filled ? " part" : " empty")} title="Ingrédients disponibles">{r.filled}/{r.total}</span>}
                            </div>
                            <div className="gen-schema-desc">{s.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ÉTAPE 5 — Sélecteur d'ingrédients */}
            {schema && ingredientOptions.length > 0 && (
              <div className="gen-step">
                <div className="gen-lbl">{stepNum++} · Ingrédients du schéma</div>
                <div className="gen-note">Ce schéma utilise ces éléments de ton cockpit. Choisis lequel utiliser pour chaque ingrédient.</div>
                <div className="gen-ingredients">
                  {ingredientOptions.map(({ type, label, options }) => (
                    <div key={type} className="gen-ingredient">
                      <div className="gen-ingredient-label">
                        {label}
                        {options.length === 0 && <span className="gen-ingredient-empty"> — non rempli dans le cockpit</span>}
                      </div>
                      {options.length > 0 && (
                        <div className="gen-ingredient-options">
                          {options.map((opt, i) => (
                            <button
                              key={i}
                              className={"gen-ingredient-opt" + (ingredientSel[type]?.text === opt.text ? " on" : "")}
                              onClick={() => setIngredientSel((prev) => ({
                                ...prev,
                                [type]: prev[type]?.text === opt.text ? undefined : opt
                              }))}
                            >
                              <span className="gen-ingredient-from">{opt.from}</span>
                              <span className="gen-ingredient-text">{opt.text.length > 160 ? opt.text.slice(0, 160) + "…" : opt.text}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ÉTAPE FINALE — Format de sortie */}
            {schema && (
              <div className="gen-step">
                <div className="gen-lbl">{stepNum++} · Format de sortie</div>
                <div className="gen-outmode">
                  <button className={"gen-out" + (outMode === "prompt" ? " on" : "")} onClick={() => setOutMode("prompt")}>
                    <span className="gen-out-name">Prompt Claude</span>
                    <span className="gen-out-desc">Prêt à coller dans une nouvelle conversation</span>
                  </button>
                  <button className={"gen-out" + (outMode === "brief" ? " on" : "")} onClick={() => setOutMode("brief")}>
                    <span className="gen-out-name">Brief structuré</span>
                    <span className="gen-out-desc">L'ossature + ta matière, pour rédiger toi-même</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <pre className="brief">{output}</pre>
        )}

        <div className="modal-actions">
          {stage === "pick" ? (
            <button className="primary" disabled={!schema} onClick={() => schema && setStage("result")}>
              {schema ? "Générer →" : "Choisis un schéma"}
            </button>
          ) : (
            <>
              <button onClick={() => setStage("pick")}>← Retour</button>
              <button className="primary" onClick={doCopy}>{copied ? "Copié ✓" : "Copier"}</button>
              <button onClick={doDownload}>Télécharger en .md</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [confirmNode, ask] = useConfirm();
  const [projects, setProjects]       = useState([]);
  const [currentId, setCurrentId]     = useState(null);
  const [data, setData]               = useState(emptyData());
  const [activeView, setActiveView]   = useState("p0");
  const [open, setOpen]               = useState({});
  const [compare, setCompare]         = useState(null);
  const [exportOpen, setExportOpen]   = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [renaming, setRenaming]       = useState(false);
  const [renameVal, setRenameVal]     = useState("");
  const [avatarEdit, setAvatarEdit]   = useState(null);

  useEffect(() => {
    (async () => {
      let list = [];
      if (HAS) { const raw = await sget(LIST_KEY); if (raw) { try { list = JSON.parse(raw); } catch {} } }
      if (!list.length) { list = [{ id: uid(), name: "Mon premier lancement" }]; await sset(LIST_KEY, JSON.stringify(list)); }
      let sel = HAS ? await sget(SEL_KEY) : null;
      if (!sel || !list.find((p) => p.id === sel)) sel = list[0].id;
      setProjects(list); setCurrentId(sel); setData(await loadProject(sel));
    })();
  }, []);

  const loadProject = async (id) => {
    if (HAS) { const raw = await sget(projKey(id)); if (raw) { try { const d = JSON.parse(raw); return { ...emptyData(), ...d, ui: { multi: {}, ...(d.ui || {}) } }; } catch {} } }
    return emptyData();
  };
  const persist = (id, d) => sset(projKey(id), JSON.stringify(d));
  const persistList = (l) => sset(LIST_KEY, JSON.stringify(l));
  const upd = (fn) => setData((prev) => { const next = fn(prev); persist(currentId, next); return next; });

  const selectProject = async (id) => {
    setActiveView("p0"); setOpen({}); setCompare(null);
    setCurrentId(id); setData(await loadProject(id)); sset(SEL_KEY, id);
  };
  const addProject = async () => {
    const p = { id: uid(), name: "Nouveau lancement" };
    const l = [...projects, p]; setProjects(l); persistList(l);
    await selectProject(p.id); setRenaming(true); setRenameVal(p.name);
  };
  // ── DUPLICATION ──
  const duplicateProject = async () => {
    const src = projects.find((p) => p.id === currentId);
    if (!src) return;
    const p = { id: uid(), name: `Copie de ${src.name}` };
    const l = [...projects, p];
    await sset(projKey(p.id), JSON.stringify(data));   // copie intégrale des données
    setProjects(l); persistList(l);
    await selectProject(p.id); setRenaming(true); setRenameVal(p.name);
  };
  const commitRename = () => {
    const n = renameVal.trim() || "Sans titre";
    const l = projects.map((p) => (p.id === currentId ? { ...p, name: n } : p));
    setProjects(l); persistList(l); setRenaming(false);
  };
  const deleteProject = async () => {
    if (!(await ask("Supprimer ce projet ? Cette action est irréversible."))) return;
    let l = projects.filter((p) => p.id !== currentId); sdel(projKey(currentId));
    if (!l.length) l = [{ id: uid(), name: "Mon premier lancement" }];
    setProjects(l); persistList(l); await selectProject(l[0].id);
  };

  const addAvatar = () => { const a = { id: uid(), name: "Nouvel avatar" }; upd((p) => ({ ...p, avatars: [...p.avatars, a] })); setAvatarEdit(a.id); };
  const renameAvatar = (id, name) => upd((p) => ({ ...p, avatars: p.avatars.map((a) => (a.id === id ? { ...a, name } : a)) }));
  const deleteAvatar = async (id) => {
    if (!(await ask("Supprimer cet avatar et toutes ses données ? Cette action est irréversible."))) return;
    upd((p) => {
      const avatars = p.avatars.filter((a) => a.id !== id);
      const avatar = { ...p.avatar };
      Object.keys(avatar).forEach((c) => { const o = { ...avatar[c] }; delete o[id]; avatar[c] = o; });
      return { ...p, avatars, avatar };
    });
  };

  const getFixed = (code) => data.fixed[code] || emptySlot();
  const setFixed = (code, slot) => upd((p) => ({ ...p, fixed: { ...p.fixed, [code]: slot } }));
  const setTerrain = (fn) => upd((p) => ({ ...p, terrain: fn(p.terrain) }));
  const getAvatarSlot = (code, avId) => (data.avatar[code] || {})[avId] || emptySlot();
  const setAvatarSlot = (code, avId, slot) => upd((p) => ({ ...p, avatar: { ...p.avatar, [code]: { ...(p.avatar[code] || {}), [avId]: slot } } }));
  const getMultiPieces = (code) => data.multi[code] || [];
  const addMultiPiece = (code) => {
    const id = uid();
    upd((p) => ({ ...p, multi: { ...p.multi, [code]: [...(p.multi[code] || []), { id, label: "Nouvelle pièce", notes: {}, lists: {} }] } }));
    return id;
  };
  const updateMultiPiece = (code, pid, slot) => upd((p) => ({ ...p, multi: { ...p.multi, [code]: p.multi[code].map((x) => (x.id === pid ? { ...x, ...slot } : x)) } }));
  const renameMultiPiece = (code, pid, label) => upd((p) => ({ ...p, multi: { ...p.multi, [code]: p.multi[code].map((x) => (x.id === pid ? { ...x, label } : x)) } }));
  const deleteMultiPiece = (code, pid) => upd((p) => ({ ...p, multi: { ...p.multi, [code]: p.multi[code].filter((x) => x.id !== pid) } }));
  // ── onglet multi actif, persistant ──
  const setActiveMulti = (code, pid) => upd((p) => ({ ...p, ui: { ...p.ui, multi: { ...(p.ui?.multi || {}), [code]: pid } } }));

  const toggleCheck = (code) => upd((p) => ({ ...p, checks: { ...p.checks, [code]: !p.checks[code] } }));

  const isStarted = (s) => {
    if (!s.fields.length) return false;
    if (s.badge === "fixed")  return slotHasContent(getFixed(s.code));
    if (s.badge === "avatar") return data.avatars.some((a) => slotHasContent(getAvatarSlot(s.code, a.id)));
    if (s.badge === "multi")  return (data.multi[s.code] || []).length > 0;
    return false;
  };
  // ── avancement par avatar ──
  const avatarProgress = (avId) => {
    const done = AVATAR_CHAPS.filter((s) => slotHasContent(getAvatarSlot(s.code, avId))).length;
    return { done, total: AVATAR_CHAPS.length };
  };

  const chapsDone = useMemo(() => CHAP_STEPS.filter((s) => data.checks[s.code]).length, [data]);
  const chapsStarted = useMemo(() => CHAP_STEPS.filter(isStarted).length, [data]);
  const pct = Math.round((chapsDone / TOTAL_CHAPS) * 100);
  const current = projects.find((p) => p.id === currentId);
  const phase = PIPELINE.find((p) => p.id === activeView);

  const stepProps = { avatars: data.avatars, getFixed, setFixed, getAvatarSlot, setAvatarSlot,
    getMultiPieces, addMultiPiece, updateMultiPiece, renameMultiPiece, deleteMultiPiece,
    setCompare, activeMulti: data.ui?.multi || {}, setActiveMulti, onConfirm: ask };

  return (
    <div className="wrap">
      <style>{CSS}</style>

      <aside className="rail">
        <div className="brand">
          <span className="brand-mark">◧</span>
          <div><div className="brand-t">Cockpit Copywriting</div><div className="brand-s">Pipeline de lancement</div></div>
        </div>

        <div className="proj">
          <label className="lbl">Projet</label>
          <select className="proj-sel" value={currentId || ""} onChange={(e) => selectProject(e.target.value)}>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="proj-actions">
            <button onClick={() => { setRenaming(true); setRenameVal(current?.name || ""); }}>Renommer</button>
            <button onClick={addProject}>+ Nouveau</button>
            <button onClick={duplicateProject}>Dupliquer</button>
            <button className="danger" onClick={deleteProject}>Supprimer</button>
          </div>
          {renaming && (
            <div className="rename">
              <input autoFocus value={renameVal} onChange={(e) => setRenameVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && commitRename()} />
              <button onClick={commitRename}>OK</button>
            </div>
          )}
        </div>

        <nav className="phases">
          <div className="rail-section-lbl">Outils</div>
          <button className={"tool-card tool-terrain" + (activeView === "terrain" ? " active" : "")}
            onClick={() => { setActiveView("terrain"); setOpen({}); setCompare(null); }}>
            <span className="tool-card-icon">🔬</span>
            <div className="tool-card-text">
              <div className="tool-card-name">Enquête terrain</div>
              <div className="tool-card-sub">Entretiens · Sondage · Avatars</div>
            </div>
          </button>

          <div className="rail-section-lbl" style={{ marginTop: 10 }}>Pipeline</div>
          {PIPELINE.map((p) => {
            const done = p.steps.filter((s) => data.checks[s.code]).length;
            return (
              <button key={p.id} className={"pnav" + (p.id === activeView ? " active" : "")}
                onClick={() => { setActiveView(p.id); setOpen({}); setCompare(null); }}>
                <div className="pnav-top"><span className="pnav-tag">{p.tag}</span><span className={"pnav-count" + (done === p.steps.length ? " ok" : "")}>{done}/{p.steps.length}</span></div>
                <div className="pnav-name">{p.name}</div>
                <div className="pnav-bar"><span style={{ width: `${(done / p.steps.length) * 100}%` }} /></div>
              </button>
            );
          })}

          <button className={"tool-card tool-strike" + (activeView === "strike" ? " active" : "")}
            onClick={() => { setActiveView("strike"); setOpen({}); setCompare(null); }}>
            <span className="tool-card-icon">⚡</span>
            <div className="tool-card-text">
              <div className="tool-card-name">Formule Strike</div>
              <div className="tool-card-sub">54 accroches · 6 catégories</div>
            </div>
          </button>
        </nav>

        <button className="content-btn" onClick={() => setContentOpen(true)}>✦ Générer un contenu</button>
        <button className="export-btn" onClick={() => setExportOpen(true)}>Générer le brief complet</button>
        <div className="rail-foot">Gère tes avatars en haut · clique une étape pour l'ouvrir.</div>
      </aside>

      <main className="main">

        {/* ── VUE TERRAIN ── */}
        {activeView === "terrain" && (
          <TerrainView terrain={data.terrain} setTerrain={setTerrain} projectName={current?.name || "Projet"} />
        )}

        {/* ── VUE STRIKE ── */}
        {activeView === "strike" && (
          <StrikeView />
        )}

        {/* ── VUES PIPELINE ── */}
        {phase && (
          <>
            <section className="avatar-panel">
              <div className="avatar-panel-head">
                <span className="avatar-panel-title">Avatars du projet</span>
                <span className="avatar-panel-sub">{AVATAR_CHAPS.length} chapitres « Selon Avatar » se déclinent pour chacun.</span>
                <button className="avatar-add-btn" onClick={addAvatar}>+ Ajouter un avatar</button>
              </div>
              {data.avatars.length === 0 ? (
                <div className="avatar-empty">Aucun avatar — crée-en un pour débloquer les chapitres « Selon Avatar ».</div>
              ) : (
                <div className="avatar-list">
                  {data.avatars.map((a) => {
                    const pr = avatarProgress(a.id);
                    return (
                      <div key={a.id} className="avatar-card">
                        <div className="avatar-card-top">
                          {avatarEdit === a.id ? (
                            <input autoFocus className="avatar-inp" value={a.name}
                              onChange={(e) => renameAvatar(a.id, e.target.value)}
                              onBlur={() => setAvatarEdit(null)}
                              onKeyDown={(e) => e.key === "Enter" && setAvatarEdit(null)} />
                          ) : (
                            <span className="avatar-name" onClick={() => setAvatarEdit(a.id)}>{a.name}</span>
                          )}
                          <div className="avatar-actions">
                            <button onClick={() => setAvatarEdit(a.id)}>✎</button>
                            <button onClick={() => deleteAvatar(a.id)}>×</button>
                          </div>
                        </div>
                        <div className="avatar-prog">
                          <div className="avatar-prog-bar"><span style={{ width: `${(pr.done / pr.total) * 100}%` }} /></div>
                          <span className={"avatar-prog-txt" + (pr.done === pr.total ? " ok" : "")}>{pr.done}/{pr.total}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <header className="cov">
              <div className="cov-num">
                <span className="cov-big">{chapsDone}<span className="cov-slash">/{TOTAL_CHAPS}</span></span>
                <span className="cov-lbl">chapitres validés · {chapsStarted} commencés</span>
              </div>
              <div className="cov-strip" aria-hidden="true">
                {PIPELINE.map((p) => (
                  <div className="cov-group" key={p.id}>
                    {p.steps.filter((s) => s.type === "chap").map((s) => (
                      <span key={s.code} className={"tick" + (data.checks[s.code] ? " done" : isStarted(s) ? " part" : "")} title={`${s.code} · ${s.title}`} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="cov-pct">{pct === 100 ? "Rien oublié." : `${pct}%`}</div>
            </header>

            <section className="phase">
              <div className="phase-head">
                <span className="phase-tag">{phase.tag}</span>
                <h1 className="phase-name">{phase.name}</h1>
                <p className="phase-goal">{phase.goal}</p>
              </div>
              <ol className="steps">
                {phase.steps.map((s, i) => {
                  const done = !!data.checks[s.code], isOpen = !!open[s.code];
                  return (
                    <li key={s.code} className={"step" + (done ? " done" : "") + (isOpen ? " open" : "")}>
                      <div className="step-head" onClick={() => setOpen((o) => ({ ...o, [s.code]: !o[s.code] }))}>
                        <div className="step-idx">{String(i + 1).padStart(2, "0")}</div>
                        <button className={"chk" + (done ? " on" : "")} onClick={(e) => { e.stopPropagation(); toggleCheck(s.code); }} aria-label="Valider">{done ? "✓" : ""}</button>
                        <div className="step-main">
                          <div className="step-line1">
                            <span className={"code" + (s.type === "qa" ? " qa" : "")}>{s.code}</span>
                            <Badge type={s.badge} />
                            <span className="step-title">{s.title}</span>
                          </div>
                          <div className="step-produces">{s.produces}</div>
                        </div>
                        <div className={"chev" + (isOpen ? " up" : "")}>⌄</div>
                      </div>
                      {isOpen && <StepDetail key={s.code} s={s} {...stepProps} />}
                    </li>
                  );
                })}
              </ol>
              <PhaseNav activePhase={activeView} setActivePhase={(id) => { setActiveView(id); setOpen({}); setCompare(null); }} />
            </section>
          </>
        )}
      </main>

      {compare && (
        <ComparePanel compare={compare} onClose={() => setCompare(null)}
          avatars={data.avatars} getFixed={getFixed} setFixed={setFixed}
          getAvatarSlot={getAvatarSlot} setAvatarSlot={setAvatarSlot} />
      )}

      {exportOpen && (
        <ExportModal onClose={() => setExportOpen(false)} data={data}
          projectName={current?.name || "Projet"} chapsDone={chapsDone} />
      )}
      {contentOpen && (
        <ContentModal onClose={() => setContentOpen(false)} data={data}
          projectName={current?.name || "Projet"} />
      )}
      {confirmNode}
      <CopyModal />
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
* { box-sizing: border-box; }
.wrap { --rail:#14211C; --rail2:#1E2E28; --paper:#EEF0EC; --card:#FFFFFF; --ink:#141915; --muted:#5B655E;
  --line:#DCE0DA; --done:#1E8A5C; --accent:#2E7D6B; --warn:#8A5A34; --warnbg:#FAF1E8;
  --badge-fixed:#2E7D6B; --badge-avatar:#1D6FA4; --badge-multi:#B5603A;
  display:flex; min-height:100vh; width:100%; background:var(--paper); font-family:'Inter',system-ui,sans-serif; color:var(--ink); }

/* BADGES */
.badge { font-family:'JetBrains Mono',monospace; font-size:9.5px; font-weight:600; letter-spacing:.05em; padding:2px 8px; border-radius:20px; white-space:nowrap; }
.badge-fixed  { background:#E2F0E9; color:var(--badge-fixed); }
.badge-avatar { background:#DCEEF8; color:var(--badge-avatar); }
.badge-multi  { background:#FAE9DF; color:var(--badge-multi); }

/* RAIL */
.rail{width:280px;flex-shrink:0;background:var(--rail);color:#DfeAe4;padding:20px 16px;display:flex;flex-direction:column;gap:18px;}
.brand{display:flex;gap:11px;align-items:center;}
.brand-mark{font-size:22px;color:#7FD3B4;}
.brand-t{font-family:'Fraunces',serif;font-weight:600;font-size:16px;line-height:1.1;color:#fff;}
.brand-s{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#7E938A;margin-top:2px;}
.lbl{font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:#7E938A;display:block;margin-bottom:5px;}
.proj-sel{width:100%;background:var(--rail2);color:#fff;border:1px solid #2C3E37;border-radius:8px;padding:8px 10px;font-size:13px;font-family:inherit;}
.proj-actions{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px;}
.proj-actions button{background:transparent;border:1px solid #33473F;color:#B9C9C1;border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;font-family:inherit;}
.proj-actions button:hover{background:var(--rail2);color:#fff;}
.proj-actions .danger:hover{background:#3a221a;border-color:#6d3a26;color:#f0b79e;}
.rename{display:flex;gap:6px;margin-top:6px;}
.rename input{flex:1;background:var(--rail2);border:1px solid #33473F;color:#fff;border-radius:6px;padding:5px 8px;font-size:12px;font-family:inherit;}
.rename button{background:#2E7D6B;border:none;color:#fff;border-radius:6px;padding:0 10px;cursor:pointer;font-size:12px;}
.phases{display:flex;flex-direction:column;gap:7px;}
.pnav{text-align:left;background:transparent;border:1px solid transparent;border-radius:10px;padding:10px 11px;cursor:pointer;color:inherit;font-family:inherit;transition:.12s;}
.pnav:hover{background:var(--rail2);}
.pnav.active{background:var(--rail2);border-color:#3B5148;}
.pnav-top{display:flex;justify-content:space-between;align-items:center;}
.pnav-tag{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#7FD3B4;font-weight:600;}
.pnav-count{font-family:'JetBrains Mono',monospace;font-size:11px;color:#8A9C93;}
.pnav-count.ok{color:#7FD3B4;}
.pnav-name{font-size:13px;font-weight:500;margin:3px 0 7px;color:#EAF2EE;}
.pnav-bar{height:3px;background:#2A3B34;border-radius:3px;overflow:hidden;}
.pnav-bar span{display:block;height:100%;background:#7FD3B4;transition:width .3s;}
.terrain-btn{background:#3D5245;color:#fff;border:none;border-radius:9px;padding:11px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;margin-bottom:8px;letter-spacing:.01em;}
.terrain-btn:hover{background:#4A6250;}
.content-btn{background:var(--rail);color:#fff;border:none;border-radius:9px;padding:11px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;margin-bottom:8px;letter-spacing:.01em;}
.content-btn:hover{background:var(--rail2);}
/* SECTION LABELS RAIL */
/* TOOL CARDS (Terrain + Strike) */
.tool-card{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 12px;cursor:pointer;font-family:inherit;transition:all .15s;background:rgba(255,255,255,.05);}
.tool-card:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.18);transform:translateY(-1px);}
.tool-card-icon{font-size:18px;flex-shrink:0;width:28px;text-align:center;}
.tool-card-text{display:flex;flex-direction:column;gap:2px;}
.tool-card-name{font-size:12.5px;font-weight:600;line-height:1.2;}
.tool-card-sub{font-size:10px;opacity:.6;line-height:1.2;}

.tool-terrain{color:#A8D4B8;}
.tool-terrain.active{background:rgba(46,125,107,.25);border-color:#2E7D6B;color:#B8E8CC;box-shadow:0 0 0 1px #2E7D6B inset;}
.tool-terrain:hover{background:rgba(46,125,107,.18);}

.tool-strike{color:#C8AAEE;margin-top:4px;}
.tool-strike.active{background:rgba(90,50,140,.3);border-color:#7A5AAA;color:#DDD0FF;box-shadow:0 0 0 1px #7A5AAA inset;}
.tool-strike:hover{background:rgba(90,50,140,.2);}

/* VIEW — interface pleine page (Terrain + Strike) */
.view-wrap{width:100%;min-height:100%;}
.view-head{padding:0 0 18px 0;border-bottom:1px solid var(--line);margin-bottom:20px;}
.view-head h2{font-family:'Fraunces',serif;font-size:22px;font-weight:700;margin:0 0 4px;}
.view-head p{font-size:13px;color:var(--muted);margin:0;}
.view-title{font-family:'Fraunces',serif;font-size:22px;font-weight:700;}
.view-sub{font-size:13px;color:var(--muted);}

/* STRIKE VIEW layout */
.strike-view{display:flex;flex-direction:column;}
.strike-layout{display:grid;grid-template-columns:200px 1fr 320px;gap:0;flex:1;min-height:0;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--card);}

/* EXAMPLE BLOC */
.strike-example{background:#FFFBEB;border:1px solid #F0E0A0;border-radius:8px;padding:11px 13px;}
.strike-example-label{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9A7A20;margin-bottom:5px;}
.strike-example-text{font-size:13px;color:#5A4A10;font-style:italic;line-height:1.5;}
.export-btn{background:#7FD3B4;color:#0F1D18;border:none;border-radius:9px;padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;}
.export-btn:hover{background:#96DFC4;}

/* STRIKE MODAL */
.strike-cats{border-right:1px solid var(--line);padding:16px 12px;display:flex;flex-direction:column;gap:6px;overflow-y:auto;background:var(--paper);}
.strike-cats-label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:4px;padding:0 4px;}
.strike-cat-btn{display:flex;align-items:center;gap:10px;text-align:left;background:transparent;border:1px solid transparent;border-radius:9px;padding:9px 10px;cursor:pointer;font-family:inherit;color:var(--ink);transition:.12s;}
.strike-cat-btn:hover{background:var(--paper);}
.strike-cat-btn.active{font-weight:600;}
.strike-cat-icon{font-size:16px;flex-shrink:0;}
.strike-cat-name{font-size:12.5px;font-weight:500;line-height:1.2;}
.strike-cat-count{font-size:10.5px;color:var(--muted);margin-top:1px;}
.strike-formulas{border-right:1px solid var(--line);padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;}
.strike-guide-toggle{background:transparent;border:1px solid;border-radius:8px;padding:8px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;text-align:left;}
.strike-guide{border:1px solid;border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:10px;}
.strike-guide-tip{font-size:12.5px;color:var(--ink);line-height:1.55;margin:0;}
.strike-guide-funnel{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.strike-guide-fl{font-size:11px;font-weight:600;color:var(--muted);}
.strike-guide-ftag{font-size:10.5px;font-weight:600;color:#fff;border-radius:20px;padding:2px 10px;}
.strike-guide-usages{display:flex;flex-direction:column;gap:5px;}
.strike-usage{display:flex;align-items:flex-start;gap:8px;font-size:12px;}
.strike-usage-icon{font-size:12px;font-weight:700;flex-shrink:0;margin-top:1px;}
.strike-usage.ok .strike-usage-icon{color:#1A7A4A;}
.strike-usage.nok .strike-usage-icon{color:#C0392B;}
.strike-usage-label{font-weight:500;}
.strike-usage-reason{color:var(--muted);font-style:italic;}
.strike-formula-list{display:flex;flex-direction:column;gap:6px;}
.strike-formula-btn{text-align:left;background:var(--paper);border:1px solid var(--line);border-radius:9px;padding:10px 13px;font-size:12.5px;font-family:'JetBrains Mono',monospace;line-height:1.5;cursor:pointer;color:var(--ink);transition:.12s;}
.strike-formula-btn:hover{background:#E8EDE8;}
.strike-formula-btn.active{font-weight:600;}
.strike-editor{padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;}
.strike-empty{font-size:13px;color:var(--muted);font-style:italic;margin-top:40px;text-align:center;}
.strike-editor-title{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;}
.strike-template{font-family:'JetBrains Mono',monospace;font-size:12px;background:var(--paper);border-radius:8px;padding:12px 14px;line-height:1.6;color:var(--ink);}
.strike-vars{display:flex;flex-direction:column;gap:8px;}
.strike-var-row{display:flex;flex-direction:column;gap:3px;}
.strike-var-label{font-size:10.5px;font-weight:700;font-family:'JetBrains Mono',monospace;color:var(--muted);}
.strike-var-input{border:1px solid var(--line);border-radius:7px;padding:7px 10px;font-size:13px;font-family:inherit;background:#fff;color:var(--ink);outline:none;}
.strike-var-input:focus{border-color:var(--accent);}
.strike-gen-btn{border:none;border-radius:9px;padding:10px 18px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;letter-spacing:.02em;}
.strike-gen-btn:hover{opacity:.88;}
.strike-result{background:var(--paper);border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:8px;}
.strike-result-label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);font-weight:700;}
.strike-result-text{font-size:15px;font-weight:600;line-height:1.5;color:var(--ink);}
.strike-copy-btn{align-self:flex-start;background:var(--accent);color:#fff;border:none;border-radius:7px;padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;}
.strike-copy-btn:hover{opacity:.88;}
@media(max-width:800px){.strike-body{grid-template-columns:1fr;}.strike-cats{flex-direction:row;flex-wrap:wrap;border-right:none;border-bottom:1px solid var(--line);}.strike-modal{max-height:98vh;}}
.rail-foot{margin-top:auto;font-size:11px;color:#6E827A;line-height:1.5;border-top:1px solid #26362F;padding-top:12px;}

/* MAIN */
.main{flex:1;min-width:0;padding:22px 30px 60px;}

/* AVATARS PANEL */
.avatar-panel{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 20px;margin-bottom:18px;}
.avatar-panel-head{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px;}
.avatar-panel-title{font-family:'Fraunces',serif;font-size:16px;font-weight:600;}
.avatar-panel-sub{font-size:12px;color:var(--muted);flex:1;}
.avatar-add-btn{background:var(--rail);color:#fff;border:none;border-radius:8px;padding:7px 13px;font-size:12px;cursor:pointer;font-family:inherit;white-space:nowrap;}
.avatar-add-btn:hover{background:var(--rail2);}
.avatar-empty{font-size:12.5px;color:var(--muted);font-style:italic;}
.avatar-list{display:flex;flex-wrap:wrap;gap:8px;}
.avatar-card{display:flex;align-items:center;gap:8px;background:#F4F7F4;border:1px solid #CDE6D9;border-radius:9px;padding:7px 12px;}
.avatar-name{font-size:13px;font-weight:500;color:var(--accent);cursor:pointer;}
.avatar-name:hover{text-decoration:underline;}
.avatar-inp{border:1px solid var(--accent);border-radius:6px;padding:3px 7px;font-size:13px;font-family:inherit;outline:none;color:var(--ink);}
.avatar-actions{display:flex;gap:4px;}
.avatar-actions button{background:none;border:none;color:#9AA39C;font-size:14px;cursor:pointer;padding:0 2px;}
.avatar-actions button:hover{color:var(--ink);}

/* JAUGE */
.cov{display:flex;align-items:center;gap:20px;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 20px;margin-bottom:22px;}
.cov-num{display:flex;flex-direction:column;flex-shrink:0;}
.cov-big{font-family:'Fraunces',serif;font-weight:700;font-size:38px;line-height:1;letter-spacing:-.02em;}
.cov-slash{color:var(--muted);font-size:20px;font-weight:400;}
.cov-lbl{font-size:11px;color:var(--muted);margin-top:4px;}
.cov-strip{flex:1;display:flex;gap:9px;align-items:center;flex-wrap:wrap;}
.cov-group{display:flex;gap:3px;}
.tick{width:7px;height:24px;border-radius:2px;background:#D7DCD5;transition:.15s;}
.tick.part{background:#A8CDBB;}
.tick.done{background:var(--done);}
.cov-pct{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--accent);font-weight:500;flex-shrink:0;}

/* PHASE */
.phase-head{margin-bottom:18px;}
.phase-tag{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);font-weight:600;}
.phase-name{font-family:'Fraunces',serif;font-weight:600;font-size:27px;line-height:1.1;margin:5px 0 7px;letter-spacing:-.01em;}
.phase-goal{font-size:13.5px;color:var(--muted);max-width:680px;line-height:1.55;margin:0;}

/* STEPS */
.steps{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:9px;}
.step{background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;transition:.15s;}
.step.done{background:#F6FAF7;border-color:#CDE6D9;}
.step.open{border-color:#B9C7BF;box-shadow:0 4px 16px -10px rgba(20,40,32,.3);}
.step-head{display:grid;grid-template-columns:30px 24px 1fr 18px;gap:10px;align-items:center;padding:13px 14px;cursor:pointer;}
.step-idx{font-family:'JetBrains Mono',monospace;font-size:11px;color:#B4BBB3;}
.step.done .step-idx{color:#8FC7AD;}
.chk{width:22px;height:22px;border-radius:6px;border:1.5px solid #C6CDC4;background:#fff;cursor:pointer;color:#fff;font-size:13px;display:flex;align-items:center;justify-content:center;transition:.12s;}
.chk:hover{border-color:var(--accent);}
.chk.on{background:var(--done);border-color:var(--done);}
.step-line1{display:flex;align-items:center;gap:7px;margin-bottom:3px;flex-wrap:wrap;}
.code{font-family:'JetBrains Mono',monospace;font-size:11px;background:#E7EBE5;color:#4C574F;padding:2px 6px;border-radius:5px;}
.code.qa{background:#F1E6DC;color:var(--warn);}
.step-title{font-weight:600;font-size:14.5px;}
.step-produces{font-size:12px;color:var(--muted);line-height:1.4;}
.chev{font-size:17px;color:#9AA39C;transition:.2s;text-align:center;}
.chev.up{transform:rotate(180deg);color:var(--accent);}

/* DETAIL */
.step-detail{padding:15px 14px 17px 50px;border-top:1px solid var(--line);}
.step.done .step-detail{border-color:#CDE6D9;}
.concept{background:#F4F7F4;border-left:3px solid var(--accent);border-radius:0 8px 8px 0;padding:11px 13px;margin-bottom:13px;}
.concept-lbl{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:4px;}
.concept p{margin:0;font-size:13px;line-height:1.6;color:#2B332D;}
.when{font-size:12px;color:var(--muted);margin-bottom:12px;}
.when b{color:#4C574F;font-weight:600;}
.blk-lbl{font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:var(--accent);font-weight:600;margin-bottom:6px;}
.q-list{margin:0 0 12px;padding:0;list-style:none;display:flex;flex-direction:column;gap:5px;}
.q-list li{position:relative;padding-left:14px;font-size:12.5px;line-height:1.5;}
.q-list li::before{content:"";position:absolute;left:0;top:8px;width:4px;height:4px;border-radius:50%;background:var(--accent);}
.errbox{background:var(--warnbg);border:1px solid #EBDCCB;border-radius:8px;padding:8px 11px;margin-bottom:14px;}
.errbox summary{cursor:pointer;font-size:11.5px;font-weight:600;color:var(--warn);}
.errbox ul{margin:7px 0 2px;padding-left:14px;display:flex;flex-direction:column;gap:4px;}
.errbox li{font-size:12px;line-height:1.5;color:#5C4630;}
.linked{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
.linked-lbl{font-size:11px;color:var(--muted);font-weight:600;}
.linkbtn{background:#fff;border:1px dashed #B9C7BF;color:var(--accent);border-radius:20px;padding:3px 10px;font-size:11px;cursor:pointer;font-family:inherit;}
.linkbtn:hover{background:#F0F6F3;border-style:solid;}

/* SELON AVATAR */
.av-section{margin-top:4px;}
.av-tabs{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px;}
.av-tab{background:#fff;border:1px solid var(--line);border-radius:20px;padding:4px 12px;font-size:12px;cursor:pointer;font-family:inherit;color:var(--muted);}
.av-tab.active{background:#DCEEF8;border-color:#7BBBD6;color:var(--badge-avatar);font-weight:600;}
.av-empty{font-size:12.5px;color:var(--muted);font-style:italic;padding:10px 0;}

/* MULTI-INSTANCE */
.multi-section{margin-top:4px;}
.multi-bar{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px;}
.multi-tab{background:#fff;border:1px solid var(--line);border-radius:20px;padding:4px 10px 4px 12px;font-size:12px;cursor:pointer;font-family:inherit;color:var(--muted);display:flex;align-items:center;gap:6px;}
.multi-tab.active{background:#FAE9DF;border-color:#D4956A;color:var(--badge-multi);font-weight:600;}
.multi-del{font-size:14px;color:#C2CAC4;line-height:1;}
.multi-del:hover{color:#B5543A;}
.multi-add{background:none;border:1px dashed #C6CDC4;color:var(--muted);border-radius:20px;padding:4px 12px;font-size:11.5px;cursor:pointer;font-family:inherit;}
.multi-add:hover{border-color:var(--badge-multi);color:var(--badge-multi);}
.piece-label-row{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
.piece-label-lbl{font-size:11.5px;font-weight:600;color:var(--muted);white-space:nowrap;}
.piece-label-inp{flex:1;border:1px solid var(--line);border-radius:7px;padding:6px 10px;font-size:13px;font-family:inherit;}
.piece-label-inp:focus{outline:none;border-color:var(--badge-multi);}

/* CHAMPS */
.fields{display:flex;flex-direction:column;gap:12px;}
.field{display:flex;flex-direction:column;gap:4px;}
.field-lbl{font-size:12px;font-weight:600;color:#3C453E;display:flex;align-items:center;gap:7px;}
.field-hint{font-size:11px;color:#8a9a8d;line-height:1.5;font-style:italic;}
.min{font-style:normal;font-family:'JetBrains Mono',monospace;font-size:10px;color:#A0A9A2;}
.min.ok{color:var(--done);}
.field textarea{width:100%;resize:vertical;border:1px solid var(--line);border-radius:7px;padding:8px 10px;font-family:inherit;font-size:13px;line-height:1.55;color:var(--ink);background:#FBFCFA;}
.field textarea:focus{outline:none;border-color:var(--accent);background:#fff;}
.rep-row{display:grid;grid-template-columns:18px 1fr 20px;gap:6px;align-items:start;}
.rep-idx{font-family:'JetBrains Mono',monospace;font-size:10px;color:#B4BBB3;padding-top:10px;}
.rep-del{background:none;border:none;color:#C2CAC4;font-size:16px;cursor:pointer;padding:5px 0 0;}
.rep-del:hover{color:#B5543A;}
.rep-add{align-self:flex-start;background:none;border:1px dashed #C6CDC4;color:var(--muted);border-radius:6px;padding:4px 10px;font-size:11px;cursor:pointer;font-family:inherit;margin-left:24px;}
.rep-add:hover{border-color:var(--accent);color:var(--accent);}

/* NAV PHASE */
.phase-nav{display:flex;justify-content:space-between;align-items:center;margin-top:22px;gap:10px;}
.phase-nav button{background:#fff;border:1px solid var(--line);border-radius:9px;padding:9px 14px;font-size:13px;cursor:pointer;font-family:inherit;color:var(--ink);}
.phase-nav button:hover{border-color:var(--accent);}
.phase-nav .primary{background:var(--rail);color:#fff;border-color:var(--rail);}
.phase-nav .primary:hover{background:var(--rail2);}
.phase-nav-end{font-size:13px;color:var(--done);font-weight:500;}

/* COMPARE */
.cmp{position:fixed;top:0;right:0;bottom:0;width:min(420px,90vw);background:var(--card);border-left:1px solid var(--line);box-shadow:-12px 0 36px -20px rgba(20,40,32,.45);display:flex;flex-direction:column;z-index:40;}
.cmp-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;padding:16px 18px 12px;border-bottom:1px solid var(--line);}
.cmp-eyebrow{font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:var(--accent);font-weight:600;}
.cmp-head h3{font-family:'Fraunces',serif;font-size:16px;margin:4px 0 0;font-weight:600;display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.cmp-body{padding:14px 18px 28px;overflow-y:auto;}
.cmp-concept{font-size:12px;line-height:1.6;color:var(--muted);background:#F4F7F4;border-radius:8px;padding:10px 12px;margin:0 0 14px;}

/* MODAL */
.modal-bg{position:fixed;inset:0;background:rgba(16,26,22,.55);display:flex;align-items:center;justify-content:center;padding:20px;z-index:50;}
.modal{background:var(--card);border-radius:14px;width:min(840px,100%);max-height:88vh;display:flex;flex-direction:column;overflow:hidden;}
.modal-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:18px 22px 12px;border-bottom:1px solid var(--line);}
.modal-head h2{font-family:'Fraunces',serif;font-size:20px;margin:0 0 4px;font-weight:600;}
.modal-head p{margin:0;font-size:12px;color:var(--muted);max-width:500px;line-height:1.5;}
.modal-x{background:none;border:none;font-size:22px;color:#9AA39C;cursor:pointer;padding:0 2px;}
.modal-x:hover{color:var(--ink);}
.brief{flex:1;overflow-y:auto;margin:0;padding:16px 22px;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.7;white-space:pre-wrap;color:#2B332D;background:#FBFCFA;}
.modal-actions{display:flex;gap:8px;padding:12px 22px;border-top:1px solid var(--line);}
.modal-actions button{background:#fff;border:1px solid var(--line);border-radius:8px;padding:9px 14px;font-size:13px;cursor:pointer;font-family:inherit;}
.modal-actions .primary{background:var(--rail);color:#fff;border-color:var(--rail);}

@media (max-width:840px){
  .wrap{flex-direction:column;}
  .rail{width:100%;}
  .main{padding:16px 12px 48px;}
  .step-head{grid-template-columns:22px 1fr 16px;}
  .step-idx{display:none;}
  .step-detail{padding-left:12px;}
}

/* AVATAR PROGRESS */
.avatar-card{flex-direction:column;align-items:stretch;gap:7px;min-width:190px;}
.avatar-card-top{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.avatar-prog{display:flex;align-items:center;gap:8px;}
.avatar-prog-bar{flex:1;height:4px;background:#D7DCD5;border-radius:3px;overflow:hidden;}
.avatar-prog-bar span{display:block;height:100%;background:var(--badge-avatar);transition:width .3s;}
.avatar-prog-txt{font-family:'JetBrains Mono',monospace;font-size:10px;color:#96A099;}
.avatar-prog-txt.ok{color:var(--done);}

/* EXPORT PARAMS */
.exp-params{flex:1;overflow-y:auto;padding:18px 22px;display:flex;flex-direction:column;gap:20px;}
.exp-block{display:flex;flex-direction:column;gap:9px;}
.exp-lbl{font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:var(--accent);font-weight:700;}
.exp-chips{display:flex;flex-wrap:wrap;gap:7px;}
.exp-chip{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line);border-radius:20px;padding:5px 13px;font-size:12.5px;cursor:pointer;background:#fff;color:var(--muted);user-select:none;}
.exp-chip input{margin:0;cursor:pointer;accent-color:var(--accent);}
.exp-chip.on{font-weight:600;}
.exp-chip.chip-fixed.on{background:#E2F0E9;border-color:#9CC9B5;color:var(--badge-fixed);}
.exp-chip.chip-avatar.on{background:#DCEEF8;border-color:#7BBBD6;color:var(--badge-avatar);}
.exp-chip.chip-multi.on{background:#FAE9DF;border-color:#D4956A;color:var(--badge-multi);}
.exp-sub{margin-top:9px;}
.exp-sub-lbl{font-size:11.5px;font-weight:600;color:#4C574F;margin-bottom:6px;}

/* GÉNÉRATEUR DE CONTENU */
.modal-wide{width:min(920px,100%);}
.gen-body{flex:1;overflow-y:auto;padding:18px 22px;display:flex;flex-direction:column;gap:22px;}
.gen-step{display:flex;flex-direction:column;gap:10px;}
.gen-lbl{font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:var(--accent);font-weight:700;}
.gen-platforms{display:flex;flex-wrap:wrap;gap:8px;}
.gen-note{font-size:11.5px;color:var(--muted);line-height:1.5;background:#F6F5EF;border-left:2px solid var(--accent);padding:7px 11px;border-radius:0 6px 6px 0;margin-top:2px;}
.gen-formats{display:flex;flex-wrap:wrap;gap:7px;}
.gen-format{border:1px solid var(--line);background:#fff;border-radius:8px;padding:7px 13px;font-size:12.5px;font-weight:500;cursor:pointer;font-family:inherit;color:#4C574F;transition:all .15s;}
.gen-format:hover{border-color:var(--rail);}
.gen-format.on{background:#EDF4F0;border-color:var(--rail);color:var(--rail);font-weight:600;}
.gen-plat{border:1px solid var(--line);background:#fff;border-radius:9px;padding:9px 16px;font-size:13.5px;font-weight:500;cursor:pointer;font-family:inherit;color:#4C574F;transition:all .15s;}
.gen-plat:hover{border-color:var(--rail);}
.gen-plat.on{background:var(--rail);border-color:var(--rail);color:#fff;font-weight:600;}
/* SÉLECTEUR D'INGRÉDIENTS */
.gen-ingredients{display:flex;flex-direction:column;gap:14px;margin-top:6px;}
.gen-ingredient{display:flex;flex-direction:column;gap:6px;}
.gen-ingredient-label{font-size:11.5px;font-weight:700;color:var(--accent);letter-spacing:.02em;}
.gen-ingredient-empty{font-weight:400;color:var(--muted);font-style:italic;}
.gen-ingredient-options{display:flex;flex-direction:column;gap:4px;}
.gen-ingredient-opt{display:flex;flex-direction:column;gap:3px;text-align:left;background:#fff;border:1px solid var(--line);border-radius:8px;padding:8px 12px;font-size:12px;font-family:inherit;cursor:pointer;color:var(--ink);line-height:1.5;transition:.12s;}
.gen-ingredient-from{font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);}
.gen-ingredient-opt.on .gen-ingredient-from{color:var(--accent);}
.gen-ingredient-text{font-size:12px;line-height:1.5;}
.gen-ingredient-opt:hover{border-color:var(--accent);background:#F4FAF7;}
.gen-ingredient-opt.on{background:#E4F4EC;border-color:var(--accent);color:#1A5C38;font-weight:600;}
.gen-axis-tag{display:inline-block;font-size:10px;letter-spacing:.07em;text-transform:uppercase;font-weight:700;padding:3px 9px;border-radius:5px;margin-bottom:8px;}
.axis-conversion{background:#FAE9DF;color:var(--badge-multi);}
.axis-awareness{background:#DCEEF8;color:var(--badge-avatar);}
.axis-nurture{background:#E2F0E9;color:var(--badge-fixed);}
.gen-schemas{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.gen-schema{text-align:left;border:1px solid var(--line);background:#fff;border-radius:10px;padding:11px 13px;cursor:pointer;font-family:inherit;transition:all .15s;display:flex;flex-direction:column;gap:4px;}
.gen-schema:hover{border-color:var(--rail);background:#FBFCFA;}
.gen-schema.on{border-color:var(--rail);border-width:1.5px;background:#F2F8F5;}
.gen-schema-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;}
.gen-schema-name{font-size:13px;font-weight:600;color:var(--ink);line-height:1.3;}
.gen-schema-desc{font-size:11.5px;color:var(--muted);line-height:1.45;}
.gen-ready{flex-shrink:0;font-family:'JetBrains Mono',monospace;font-size:10px;padding:2px 6px;border-radius:5px;font-weight:500;}
.gen-ready.ok{background:#DDF0E7;color:var(--done);}
.gen-ready.part{background:#FBF0DC;color:#B07D2E;}
.gen-ready.empty{background:#EFEDE6;color:#9AA39C;}
.gen-avatars,.gen-outmode{display:flex;flex-wrap:wrap;gap:8px;}
.gen-av{border:1px solid var(--line);background:#fff;border-radius:20px;padding:6px 15px;font-size:12.5px;cursor:pointer;font-family:inherit;color:var(--muted);transition:all .15s;}
.gen-av:hover{border-color:var(--badge-avatar);}
.gen-av.on{background:#DCEEF8;border-color:#7BBBD6;color:var(--badge-avatar);font-weight:600;}
.gen-outmode{gap:10px;}
.gen-out{flex:1;min-width:200px;text-align:left;border:1px solid var(--line);background:#fff;border-radius:10px;padding:12px 14px;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;gap:3px;transition:all .15s;}
.gen-out:hover{border-color:var(--rail);}
.gen-out.on{border-color:var(--rail);border-width:1.5px;background:#F2F8F5;}
.gen-out-name{font-size:13px;font-weight:600;color:var(--ink);}
.gen-out-desc{font-size:11.5px;color:var(--muted);line-height:1.4;}
.modal-actions button:disabled{opacity:.45;cursor:not-allowed;}
@media (max-width:840px){.gen-schemas{grid-template-columns:1fr;}}

/* TERRAIN MODAL */
.modal-tall{max-height:88vh;}
.terr-tabs{display:flex;flex-wrap:wrap;gap:4px;padding:0 22px;border-bottom:1px solid var(--line);}
.terr-tab{background:none;border:none;border-bottom:2px solid transparent;padding:10px 12px;font-size:12.5px;font-weight:500;color:var(--muted);cursor:pointer;font-family:inherit;margin-bottom:-1px;}
.terr-tab:hover{color:var(--ink);}
.terr-tab.on{color:var(--rail);border-bottom-color:var(--rail);font-weight:600;}
.terr-body{gap:20px;}
.terr-gauges{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.terr-gauge{border:1px solid var(--line);border-radius:10px;padding:12px 14px;background:#fff;}
.terr-gauge-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:7px;}
.terr-gauge-label{font-size:12px;font-weight:600;color:var(--ink);}
.terr-gauge-val{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:#B07D2E;}
.terr-gauge-val.ok{color:var(--done);}
.terr-gauge-target{font-weight:400;color:var(--muted);font-size:11px;}
.terr-gauge-bar{height:5px;border-radius:3px;background:#EFEDE6;overflow:hidden;}
.terr-gauge-fill{height:100%;background:#B07D2E;border-radius:3px;transition:width .2s;}
.terr-gauge.ok .terr-gauge-fill,.terr-gauge-val.ok ~ .terr-gauge-bar .terr-gauge-fill{background:var(--done);}
.terr-gauge-hint{font-size:11px;color:var(--muted);margin-top:6px;line-height:1.4;}
.terr-step{display:flex;flex-direction:column;gap:8px;}
.terr-qcard{border:1px solid var(--line);border-radius:10px;padding:13px 15px;background:#fff;}
.terr-q{font-size:13px;color:var(--ink);line-height:1.6;}
.terr-protocol{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:7px;}
.terr-protocol li{font-size:13px;color:var(--ink);line-height:1.5;}
.terr-canal-tabs{display:flex;gap:8px;}
.terr-canal{border:1px solid var(--line);background:#fff;border-radius:8px;padding:8px 14px;font-size:12.5px;font-weight:500;cursor:pointer;font-family:inherit;color:#4C574F;}
.terr-canal.on{background:var(--rail);border-color:var(--rail);color:#fff;font-weight:600;}
.terr-canal-n{font-family:'JetBrains Mono',monospace;font-size:11px;opacity:.75;margin-left:4px;}
.terr-card{border:1px solid var(--line);border-radius:10px;padding:13px 15px;background:#fff;display:flex;flex-direction:column;gap:8px;}
.terr-card-head{display:flex;align-items:center;gap:8px;}
.terr-card-title{font-size:12.5px;font-weight:700;color:var(--ink);white-space:nowrap;}
.terr-date{width:110px;border:1px solid var(--line);border-radius:6px;padding:6px 9px;font-size:12px;font-family:inherit;}
.terr-input{width:100%;border:1px solid var(--line);border-radius:6px;padding:7px 10px;font-size:12.5px;font-family:inherit;color:var(--ink);}
.terr-textarea{width:100%;border:1px solid var(--line);border-radius:6px;padding:8px 10px;font-size:12.5px;font-family:inherit;color:var(--ink);min-height:52px;resize:vertical;}
.terr-del{background:none;border:1px solid #E3C7C7;color:#A85454;border-radius:6px;padding:6px 10px;font-size:11.5px;cursor:pointer;font-family:inherit;white-space:nowrap;}
.terr-del:hover{background:#FBEDED;}
.terr-del-sm{background:none;border:none;color:#A85454;font-size:16px;cursor:pointer;line-height:1;padding:0 6px;}
.terr-add{align-self:flex-start;border:1px dashed var(--rail);background:none;color:var(--rail);border-radius:8px;padding:9px 15px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit;}
.terr-add:hover{background:#F2F8F5;}
.terr-sondage-actions{display:flex;flex-wrap:wrap;gap:8px;}
.terr-sondage-actions button,.terr-upload{border:1px solid var(--line);background:#fff;border-radius:8px;padding:8px 13px;font-size:12.5px;cursor:pointer;font-family:inherit;color:var(--ink);}
.terr-sondage-actions button:hover,.terr-upload:hover{border-color:var(--rail);}
.terr-sondage-actions button:disabled{opacity:.45;cursor:not-allowed;}
.terr-upload{display:inline-block;}
.terr-table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:10px;}
.terr-table{width:100%;border-collapse:collapse;font-size:12px;}
.terr-table th{background:#F6F5EF;text-align:left;padding:8px 9px;font-weight:600;color:#4C574F;white-space:nowrap;border-bottom:1px solid var(--line);}
.terr-table td{padding:4px 6px;border-bottom:1px solid #F0EEE7;}
.terr-table td input{width:100%;border:none;background:none;font-size:12px;font-family:inherit;padding:4px 5px;border-radius:4px;}
.terr-table td input:focus{background:#F2F8F5;outline:none;}
.terr-table tr.terr-ultra{background:#FBF6E9;}
.terr-ultra-tag{color:#B07D2E;}
.terr-charcount{font-family:'JetBrains Mono',monospace;color:var(--muted);text-align:right;}
.terr-empty{font-size:12.5px;color:var(--muted);padding:14px;text-align:center;border:1px dashed var(--line);border-radius:10px;}
.terr-tagcloud{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;border:1px solid var(--line);border-radius:10px;padding:14px;background:#fff;}
.terr-tagchip{background:#EDF4F0;color:var(--rail);border-radius:6px;padding:3px 9px;font-weight:600;white-space:nowrap;}
.terr-tagchip b{font-weight:700;opacity:.6;margin-left:3px;}
.terr-vocab-row{display:flex;align-items:center;gap:8px;}
@media (max-width:760px){.terr-gauges{grid-template-columns:1fr;}}


/* CONFIRM MODAL */
.confirm-bg{position:fixed;inset:0;background:rgba(16,26,22,.6);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;}
.confirm-box{background:#fff;border-radius:14px;padding:26px 28px;max-width:360px;width:100%;box-shadow:0 20px 60px -10px rgba(0,0,0,.3);}
.confirm-msg{font-size:15px;font-weight:500;color:var(--ink);margin:0 0 22px;line-height:1.5;}
.confirm-actions{display:flex;gap:10px;justify-content:flex-end;}
.confirm-cancel{background:#fff;border:1px solid var(--line);border-radius:9px;padding:9px 18px;font-size:13px;cursor:pointer;font-family:inherit;color:var(--muted);}
.confirm-cancel:hover{border-color:var(--accent);color:var(--ink);}
.confirm-ok{background:#C0392B;border:none;border-radius:9px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;color:#fff;}
.confirm-ok:hover{background:#A93226;}


/* EXEMPLES CONCRETS (repliable, fermé par défaut) */
.exbox{background:#F5F3EE;border:1px solid #E2DCC9;border-radius:9px;padding:9px 12px;margin-bottom:16px;}
.exbox summary{cursor:pointer;font-size:12px;font-weight:600;color:#8A6D2E;list-style:none;display:flex;align-items:center;gap:6px;}
.exbox summary::-webkit-details-marker{display:none;}
.exbox summary::before{content:"▸";font-size:10px;transition:transform .15s;color:#B39457;}
.exbox[open] summary::before{transform:rotate(90deg);}
.ex-list{margin-top:11px;display:flex;flex-direction:column;gap:12px;}
.ex-item{background:#fff;border:1px solid #EAE4D3;border-radius:8px;padding:10px 13px;}
.ex-item.ex-long{border-left:3px solid #B39457;}
.ex-title{font-size:12.5px;font-weight:700;color:#3C3626;margin-bottom:5px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.ex-badge{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;background:#F1E6D0;color:#8A6D2E;padding:1px 7px;border-radius:20px;}
.ex-text{font-size:12.5px;line-height:1.65;color:#4A4536;margin:0;}

`;
