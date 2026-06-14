import { getToken } from './auth'

const BASE_URL = '/api'

const fmt = (d) => d

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...authHeaders(), ...options.headers },
      ...options,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  } catch {
    return null
  }
}

// Mock data

const MOCK_COURSES = [
  {
    _id: 'c1',
    title: 'Les Règles du Basketball',
    description: 'Maîtrise les règles fondamentales du basketball : terrain, joueurs, fautes, temps de jeu et violations.',
    icon: '',
    color: '#e74c3c',
    lessonsCount: 4,
    quizzesCount: 2,
    totalLessons: 4,
    completedLessons: 3,
  },
  {
    _id: 'c2',
    title: 'Techniques de Dribble',
    description: 'Apprends les techniques essentielles du dribble : crossover, between legs, behind the back et speed dribble.',
    icon: '',
    color: '#e67e22',
    lessonsCount: 5,
    quizzesCount: 2,
    totalLessons: 5,
    completedLessons: 2,
  },
  {
    _id: 'c3',
    title: 'Techniques de Shooting',
    description: 'Perfectionne ton shoot : forme, footwork, catch-and-shoot, pull-up jumper et tirs à 3 points.',
    icon: '',
    color: '#27ae60',
    lessonsCount: 4,
    quizzesCount: 2,
    totalLessons: 4,
    completedLessons: 1,
  },
  {
    _id: 'c4',
    title: 'Stratégies Défensives',
    description: 'Comprends et applique les principes défensifs : man-to-man, zone defense, press defense et rotations.',
    icon: '',
    color: '#2980b9',
    lessonsCount: 4,
    quizzesCount: 1,
    totalLessons: 4,
    completedLessons: 0,
  },
  {
    _id: 'c5',
    title: 'Tactiques et Systèmes de Jeu',
    description: 'Explore les systèmes offensifs et défensifs : pick and roll, motion offense, zone offense et fast break.',
    icon: '',
    color: '#8e44ad',
    lessonsCount: 5,
    quizzesCount: 2,
    totalLessons: 5,
    completedLessons: 0,
  },
]

const MOCK_LESSONS = {
  c1: [
    {
      _id: 'l1',
      courseId: 'c1',
      title: 'Introduction : le terrain et les joueurs',
      order: 1,
      availableAt: fmt('2026-01-10'),
      completed: true,
      content: `
<h2>Le terrain de basketball</h2>
<p>Un terrain officiel NBA mesure <strong>28 mètres × 15 mètres</strong>. Il est divisé en deux moitiés symétriques par la ligne médiane.</p>
<h3>Les zones importantes</h3>
<ul>
  <li><strong>La raquette (paint)</strong> : zone rectangulaire devant le panier, limitée à 3 secondes pour les attaquants.</li>
  <li><strong>La ligne des 3 points</strong> : à 7,24 m en NBA (6,75 m en FIBA). Un tir réussi depuis l'extérieur vaut 3 points.</li>
  <li><strong>La ligne de lancer-franc</strong> : à 4,57 m du panier. Un lancer réussi vaut 1 point.</li>
</ul>
<h3>Les 5 positions</h3>
<table class="table table-bordered">
  <thead><tr><th>N°</th><th>Poste</th><th>Rôle principal</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Meneur (Point Guard)</td><td>Organise le jeu, distribue le ballon</td></tr>
    <tr><td>2</td><td>Arrière (Shooting Guard)</td><td>Shooteur extérieur, marqueur</td></tr>
    <tr><td>3</td><td>Ailier (Small Forward)</td><td>Polyvalent, attaque et défense</td></tr>
    <tr><td>4</td><td>Ailier fort (Power Forward)</td><td>Jeu intérieur, rebonds</td></tr>
    <tr><td>5</td><td>Pivot (Center)</td><td>Présence dans la raquette, pivot défensif</td></tr>
  </tbody>
</table>
<div class="alert alert-info"><strong>À retenir :</strong> Chaque équipe aligne 5 joueurs sur le terrain. Les remplaçants peuvent entrer en jeu à chaque arrêt de jeu.</div>
      `,
    },
    {
      _id: 'l2',
      courseId: 'c1',
      title: 'Le temps de jeu et le score',
      order: 2,
      availableAt: fmt('2026-01-17'),
      completed: true,
      content: `
<h2>Structure d'un match</h2>
<p>Un match de basketball officiel FIBA se joue en <strong>4 quarts-temps de 10 minutes</strong> (12 min en NBA).</p>
<h3>Valeur des paniers</h3>
<ul>
  <li><strong>Panier en jeu sous la ligne des 3 pts</strong> : 2 points</li>
  <li><strong>Panier au-delà de la ligne des 3 pts</strong> : 3 points</li>
  <li><strong>Lancer-franc réussi</strong> : 1 point</li>
</ul>
<h3>Les temps morts</h3>
<p>Chaque équipe dispose de <strong>2 temps morts par mi-temps</strong> (FIBA) ou 7 par match (NBA). Un temps mort dure 60 secondes.</p>
<div class="alert alert-warning"><strong>Prolongations :</strong> En cas d'égalité à la fin du temps réglementaire, des prolongations de 5 minutes sont jouées jusqu'à départage des équipes.</div>
      `,
    },
    {
      _id: 'l3',
      courseId: 'c1',
      title: 'Les violations et les fautes',
      order: 3,
      availableAt: fmt('2026-01-24'),
      completed: true,
      content: `
<h2>Violations</h2>
<p>Une violation entraîne une remise en jeu adverse, sans lancer-franc.</p>
<ul>
  <li><strong>Marcher (traveling)</strong> : plus de 2 pas sans dribbler</li>
  <li><strong>Double dribble</strong> : reprendre le dribble après l'avoir arrêté</li>
  <li><strong>3 secondes</strong> : rester plus de 3 s dans la raquette adverse</li>
  <li><strong>8 secondes</strong> : ne pas dépasser la mi-terrain en 8 s</li>
  <li><strong>24 secondes</strong> : ne pas tirer dans les 24 s (possession clock)</li>
</ul>
<h2>Les fautes</h2>
<p>Un joueur est exclu après <strong>5 fautes personnelles</strong> (6 en NBA).</p>
<ul>
  <li><strong>Faute personnelle</strong> : contact illégal sur un adversaire</li>
  <li><strong>Faute technique</strong> : comportement antisportif, sans contact physique direct</li>
  <li><strong>Faute flagrante</strong> : contact excessif et délibéré</li>
</ul>
<div class="alert alert-danger"><strong>Bonus :</strong> À partir de la 5e faute d'équipe par quart-temps, chaque faute suivante accorde 2 lancers-francs à l'adversaire.</div>
      `,
    },
    {
      _id: 'l4',
      courseId: 'c1',
      title: 'Les règles spéciales avancées',
      order: 4,
      availableAt: fmt('2026-07-01'),
      completed: false,
      content: '',
    },
  ],
  c2: [
    {
      _id: 'l5',
      courseId: 'c2',
      title: 'Bases du dribble et position du corps',
      order: 1,
      availableAt: fmt('2026-01-15'),
      completed: true,
      content: `
<h2>Les fondamentaux du dribble</h2>
<p>Le dribble est la seule façon légale de se déplacer avec le ballon. Maîtriser le dribble est essentiel pour tout joueur.</p>
<h3>Position de base</h3>
<ul>
  <li>Pieds écartés à la largeur des épaules</li>
  <li>Genoux légèrement fléchis (attitude athlétique)</li>
  <li>Dos droit, regard vers le terrain (pas vers le ballon !)</li>
  <li>Main sur le côté du ballon, pas dessus</li>
</ul>
<h3>Les types de dribble</h3>
<table class="table table-striped">
  <thead><tr><th>Type</th><th>Utilisation</th></tr></thead>
  <tbody>
    <tr><td>Dribble haut (speed)</td><td>Monter la balle rapidement en transition</td></tr>
    <tr><td>Dribble bas (protection)</td><td>Conserver le ballon sous pression défensive</td></tr>
    <tr><td>Dribble en puissance</td><td>Pénétrer et attaquer le panier</td></tr>
  </tbody>
</table>
<div class="alert alert-success"><strong>Exercice :</strong> Pratique le dribble dans un miroir pour corriger ta position sans regarder le ballon.</div>
      `,
    },
    {
      _id: 'l6',
      courseId: 'c2',
      title: 'Le crossover et ses variantes',
      order: 2,
      availableAt: fmt('2026-02-01'),
      completed: true,
      content: `
<h2>Le Crossover</h2>
<p>Le crossover est le changement de main le plus basique et le plus efficace pour éliminer un défenseur.</p>
<h3>Technique</h3>
<ol>
  <li>Dribble de la main droite, penche le corps à droite pour attirer le défenseur</li>
  <li>Croise rapidement le ballon devant toi vers la main gauche</li>
  <li>Accélère immédiatement dans la direction opposée</li>
</ol>
<h3>Variantes avancées</h3>
<ul>
  <li><strong>In-and-out</strong> : simuler un crossover sans changer de main</li>
  <li><strong>Hesitation (hesi)</strong> : marquer un temps d'arrêt pour déséquilibrer le défenseur</li>
  <li><strong>Allen Iverson crossover</strong> : crossover bas et explosif, signature move légendaire</li>
</ul>
<div class="alert alert-info"><strong>Conseil :</strong> La clé d'un bon crossover est la <em>feinte</em> avant le geste, pas la vitesse du geste lui-même.</div>
      `,
    },
    {
      _id: 'l7',
      courseId: 'c2',
      title: 'Between the legs et Behind the back',
      order: 3,
      availableAt: fmt('2026-02-15'),
      completed: false,
      content: `
<h2>Between the Legs</h2>
<p>Le dribble entre les jambes protège le ballon et change de direction de façon inattendue.</p>
<h3>Exécution</h3>
<ol>
  <li>Avance le pied du côté de ta main de dribble</li>
  <li>Croise le ballon entre tes deux jambes</li>
  <li>Récupère avec la main opposée</li>
  <li>Accélère dans la nouvelle direction</li>
</ol>
<h2>Behind the Back</h2>
<p>Le dribble derrière le dos surprend le défenseur et protège le ballon.</p>
<div class="alert alert-warning">Ces mouvements nécessitent une pratique intensive. Commence lentement, puis augmente la vitesse progressivement.</div>
      `,
    },
    {
      _id: 'l8',
      courseId: 'c2',
      title: 'Dribble en situation de match',
      order: 4,
      availableAt: fmt('2026-03-01'),
      completed: false,
      content: '',
    },
    {
      _id: 'l9',
      courseId: 'c2',
      title: 'Exercices et drill de dribble avancés',
      order: 5,
      availableAt: fmt('2026-07-15'),
      completed: false,
      content: '',
    },
  ],
  c3: [
    {
      _id: 'l10',
      courseId: 'c3',
      title: 'La mécanique du shoot',
      order: 1,
      availableAt: fmt('2026-02-01'),
      completed: true,
      content: `
<h2>BEEF : La formule du parfait shooteur</h2>
<p><strong>BEEF</strong> est un acronyme pour mémoriser les 4 éléments clés du shoot :</p>
<ul>
  <li><strong>B</strong> - Balance (équilibre) : pieds à la largeur des épaules, légèrement vers le panier</li>
  <li><strong>E</strong> - Eyes (regard) : vise le bord avant ou arrière du panier, pas le ballon</li>
  <li><strong>E</strong> - Elbow (coude) : coude sous le ballon, aligné avec le panier</li>
  <li><strong>F</strong> - Follow-through (finition) : étends le bras, claque le poignet vers le bas</li>
</ul>
<h3>La main directrice vs la main guide</h3>
<p>La <strong>main directrice</strong> (dominante) propulse le ballon. La <strong>main guide</strong> soutient le ballon sur le côté et ne participe pas au tir.</p>
<div class="alert alert-success"><strong>Exercice HORSE</strong> : Joue au HORSE avec un partenaire pour travailler des tirs variés dans un contexte ludique.</div>
      `,
    },
    {
      _id: 'l11',
      courseId: 'c3',
      title: 'Catch-and-shoot et pull-up jumper',
      order: 2,
      availableAt: fmt('2026-02-20'),
      completed: false,
      content: `
<h2>Catch-and-Shoot</h2>
<p>Le catch-and-shoot est l'acte de recevoir la passe et tirer immédiatement, sans dribble.</p>
<h3>Clés du catch-and-shoot</h3>
<ul>
  <li>Être prêt à tirer <em>avant</em> de recevoir la balle</li>
  <li>Hands ready : mains à hauteur de la ceinture, prêtes à catcher</li>
  <li>Pivot vers le panier simultanément à la réception</li>
  <li>Shot fake optionnel si le défenseur arrive</li>
</ul>
<h2>Pull-Up Jumper</h2>
<p>Le pull-up est un tir pris en sortie de dribble, après un arrêt brusque.</p>
<div class="alert alert-info"><strong>Stars à étudier :</strong> Stephen Curry (catch-and-shoot), Devin Booker (pull-up jumper).</div>
      `,
    },
    {
      _id: 'l12',
      courseId: 'c3',
      title: 'Le tir à 3 points',
      order: 3,
      availableAt: fmt('2026-07-10'),
      completed: false,
      content: '',
    },
    {
      _id: 'l13',
      courseId: 'c3',
      title: 'Lancer-franc : répétition et mental',
      order: 4,
      availableAt: fmt('2026-08-01'),
      completed: false,
      content: '',
    },
  ],
  c4: [
    {
      _id: 'l14',
      courseId: 'c4',
      title: 'Principes défensifs fondamentaux',
      order: 1,
      availableAt: fmt('2026-03-01'),
      completed: false,
      content: `
<h2>L'état d'esprit défensif</h2>
<p>La défense gagne les championnats. Un bon défenseur doit avoir :</p>
<ul>
  <li><strong>Position athlétique</strong> : pieds écartés, genoux fléchis, mains actives</li>
  <li><strong>Pieds actifs</strong> : se déplacer en shuffle steps, ne jamais croiser les pieds</li>
  <li><strong>Anticipation</strong> : lire les intentions de l'attaquant</li>
  <li><strong>Communication</strong> : appeler les écrans, les rotations</li>
</ul>
<h3>Man-to-man defense</h3>
<p>Chaque défenseur est responsable d'un attaquant spécifique.</p>
<div class="alert alert-primary"><strong>Règle d'or :</strong> Toujours voir son adversaire ET le ballon simultanément.</div>
      `,
    },
    {
      _id: 'l15',
      courseId: 'c4',
      title: 'Zone Defense : 2-3 et 3-2',
      order: 2,
      availableAt: fmt('2026-07-20'),
      completed: false,
      content: '',
    },
    {
      _id: 'l16',
      courseId: 'c4',
      title: 'Défense sur les écrans',
      order: 3,
      availableAt: fmt('2026-08-10'),
      completed: false,
      content: '',
    },
    {
      _id: 'l17',
      courseId: 'c4',
      title: 'Press defense et trap',
      order: 4,
      availableAt: fmt('2026-09-01'),
      completed: false,
      content: '',
    },
  ],
  c5: [
    {
      _id: 'l18',
      courseId: 'c5',
      title: 'Le Pick and Roll',
      order: 1,
      availableAt: fmt('2026-04-01'),
      completed: false,
      content: `
<h2>Pick and Roll</h2>
<p>Le pick and roll (ou écran-remontée) est l'action offensive la plus courante en basketball moderne.</p>
<h3>Comment ça fonctionne</h3>
<ol>
  <li><strong>Poseur d'écran</strong> : s'immobilise face au défenseur du meneur</li>
  <li><strong>Meneur</strong> : utilise l'écran en dribblant près du poseur</li>
  <li><strong>Poseur</strong> : "roule" vers le panier après l'écran</li>
  <li><strong>Meneur</strong> : passe au poseur si son défenseur est bloqué, ou attaque si dégagé</li>
</ol>
<div class="alert alert-success"><strong>Duo légendaire :</strong> John Stockton et Karl Malone ont révolutionné le pick and roll dans les années 90.</div>
      `,
    },
    {
      _id: 'l19',
      courseId: 'c5',
      title: 'Motion Offense',
      order: 2,
      availableAt: fmt('2026-07-25'),
      completed: false,
      content: '',
    },
    {
      _id: 'l20',
      courseId: 'c5',
      title: 'Fast Break et transition',
      order: 3,
      availableAt: fmt('2026-08-15'),
      completed: false,
      content: '',
    },
    {
      _id: 'l21',
      courseId: 'c5',
      title: 'Triangle Offense et systèmes Princeton',
      order: 4,
      availableAt: fmt('2026-09-05'),
      completed: false,
      content: '',
    },
    {
      _id: 'l22',
      courseId: 'c5',
      title: 'Analyse vidéo : lire une défense',
      order: 5,
      availableAt: fmt('2026-09-20'),
      completed: false,
      content: '',
    },
  ],
}

const MOCK_QUIZZES = {
  c1: [
    {
      _id: 'q1',
      courseId: 'c1',
      title: 'Quiz : Règles fondamentales',
      passingScore: 70,
      questions: [
        {
          _id: 'qq1',
          text: 'Combien de joueurs une équipe aligne-t-elle sur le terrain simultanément ?',
          options: ['4 joueurs', '5 joueurs', '6 joueurs', '7 joueurs'],
          correctAnswers: ['5 joueurs'],
        },
        {
          _id: 'qq2',
          text: 'Combien de points vaut un panier réussi depuis l\'arc des 3 points ?',
          options: ['1 point', '2 points', '3 points', '4 points'],
          correctAnswers: ['3 points'],
        },
        {
          _id: 'qq3',
          text: 'Qu\'est-ce qu\'une violation de "24 secondes" ?',
          options: [
            'Ne pas passer à un coéquipier en 24 s',
            'Ne pas tenter un tir en 24 s de possession',
            'Rester dans la raquette 24 s',
            'Dépasser la mi-terrain en 24 s',
          ],
          correctAnswers: ['Ne pas tenter un tir en 24 s de possession'],
        },
        {
          _id: 'qq4',
          text: 'À partir de quelle faute d\'équipe par quart-temps l\'adversaire obtient-il des lancers-francs ?',
          options: ['3e faute', '4e faute', '5e faute', '6e faute'],
          correctAnswers: ['5e faute'],
        },
        {
          _id: 'qq5',
          text: 'Combien de temps un joueur a-t-il pour dépasser la ligne médiane ?',
          options: ['5 secondes', '8 secondes', '10 secondes', '24 secondes'],
          correctAnswers: ['8 secondes'],
        },
      ],
    },
    {
      _id: 'q2',
      courseId: 'c1',
      title: 'Quiz : Fautes et violations',
      passingScore: 60,
      questions: [
        {
          _id: 'qq6',
          text: 'Un joueur est exclu après combien de fautes personnelles en FIBA ?',
          options: ['4 fautes', '5 fautes', '6 fautes', '7 fautes'],
          correctAnswers: ['5 fautes'],
        },
        {
          _id: 'qq7',
          text: 'Qu\'est-ce que le "traveling" ?',
          options: [
            'Dribbler avec les deux mains',
            'Se déplacer sans dribbler (plus de 2 pas)',
            'Rester dans la raquette adverse',
            'Tirer hors des limites du terrain',
          ],
          correctAnswers: ['Se déplacer sans dribbler (plus de 2 pas)'],
        },
        {
          _id: 'qq8',
          text: 'Quelle est la durée d\'un quart-temps en FIBA ?',
          options: ['8 minutes', '10 minutes', '12 minutes', '15 minutes'],
          correctAnswers: ['10 minutes'],
        },
      ],
    },
  ],
  c2: [
    {
      _id: 'q3',
      courseId: 'c2',
      title: 'Quiz : Techniques de dribble',
      passingScore: 70,
      questions: [
        {
          _id: 'qq9',
          text: 'Qu\'est-ce qu\'un "crossover" ?',
          options: [
            'Un dribble entre les jambes',
            'Un changement de main du ballon devant soi',
            'Un dribble derrière le dos',
            'Un arrêt brusque en dribble',
          ],
          correctAnswers: ['Un changement de main du ballon devant soi'],
        },
        {
          _id: 'qq10',
          text: 'Dans quelle position doit être le regard du dribbleur ?',
          options: [
            'Vers le sol pour suivre le ballon',
            'Vers le ciel pour anticiper les passes',
            'Vers le terrain pour lire le jeu',
            'Vers son propre panier',
          ],
          correctAnswers: ['Vers le terrain pour lire le jeu'],
        },
        {
          _id: 'qq11',
          text: 'Qu\'est-ce que la "hesitation" au dribble ?',
          options: [
            'Dribbler plus lentement que d\'habitude',
            'Un faux-semblant avant un changement de rythme',
            'Arrêter le dribble pour observer',
            'Dribbler derrière le dos',
          ],
          correctAnswers: ['Un faux-semblant avant un changement de rythme'],
        },
        {
          _id: 'qq12',
          text: 'Le "between the legs" consiste à dribbler :',
          options: [
            'Derrière le dos',
            'Avec les deux mains',
            'Entre les deux jambes',
            'Au-dessus de la tête',
          ],
          correctAnswers: ['Entre les deux jambes'],
        },
      ],
    },
  ],
  c3: [
    {
      _id: 'q4',
      courseId: 'c3',
      title: 'Quiz : Mécanique du shoot',
      passingScore: 70,
      questions: [
        {
          _id: 'qq13',
          text: 'Que signifie l\'acronyme BEEF dans la mécanique du tir ?',
          options: [
            'Balance, Eyes, Elbow, Follow-through',
            'Body, Energy, Effort, Focus',
            'Ball, Extension, Elevation, Finish',
            'Bend, Extend, Eye, Flick',
          ],
          correctAnswers: ['Balance, Eyes, Elbow, Follow-through'],
        },
        {
          _id: 'qq14',
          text: 'Quel est le rôle de la "main guide" dans un tir ?',
          options: [
            'Elle propulse le ballon vers le panier',
            'Elle soutient le ballon sur le côté sans participer au tir',
            'Elle contrôle la rotation du ballon',
            'Elle stabilise la hanche du tireur',
          ],
          correctAnswers: ['Elle soutient le ballon sur le côté sans participer au tir'],
        },
        {
          _id: 'qq15',
          text: 'Qu\'est-ce qu\'un "catch-and-shoot" ?',
          options: [
            'Attraper le rebond et tirer',
            'Recevoir une passe et tirer sans dribble',
            'Tirer après un dribble en mouvement',
            'Tirer depuis l\'extérieur de l\'arc',
          ],
          correctAnswers: ['Recevoir une passe et tirer sans dribble'],
        },
      ],
    },
  ],
  c4: [
    {
      _id: 'q5',
      courseId: 'c4',
      title: 'Quiz : Défense',
      passingScore: 60,
      questions: [
        {
          _id: 'qq16',
          text: 'Quel est le déplacement défensif recommandé pour suivre un attaquant ?',
          options: [
            'Courir normalement en croisant les pieds',
            'Se déplacer en shuffle steps sans croiser les pieds',
            'Sauter en permanence pour bloquer les tirs',
            'Rester statique et anticiper',
          ],
          correctAnswers: ['Se déplacer en shuffle steps sans croiser les pieds'],
        },
        {
          _id: 'qq17',
          text: 'En défense man-to-man, chaque défenseur est responsable de :',
          options: [
            'Une zone du terrain',
            'Un attaquant spécifique',
            'La raquette uniquement',
            'N\'importe quel attaquant proche',
          ],
          correctAnswers: ['Un attaquant spécifique'],
        },
      ],
    },
  ],
  c5: [
    {
      _id: 'q6',
      courseId: 'c5',
      title: 'Quiz : Tactiques offensives',
      passingScore: 70,
      questions: [
        {
          _id: 'qq18',
          text: 'Dans un pick and roll, que fait le "poseur d\'écran" après avoir posé l\'écran ?',
          options: [
            'Il reste immobile pour bloquer le défenseur',
            'Il "roule" vers le panier pour recevoir une passe',
            'Il sort sur l\'arc des 3 points',
            'Il retourne en défense',
          ],
          correctAnswers: ['Il "roule" vers le panier pour recevoir une passe'],
        },
        {
          _id: 'qq19',
          text: 'Qu\'est-ce qu\'une "fast break" ?',
          options: [
            'Un temps mort demandé rapidement',
            'Une attaque rapide en transition avant que la défense soit en place',
            'Un tir pris en moins de 3 secondes',
            'Un écran posé au sprint',
          ],
          correctAnswers: ['Une attaque rapide en transition avant que la défense soit en place'],
        },
      ],
    },
  ],
}

// Progression localStorage

const PROGRESS_KEY = 'basketball_lms_progress'

function getProgress() {
  const raw = localStorage.getItem(PROGRESS_KEY)
  return raw ? JSON.parse(raw) : {}
}

function saveProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

// Public API

export async function fetchCourses() {
  try {
    const data = await apiFetch('/courses')
    if (data) return data
  } catch {}
  const progress = getProgress()
  return MOCK_COURSES.map(c => ({
    ...c,
    completedLessons: progress[c._id]?.completedLessons ?? c.completedLessons,
  }))
}

export async function fetchCourse(courseId) {
  try {
    const data = await apiFetch(`/courses/${courseId}`)
    if (data) return data
  } catch {}
  const course = MOCK_COURSES.find(c => c._id === courseId)
  const lessons = MOCK_LESSONS[courseId] || []
  const quizzes = MOCK_QUIZZES[courseId] || []
  return course ? { ...course, lessons, quizzes } : null
}

export async function fetchLesson(lessonId) {
  try {
    const res = await fetch(`${BASE_URL}/lessons/${lessonId}`, {
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
    })
    const data = await res.json()
    if (res.ok) return data
    // Leçon pas encore disponible : on renvoie titre + date de disponibilité
    // pour que la page leçon affiche l'écran "verrouillé".
    if (res.status === 403) return { ...data, locked: true }
  } catch {}
  for (const lessons of Object.values(MOCK_LESSONS)) {
    const found = lessons.find(l => l._id === lessonId)
    if (found) return found
  }
  return null
}

export async function fetchQuiz(quizId) {
  try {
    const data = await apiFetch(`/quizzes/${quizId}`)
    if (data) return data
  } catch {}
  for (const quizzes of Object.values(MOCK_QUIZZES)) {
    const found = quizzes.find(q => q._id === quizId)
    if (found) return found
  }
  return null
}

export async function submitQuiz(quizId, answers) {
  try {
    const data = await apiFetch(`/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    })
    if (data) {
      const progress = getProgress()
      progress[`quiz_${quizId}`] = { score: data.score, passed: data.passed, completedAt: new Date().toISOString() }
      saveProgress(progress)
      return data
    }
  } catch {}

  const quiz = await fetchQuiz(quizId)
  if (!quiz) return null

  let correct = 0
  const feedback = quiz.questions.map(q => {
    const given = answers[q._id] || []
    const givenArr = Array.isArray(given) ? given : [given]
    const isCorrect = q.correctAnswers.every(a => givenArr.includes(a)) && givenArr.every(a => q.correctAnswers.includes(a))
    if (isCorrect) correct++
    return { questionId: q._id, correct: isCorrect, correctAnswers: q.correctAnswers }
  })

  const score = Math.round((correct / quiz.questions.length) * 100)
  const passed = score >= quiz.passingScore

  const progress = getProgress()
  const key = `quiz_${quizId}`
  progress[key] = { score, passed, completedAt: new Date().toISOString() }
  saveProgress(progress)

  return { score, passed, passingScore: quiz.passingScore, correct, total: quiz.questions.length, feedback }
}

export async function markLessonComplete(lessonId) {
  try {
    await apiFetch(`/lessons/${lessonId}/complete`, { method: 'POST' })
  } catch {}
  const progress = getProgress()
  progress[`lesson_${lessonId}`] = { completed: true, completedAt: new Date().toISOString() }
  saveProgress(progress)
}

export function isLessonAvailable(lesson) {
  if (!lesson.availableAt) return true
  return new Date(lesson.availableAt) <= new Date()
}

export function isLessonCompleted(lessonId) {
  const progress = getProgress()
  return !!progress[`lesson_${lessonId}`]?.completed
}

export function getQuizResult(quizId) {
  const progress = getProgress()
  return progress[`quiz_${quizId}`] || null
}
