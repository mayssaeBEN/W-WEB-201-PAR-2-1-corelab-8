import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Course from './models/Course.js'
import Lesson from './models/Lesson.js'
import Quiz from './models/Quiz.js'
import Progress from './models/Progress.js'

const ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ Connecté à MongoDB')

  // Nettoyage
  await Promise.all([User.deleteMany(), Course.deleteMany(), Lesson.deleteMany(), Quiz.deleteMany(), Progress.deleteMany()])
  console.log('🗑️  Collections nettoyées')

  // ── Utilisateurs ──────────────────────────────────────────────────────────────
  const [adminPwd, studentPwd] = await Promise.all([
    bcrypt.hash('admin123', ROUNDS),
    bcrypt.hash('basket123', ROUNDS),
  ])

  const admin = await User.create({
    email: 'admin@basketball.fr',
    password: adminPwd,
    firstName: 'Admin',
    lastName: 'Coach',
    role: 'admin',
    isFirstLogin: false,
  })

  const student = await User.create({
    email: 'etudiant@basketball.fr',
    password: studentPwd,
    firstName: 'Jordan',
    lastName: 'Martin',
    role: 'student',
    isFirstLogin: false,
  })

  console.log('👤 Utilisateurs créés')

  // ── Cours ─────────────────────────────────────────────────────────────────────
  const coursesData = [
    { title: 'Les Règles du Basketball', description: 'Maîtrise les règles fondamentales : terrain, joueurs, fautes, temps de jeu et violations.', icon: '📋', color: '#e74c3c' },
    { title: 'Techniques de Dribble', description: 'Apprends les techniques essentielles : crossover, between legs, behind the back et speed dribble.', icon: '🏀', color: '#e67e22' },
    { title: 'Techniques de Shooting', description: 'Perfectionne ton shoot : forme, footwork, catch-and-shoot, pull-up jumper et tirs à 3 points.', icon: '🎯', color: '#27ae60' },
    { title: 'Stratégies Défensives', description: 'Comprends les principes défensifs : man-to-man, zone defense, press defense et rotations.', icon: '🛡️', color: '#2980b9' },
    { title: 'Tactiques et Systèmes de Jeu', description: 'Explore les systèmes offensifs : pick and roll, motion offense, zone offense et fast break.', icon: '🧩', color: '#8e44ad' },
  ]

  const courses = await Course.insertMany(coursesData)
  const [cRules, cDribble, cShoot, cDefense, cTactics] = courses
  console.log('📚 Cours créés')

  // ── Donner accès à l'étudiant ──────────────────────────────────────────────
  await User.findByIdAndUpdate(student._id, { accessibleCourses: courses.map(c => c._id) })

  // ── Leçons ────────────────────────────────────────────────────────────────────
  const past = (d) => new Date(d)
  const future = (d) => new Date(d)

  const lessonsData = [
    // Cours 1 : Règles
    { courseId: cRules._id, order: 1, title: 'Le terrain et les joueurs', availableAt: past('2026-01-10'), content: `<h2>🏀 Le terrain de basketball</h2><p>Un terrain officiel NBA mesure <strong>28 mètres × 15 mètres</strong>. Il est divisé en deux moitiés symétriques par la ligne médiane.</p><h3>Les zones importantes</h3><ul><li><strong>La raquette (paint)</strong> : zone rectangulaire devant le panier, limitée à 3 secondes pour les attaquants.</li><li><strong>La ligne des 3 points</strong> : à 7,24 m en NBA (6,75 m en FIBA). Un tir réussi depuis l'extérieur vaut 3 points.</li><li><strong>La ligne de lancer-franc</strong> : à 4,57 m du panier. Un lancer réussi vaut 1 point.</li></ul><h3>Les 5 positions</h3><table class="table table-bordered"><thead><tr><th>N°</th><th>Poste</th><th>Rôle principal</th></tr></thead><tbody><tr><td>1</td><td>Meneur (Point Guard)</td><td>Organise le jeu, distribue le ballon</td></tr><tr><td>2</td><td>Arrière (Shooting Guard)</td><td>Shooteur extérieur, marqueur</td></tr><tr><td>3</td><td>Ailier (Small Forward)</td><td>Polyvalent, attaque et défense</td></tr><tr><td>4</td><td>Ailier fort (Power Forward)</td><td>Jeu intérieur, rebonds</td></tr><tr><td>5</td><td>Pivot (Center)</td><td>Présence dans la raquette, pivot défensif</td></tr></tbody></table><div class="alert alert-info">💡 <strong>À retenir :</strong> Chaque équipe aligne 5 joueurs sur le terrain.</div>` },
    { courseId: cRules._id, order: 2, title: 'Le temps de jeu et le score', availableAt: past('2026-01-17'), content: `<h2>⏱️ Structure d'un match</h2><p>Un match de basketball officiel FIBA se joue en <strong>4 quarts-temps de 10 minutes</strong> (12 min en NBA).</p><h3>Valeur des paniers</h3><ul><li>🏀 <strong>Panier en jeu sous la ligne des 3 pts</strong> : 2 points</li><li>🎯 <strong>Panier au-delà de la ligne des 3 pts</strong> : 3 points</li><li>✅ <strong>Lancer-franc réussi</strong> : 1 point</li></ul><div class="alert alert-warning">⚠️ <strong>Prolongations :</strong> En cas d'égalité à la fin du temps réglementaire, des prolongations de 5 minutes sont jouées jusqu'à départage.</div>` },
    { courseId: cRules._id, order: 3, title: 'Les violations et les fautes', availableAt: past('2026-01-24'), content: `<h2>🚫 Violations</h2><ul><li><strong>Marcher (traveling)</strong> : plus de 2 pas sans dribbler</li><li><strong>Double dribble</strong> : reprendre le dribble après l'avoir arrêté</li><li><strong>3 secondes</strong> : rester plus de 3 s dans la raquette adverse</li><li><strong>8 secondes</strong> : ne pas dépasser la mi-terrain en 8 s</li><li><strong>24 secondes</strong> : ne pas tirer dans les 24 s de possession</li></ul><h2>🟡 Les fautes</h2><p>Un joueur est exclu après <strong>5 fautes personnelles</strong> (6 en NBA).</p><div class="alert alert-danger">🔴 <strong>Bonus :</strong> À partir de la 5e faute d'équipe par quart-temps, chaque faute accorde 2 lancers-francs à l'adversaire.</div>` },
    { courseId: cRules._id, order: 4, title: 'Les règles spéciales avancées', availableAt: future('2026-07-01'), content: '' },

    // Cours 2 : Dribble
    { courseId: cDribble._id, order: 1, title: 'Bases du dribble et position du corps', availableAt: past('2026-01-15'), content: `<h2>🏀 Les fondamentaux du dribble</h2><p>Le dribble est la seule façon légale de se déplacer avec le ballon.</p><h3>Position de base</h3><ul><li>Pieds écartés à la largeur des épaules</li><li>Genoux légèrement fléchis (attitude athlétique)</li><li>Dos droit, regard vers le terrain (pas vers le ballon !)</li><li>Main sur le côté du ballon, pas dessus</li></ul><div class="alert alert-success">✅ <strong>Exercice :</strong> Pratique le dribble dans un miroir pour corriger ta position sans regarder le ballon.</div>` },
    { courseId: cDribble._id, order: 2, title: 'Le crossover et ses variantes', availableAt: past('2026-02-01'), content: `<h2>↔️ Le Crossover</h2><p>Le crossover est le changement de main le plus basique et le plus efficace pour éliminer un défenseur.</p><h3>Technique</h3><ol><li>Dribble de la main droite, penche le corps à droite pour attirer le défenseur</li><li>Croise rapidement le ballon devant toi vers la main gauche</li><li>Accélère immédiatement dans la direction opposée</li></ol><div class="alert alert-info">💡 <strong>Conseil :</strong> La clé d'un bon crossover est la <em>feinte</em> avant le geste, pas la vitesse du geste lui-même.</div>` },
    { courseId: cDribble._id, order: 3, title: 'Between the legs et Behind the back', availableAt: past('2026-02-15'), content: `<h2>🦵 Between the Legs</h2><p>Le dribble entre les jambes protège le ballon et change de direction de façon inattendue.</p><ol><li>Avance le pied du côté de ta main de dribble</li><li>Croise le ballon entre tes deux jambes</li><li>Récupère avec la main opposée et accélère</li></ol><h2>🔄 Behind the Back</h2><p>Le dribble derrière le dos surprend le défenseur et protège le ballon.</p><div class="alert alert-warning">⚠️ Ces mouvements nécessitent une pratique intensive. Commence lentement.</div>` },
    { courseId: cDribble._id, order: 4, title: 'Dribble en situation de match', availableAt: past('2026-03-01'), content: '' },
    { courseId: cDribble._id, order: 5, title: 'Exercices et drills avancés', availableAt: future('2026-07-15'), content: '' },

    // Cours 3 : Shooting
    { courseId: cShoot._id, order: 1, title: 'La mécanique du shoot (BEEF)', availableAt: past('2026-02-01'), content: `<h2>🎯 BEEF : La formule du parfait shooteur</h2><p><strong>BEEF</strong> est l'acronyme pour mémoriser les 4 éléments clés du shoot :</p><ul><li><strong>B</strong> - Balance (équilibre)</li><li><strong>E</strong> - Eyes (regard vers le panier)</li><li><strong>E</strong> - Elbow (coude aligné)</li><li><strong>F</strong> - Follow-through (finition, claque du poignet)</li></ul><div class="alert alert-success">✅ <strong>Exercice HORSE :</strong> Joue au HORSE avec un partenaire pour travailler des tirs variés.</div>` },
    { courseId: cShoot._id, order: 2, title: 'Catch-and-shoot et pull-up jumper', availableAt: past('2026-02-20'), content: `<h2>🏃 Catch-and-Shoot</h2><p>Le catch-and-shoot est l'acte de recevoir la passe et tirer immédiatement, sans dribble.</p><ul><li>Être prêt à tirer <em>avant</em> de recevoir la balle</li><li>Pivot vers le panier simultanément à la réception</li></ul><h2>↕️ Pull-Up Jumper</h2><p>Le pull-up est un tir pris en sortie de dribble, après un arrêt brusque.</p><div class="alert alert-info">💡 <strong>Stars à étudier :</strong> Stephen Curry (catch-and-shoot), Devin Booker (pull-up jumper).</div>` },
    { courseId: cShoot._id, order: 3, title: 'Le tir à 3 points', availableAt: future('2026-07-10'), content: '' },
    { courseId: cShoot._id, order: 4, title: 'Lancer-franc : répétition et mental', availableAt: future('2026-08-01'), content: '' },

    // Cours 4 : Défense
    { courseId: cDefense._id, order: 1, title: 'Principes défensifs fondamentaux', availableAt: past('2026-03-01'), content: `<h2>🛡️ L'état d'esprit défensif</h2><p>La défense gagne les championnats. Un bon défenseur doit avoir :</p><ul><li><strong>Position athlétique</strong> : pieds écartés, genoux fléchis, mains actives</li><li><strong>Pieds actifs</strong> : shuffle steps, ne jamais croiser les pieds</li><li><strong>Communication</strong> : appeler les écrans, les rotations</li></ul><div class="alert alert-primary">🏆 <strong>Règle d'or :</strong> Toujours voir son adversaire ET le ballon simultanément.</div>` },
    { courseId: cDefense._id, order: 2, title: 'Zone Defense : 2-3 et 3-2', availableAt: future('2026-07-20'), content: '' },
    { courseId: cDefense._id, order: 3, title: 'Défense sur les écrans', availableAt: future('2026-08-10'), content: '' },
    { courseId: cDefense._id, order: 4, title: 'Press defense et trap', availableAt: future('2026-09-01'), content: '' },

    // Cours 5 : Tactiques
    { courseId: cTactics._id, order: 1, title: 'Le Pick and Roll', availableAt: past('2026-04-01'), content: `<h2>🤝 Pick and Roll</h2><p>Le pick and roll (ou écran-remontée) est l'action offensive la plus courante en basketball moderne.</p><ol><li><strong>Poseur d'écran</strong> : s'immobilise face au défenseur du meneur</li><li><strong>Meneur</strong> : utilise l'écran en dribblant près du poseur</li><li><strong>Poseur</strong> : "roule" vers le panier après l'écran</li><li><strong>Meneur</strong> : passe au poseur si son défenseur est bloqué</li></ol><div class="alert alert-success">🌟 <strong>Duo légendaire :</strong> John Stockton et Karl Malone ont révolutionné le pick and roll dans les années 90.</div>` },
    { courseId: cTactics._id, order: 2, title: 'Motion Offense', availableAt: future('2026-07-25'), content: '' },
    { courseId: cTactics._id, order: 3, title: 'Fast Break et transition', availableAt: future('2026-08-15'), content: '' },
    { courseId: cTactics._id, order: 4, title: 'Triangle Offense et systèmes Princeton', availableAt: future('2026-09-05'), content: '' },
    { courseId: cTactics._id, order: 5, title: 'Analyse vidéo : lire une défense', availableAt: future('2026-09-20'), content: '' },
  ]

  const lessons = await Lesson.insertMany(lessonsData)
  console.log(`📖 ${lessons.length} leçons créées`)

  // ── Quiz ──────────────────────────────────────────────────────────────────────
  const quizzesData = [
    {
      courseId: cRules._id, title: 'Quiz : Règles fondamentales', passingScore: 70,
      questions: [
        { text: 'Combien de joueurs une équipe aligne-t-elle sur le terrain simultanément ?', options: ['4 joueurs', '5 joueurs', '6 joueurs', '7 joueurs'], correctAnswers: ['5 joueurs'] },
        { text: 'Combien de points vaut un panier réussi depuis l\'arc des 3 points ?', options: ['1 point', '2 points', '3 points', '4 points'], correctAnswers: ['3 points'] },
        { text: 'Qu\'est-ce qu\'une violation de "24 secondes" ?', options: ['Ne pas passer à un coéquipier en 24 s', 'Ne pas tenter un tir en 24 s de possession', 'Rester dans la raquette 24 s', 'Dépasser la mi-terrain en 24 s'], correctAnswers: ['Ne pas tenter un tir en 24 s de possession'] },
        { text: 'À partir de quelle faute d\'équipe l\'adversaire obtient-il des lancers-francs ?', options: ['3e faute', '4e faute', '5e faute', '6e faute'], correctAnswers: ['5e faute'] },
        { text: 'Combien de temps a-t-on pour dépasser la ligne médiane ?', options: ['5 secondes', '8 secondes', '10 secondes', '24 secondes'], correctAnswers: ['8 secondes'] },
      ],
    },
    {
      courseId: cRules._id, title: 'Quiz : Fautes et violations', passingScore: 60,
      questions: [
        { text: 'Un joueur est exclu après combien de fautes personnelles en FIBA ?', options: ['4 fautes', '5 fautes', '6 fautes', '7 fautes'], correctAnswers: ['5 fautes'] },
        { text: 'Qu\'est-ce que le "traveling" ?', options: ['Dribbler avec les deux mains', 'Se déplacer sans dribbler (plus de 2 pas)', 'Rester dans la raquette adverse', 'Tirer hors des limites'], correctAnswers: ['Se déplacer sans dribbler (plus de 2 pas)'] },
        { text: 'Quelle est la durée d\'un quart-temps en FIBA ?', options: ['8 minutes', '10 minutes', '12 minutes', '15 minutes'], correctAnswers: ['10 minutes'] },
      ],
    },
    {
      courseId: cDribble._id, title: 'Quiz : Techniques de dribble', passingScore: 70,
      questions: [
        { text: 'Qu\'est-ce qu\'un "crossover" ?', options: ['Un dribble entre les jambes', 'Un changement de main du ballon devant soi', 'Un dribble derrière le dos', 'Un arrêt brusque en dribble'], correctAnswers: ['Un changement de main du ballon devant soi'] },
        { text: 'Dans quelle position doit être le regard du dribbleur ?', options: ['Vers le sol pour suivre le ballon', 'Vers le ciel pour anticiper', 'Vers le terrain pour lire le jeu', 'Vers son propre panier'], correctAnswers: ['Vers le terrain pour lire le jeu'] },
        { text: 'Qu\'est-ce que la "hesitation" au dribble ?', options: ['Dribbler plus lentement', 'Un faux-semblant avant un changement de rythme', 'Arrêter le dribble', 'Dribbler derrière le dos'], correctAnswers: ['Un faux-semblant avant un changement de rythme'] },
        { text: 'Le "between the legs" consiste à dribbler :', options: ['Derrière le dos', 'Avec les deux mains', 'Entre les deux jambes', 'Au-dessus de la tête'], correctAnswers: ['Entre les deux jambes'] },
      ],
    },
    {
      courseId: cShoot._id, title: 'Quiz : Mécanique du shoot', passingScore: 70,
      questions: [
        { text: 'Que signifie l\'acronyme BEEF dans la mécanique du tir ?', options: ['Balance, Eyes, Elbow, Follow-through', 'Body, Energy, Effort, Focus', 'Ball, Extension, Elevation, Finish', 'Bend, Extend, Eye, Flick'], correctAnswers: ['Balance, Eyes, Elbow, Follow-through'] },
        { text: 'Quel est le rôle de la "main guide" dans un tir ?', options: ['Elle propulse le ballon', 'Elle soutient le ballon sur le côté sans participer au tir', 'Elle contrôle la rotation', 'Elle stabilise la hanche'], correctAnswers: ['Elle soutient le ballon sur le côté sans participer au tir'] },
        { text: 'Qu\'est-ce qu\'un "catch-and-shoot" ?', options: ['Attraper le rebond et tirer', 'Recevoir une passe et tirer sans dribble', 'Tirer après un dribble en mouvement', 'Tirer depuis l\'extérieur de l\'arc'], correctAnswers: ['Recevoir une passe et tirer sans dribble'] },
      ],
    },
    {
      courseId: cDefense._id, title: 'Quiz : Défense', passingScore: 60,
      questions: [
        { text: 'Quel est le déplacement défensif recommandé ?', options: ['Courir en croisant les pieds', 'Se déplacer en shuffle steps sans croiser les pieds', 'Sauter en permanence', 'Rester statique et anticiper'], correctAnswers: ['Se déplacer en shuffle steps sans croiser les pieds'] },
        { text: 'En défense man-to-man, chaque défenseur est responsable de :', options: ['Une zone du terrain', 'Un attaquant spécifique', 'La raquette uniquement', "N'importe quel attaquant proche"], correctAnswers: ['Un attaquant spécifique'] },
      ],
    },
    {
      courseId: cTactics._id, title: 'Quiz : Tactiques offensives', passingScore: 70,
      questions: [
        { text: 'Dans un pick and roll, que fait le "poseur d\'écran" après avoir posé l\'écran ?', options: ['Il reste immobile', 'Il "roule" vers le panier pour recevoir une passe', 'Il sort sur l\'arc des 3 points', 'Il retourne en défense'], correctAnswers: ['Il "roule" vers le panier pour recevoir une passe'] },
        { text: 'Qu\'est-ce qu\'une "fast break" ?', options: ['Un temps mort demandé rapidement', 'Une attaque rapide en transition avant que la défense soit en place', 'Un tir pris en moins de 3 secondes', 'Un écran posé au sprint'], correctAnswers: ['Une attaque rapide en transition avant que la défense soit en place'] },
      ],
    },
  ]

  await Quiz.insertMany(quizzesData)
  console.log(`✅ ${quizzesData.length} quiz créés`)

  // ── Quelques progressions démo pour l'étudiant ────────────────────────────────
  const availableLessons = lessons.filter(l => new Date(l.availableAt) <= new Date())
  const progressToCreate = availableLessons.slice(0, 5).map(l => ({
    userId: student._id,
    lessonId: l._id,
    type: 'lesson',
    completedAt: new Date(),
  }))
  await Progress.insertMany(progressToCreate)
  console.log(`📊 ${progressToCreate.length} progressions démo créées`)

  console.log('\n🏀 Seed terminé avec succès !')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Comptes créés :')
  console.log('  Admin : admin@basketball.fr / admin123')
  console.log('  Étudiant : etudiant@basketball.fr / basket123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Erreur seed :', err)
  process.exit(1)
})
