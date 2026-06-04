export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      return res.status(400).json({ error: 'Données invalides', details: errors })
    }
    req.body = result.data
    next()
  }
}
