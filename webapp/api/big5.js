/***
 NODE SERVERLESS API FOR USE WITH VERCEL
 ***/

const dev = process.env.NODE_ENV !== 'production'
if (dev) {
  require('dotenv').config()
}
const config = require('../config')

const ObjectID = require('mongodb').ObjectID

const validMongoId = require('../lib/valid-mongoid')
const asyncHandler = require('../lib/async-handler')
const HttpError = require('../lib/http-error')

const mongoClient = require('../lib/mongo-client')

const escapeHtml = require('escape-html')
const validator = require('validator')
const Joi = require('joi')
const { enqueueEmail } = require('../lib/email-queue')

const emailTemplateBig5 = require('../emailtemplate-big5')
const sgMail = require('@sendgrid/mail')
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const emailDefaults = {
  to: '',
  from: 'Creactivistas <marubuteler@gmail.com>',
  bcc: 'marubuteler@gmail.com, abuteler@enneagonstudios.com',
  subject: 'Creactivistas | Resultados del test Big 5',
  text: 'Hola $__NAME__, este email fue enviado automáticamente. Para ver tus resultados en el test de perfil de personalidad basado en el modelo de los 5 grandes andá a $__DOMAIN__/tests/big5/resultados/ y completá el formulario con el siguiente ID: $__ID__',
  html: emailTemplateBig5
}

// Joi schema (validación y stripUnknown)
const big5Schema = Joi.object({
  clientEmail: Joi.string().email().required(),
  clientName: Joi.string().trim().min(1).max(200).required(),
  answers: Joi.array().items(Joi.number().integer().min(1).max(5)).optional(),
  scores: Joi.object({
    openness: Joi.number().min(0).max(100),
    conscientiousness: Joi.number().min(0).max(100),
    extraversion: Joi.number().min(0).max(100),
    agreeableness: Joi.number().min(0).max(100),
    neuroticism: Joi.number().min(0).max(100)
  }).optional().unknown(false)
}).options({ abortEarly: false, stripUnknown: true })

module.exports = asyncHandler(async (req, res) => {
  const { client, db } = await mongoClient.connect()
  const collection = db.collection(config.DB_COLLECTION_BIG5)
  const { method, query, body } = req

  if (method === 'GET') {
    const id = query && query.id
    if (!id || !validMongoId(id)) throw new HttpError(400, 'Invalid id', true)
    const data = await collection.findOne({ _id: ObjectID(id) })
    if (!data) throw new HttpError(404, 'Not found', true)
    return res.status(200).json(data)
  }

  if (method === 'POST') {
    const payload = body || {}

    // Validación con Joi (stripUnknown elimina campos inesperados)
    const { error, value: validated } = big5Schema.validate(payload)
    if (error) {
      const details = error.details.map(d => ({ path: d.path.join('.'), message: d.message }))
      throw new HttpError(400, 'Validation failed', true, { details })
    }

    // Normalizar/sanitizar para DB (guardar valores limpios)
    validated.clientEmail = String(validated.clientEmail).trim()
    validated.clientName = String(validated.clientName).trim().slice(0, 200)

    const result = await collection.insertOne(validated)
    const data = Object.assign({}, validated, { _id: result.insertedId })

    // Responder inmediatamente al cliente
    res.status(201).json(data)

    // Construir mensaje de email (template preferido)
    const templateId = process.env.SENDGRID_TEMPLATE_ID
    let msg

    if (templateId && process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
      // dynamic template data
      msg = {
        to: data.clientEmail,
        from: emailDefaults.from,
        bcc: emailDefaults.bcc,
        templateId,
        dynamic_template_data: {
          name: String(data.clientName || ''),
          domain: config.URL || '',
          id: String(data._id)
        }
      }
    } else {
      // Fallback: escapar variables antes de inyectar en HTML/text
      const safeName = escapeHtml(String(data.clientName || ''))
      const safeDomain = escapeHtml(String(config.URL || ''))
      const safeId = escapeHtml(String(data._id))

      const html = (emailDefaults.html || '')
        .replace(/\$__NAME__/g, safeName)
        .replace(/\$__DOMAIN__/g, safeDomain)
        .replace(/\$__ID__/g, safeId)

      const text = (emailDefaults.text || '')
        .replace(/\$__NAME__/g, safeName)
        .replace(/\$__DOMAIN__/g, safeDomain)
        .replace(/\$__ID__/g, safeId)

      msg = {
        to: data.clientEmail,
        from: emailDefaults.from,
        bcc: emailDefaults.bcc,
        subject: emailDefaults.subject,
        text,
        html
      }
    }

    // Encolar el email para envío asíncrono (no bloquea la respuesta)
    enqueueEmail(db, msg).catch(err => {
      console.error('enqueueEmail failed:', err)
    })

    return
  }

  res.setHeader('Allow', 'GET, POST')
  throw new HttpError(405, 'Method Not Allowed', true)
})