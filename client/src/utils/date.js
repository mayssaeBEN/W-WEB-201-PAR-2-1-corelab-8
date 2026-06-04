export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function isFutureDate(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) > new Date()
}
