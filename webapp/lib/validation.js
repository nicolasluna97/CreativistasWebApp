const Joi = require('joi')

// Ajustá estos schemas a la estructura real de tus formularios
const big5Schema = Joi.object({
  clientName: Joi.string().min(2).max(80).required(),
  clientEmail: Joi.string().email().required(),
  // TODO: define aquí las respuestas del test (ejemplo)
  // answers: Joi.array().items(Joi.number().min(1).max(5)).required()
}).unknown(false)

const actusSchema = Joi.object({
  nombreCliente: Joi.string().min(2).max(80).required(),
  emailCliente: Joi.string().email().required(),
  resultados: Joi.array().items(Joi.number()).min(1).required(),
  mbti: Joi.string().max(10).required()
}).unknown(false)

module.exports = { big5Schema, actusSchema }