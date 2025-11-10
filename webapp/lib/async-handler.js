module.exports = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (err) {
      // pasar al manejador global de errores si existe
      if (typeof next === 'function') return next(err)
      // si no hay next (Next.js style), devolver respuesta segura
      console.error(err)
      res.status(err.status || 500).json({ error: err.expose ? err.message : 'Internal Server Error' })
    }
  }
}