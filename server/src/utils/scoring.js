/**
 * Compare les réponses données par l'étudiant avec les bonnes réponses.
 * Supporte les questions à réponse unique et à réponses multiples.
 */
export function gradeQuestion(question, givenAnswer) {
  const given = Array.isArray(givenAnswer)
    ? givenAnswer
    : givenAnswer ? [givenAnswer] : []

  const correct = question.correctAnswers

  const isCorrect =
    correct.length === given.length &&
    correct.every(a => given.includes(a)) &&
    given.every(a => correct.includes(a))

  return isCorrect
}

/**
 * Calcule le score global d'un quiz en pourcentage.
 */
export function calculateScore(questions, answers) {
  if (!questions.length) return { score: 0, correct: 0, total: 0 }

  let correct = 0
  const feedback = questions.map(q => {
    const isCorrect = gradeQuestion(q, answers[q._id.toString()])
    if (isCorrect) correct++
    return { questionId: q._id, correct: isCorrect, correctAnswers: q.correctAnswers }
  })

  const score = Math.round((correct / questions.length) * 100)
  return { score, correct, total: questions.length, feedback }
}
