
const Joi = require('joi')

// Reglas comunes
const emailRule = Joi.string().email({ tlds: { allow: false } }).max(254)
const nameRule  = Joi.string().trim().min(1).max(100)


const actusSchema = Joi.object({
  nombreCliente: nameRule.required(),
  emailCliente:  emailRule.required(),
  mbti:          Joi.string().trim().max(16).required(),
  resultados:    Joi.object().required()
})
.prefs({ stripUnknown: true })


const big5Schema = Joi.object({
  clientName:  nameRule.required(),
  clientEmail: emailRule.required(),

  answers: Joi.array().items(
    Joi.number().integer().min(1).max(5)
  ).min(10) 
    .required()
})
.prefs({ stripUnknown: true })

module.exports = { actusSchema, big5Schema }