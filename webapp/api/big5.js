// ...existing code...
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

const emailTemplateBig5 = require('../emailtemplate-big5')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const emailDefaults = {
  to: '',
  from: 'Creactivistas <marubuteler@gmail.com>',
  bcc: 'marubuteler@gmail.com, abuteler@enneagonstudios.com',
  subject: 'Creactivistas | Resultados del test Big 5',
  text: 'Hola $__NAME__, este email fue enviado automáticamente. Para ver tus resultados en el test de perfil de personalidad basado en el modelo de los 5 grandes andá a $__DOMAIN__/tests/big5/resultados/ y completá el formulario con el siguiente ID: $__ID__',
  html: emailTemplateBig5
}

// ...existing code...

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

    // Validaciones básicas; ampliá según tu esquema
    if (!payload.clientEmail || typeof payload.clientEmail !== 'string' || !validator.isEmail(payload.clientEmail)) {
      throw new HttpError(400, 'Invalid clientEmail', true)
    }
    if (!payload.clientName || typeof payload.clientName !== 'string' || payload.clientName.trim().length === 0) {
      throw new HttpError(400, 'Invalid clientName', true)
    }

    // Normalizar/sanitizar para la DB (no inyectar HTML)
    payload.clientEmail = payload.clientEmail.trim()
    payload.clientName = payload.clientName.trim().slice(0, 200) // limitar longitud

    const result = await collection.insertOne(payload)
    const data = Object.assign({}, payload, { _id: result.insertedId })

    // Responder inmediatamente al cliente
    res.status(201).json(data)

    // Envío de email: preferir SendGrid Dynamic Template
    const templateId = process.env.SENDGRID_TEMPLATE_ID

    if (templateId) {
      const msg = {
        to: data.clientEmail,
        from: emailDefaults.from,
        bcc: emailDefaults.bcc,
        templateId: templateId,
        dynamic_template_data: {
          name: String(data.clientName || ''),
          domain: config.URL || '',
          id: String(data._id)
        }
      }

      sgMail.send(msg).catch(err => {
        console.error('SendGrid (template) error:', err)
        if (err && err.response) console.error(err.response.body)
      })

      return
    }

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

    const msg = {
      to: data.clientEmail,
      from: emailDefaults.from,
      bcc: emailDefaults.bcc,
      subject: emailDefaults.subject,
      text,
      html
    }

    sgMail.send(msg).catch(err => {
      console.error('SendGrid (html) error:', err)
      if (err && err.response) console.error(err.response.body)
    })

    return
  }

  res.setHeader('Allow', 'GET, POST')
  throw new HttpError(405, 'Method Not Allowed', true)
})
// ...existing code...