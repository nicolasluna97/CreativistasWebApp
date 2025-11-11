const dev = process.env.NODE_ENV !== 'production'
require('dotenv').config()

const next = require('next')
const routes = require('./routes')
const express = require('express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { join } = require('path')

const { MongoClient, ObjectId } = require('mongodb')
const config = require('./config')
const validMongoId = require('./lib/valid-mongoid')
const { big5Schema, actusSchema } = require('./lib/validation')

const emailTemplateActus = require('./emailtemplate-actus')
const emailTemplateBig5 = require('./emailtemplate-big5')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const app = next({ dev })
const handler = routes.getRequestHandler(app)
const port = parseInt(process.env.PORT, 10) || 3000
const disableDb = process.env.DISABLE_DB === '1'

/** Email helpers */
const emailDefaults = {
  to: '',
  from: 'Creactivistas <marubuteler@gmail.com>',
  subject: 'Creactivistas | Resultados del test $__TESTNAME__',
  text:
    'Hola $__NAME__, este email fue enviado automáticamente luego que completaste el test $__TESTNAME__. ' +
    'Si recibiste este correo es probable que tu casilla no soporte HTML.'
}

// mínimo escape para evitar inyección en HTML local
const escapeHtml = s =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const hidratarEmailBase = (email, destinatario, nombreCliente, domain, testname) => {
  email.to = destinatario
  email.subject = email.subject.replace('$__TESTNAME__', testname).replace('$__NAME__', escapeHtml(nombreCliente))
  email.text = email.text.replace('$__NAME__', nombreCliente).replace('$__TESTNAME__', testname)
  email.html = email.html.replace('$__NAME__', escapeHtml(nombreCliente))
  email.html = email.html.replace(/\$__DOMAIN__/g, domain)
  return email
}
const hidratarEmailBig5 = (email, id) => {
  email.html = email.html.replace(/\$__ID__/g, id)
  return email
}
const safeSend = async (msg) => {
  try { await sgMail.send(msg) } catch (e) { console.error('EMAIL ERR', e?.response?.body || e) }
}

console.log(`> Initializing on ${config.URL}:${port}...`)

app.prepare().then(async () => {
  const server = express()

  // seguridad básica
  server.use(helmet())
  server.use(express.json())
  server.use('/api/', rateLimit({ windowMs: 60_000, max: 30 })) // 30 req/min en APIs

  // estáticos requeridos por Next PWA / sitemap
  server.get('/sitemap.xml', (req, res) => {
    const filePath = join(__dirname, 'static', 'sitemap.xml')
    return app.serveStatic(req, res, filePath)
  })
  server.get('/service-worker.js', (req, res) => {
    const filePath = join(__dirname, '.next', 'service-worker.js')
    return app.serveStatic(req, res, filePath)
  })
  server.get('/api/ping', (req, res) => res.send('pong'))

  // Si DB deshabilitada en local → levantar sin conectar a Mongo
  if (disableDb) {
    console.log('⚠️  DB DESACTIVADA — solo servidor local.')
    server.use(handler)
    return server.listen(port, (err) => {
      if (err) throw err
      console.log(`✅ Ready on ${config.URL}:${port}`)
    })
  }

  // ========= Conexión Mongo (driver v4) =========
  const { DB_CONNECTION, DB_USER, DB_PASSWORD, DB_NAME } = config
  const uri = DB_CONNECTION
    .replace('<user>', DB_USER)
    .replace('<password>', DB_PASSWORD)
    .replace('<dbname>', DB_NAME)

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  try {
    await client.connect()
    console.log('✅ MongoDB conectado a DB:', DB_NAME)
  } catch (e) {
    console.error('❌ Error conectando a MongoDB:', e?.message || e)
    process.exit(1)
  }

  const db = client.db(DB_NAME)
  const actusDBCollection = db.collection(config.DB_COLLECTION_ACTUS)
  const big5DBCollection = db.collection(config.DB_COLLECTION_BIG5)

  // ============= RUTAS API =============

  // GET Big5 por ID
  server.get('/api/big5', async (req, res) => {
    try {
      const id = req.query?.id
      if (!id || !validMongoId(id)) return res.status(400).json({ error: 'Not a valid id' })
      const data = await big5DBCollection.findOne({ _id: new ObjectId(id) })
      if (!data) return res.status(404).json({ error: 'Not found' })
      return res.json(data)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })

  // POST Actus
  server.post('/api/actus', async (req, res) => {
    try {
      const payload = await actusSchema.validateAsync(req.body)
      const result = await actusDBCollection.insertOne(payload)
      const inserted = await actusDBCollection.findOne({ _id: result.insertedId })

      res.status(201).json(inserted) // responder primero

      // enviar emails en background
      let email = JSON.parse(JSON.stringify(emailDefaults))
      email.html = emailTemplateActus
      email = hidratarEmailBase(email, inserted.emailCliente, inserted.nombreCliente, config.URL, 'Actus')
      // acá insertás en el HTML de Actus los resultados/mbti
      // si tenés un helper, úsalo (hidratarTemplateActus)
      try {
        const { hidratarTemplateActus } = require('./lib/actus/server')
        email.html = hidratarTemplateActus(email.html, inserted.resultados, inserted.mbti)
      } catch (_) {}
      await safeSend(email)

      // admin
      email.to = 'marubuteler@gmail.com'
      email.subject = `Creactivistas Admin | Actus: Resultados de ${escapeHtml(inserted.nombreCliente)} (${inserted.emailCliente})`
      email.text = `Hola Maru, este email fue enviado automáticamente luego de que ${inserted.nombreCliente} completó el test Actus.`
      email.bcc = ['abuteler@enneagonstudios.com']
      await safeSend(email)

    } catch (err) {
      console.error(err)
      return res.status(err.isJoi ? 400 : 500).json({ error: err.message })
    }
  })

  // POST Big5
  server.post('/api/big5', async (req, res) => {
    try {
      const payload = await big5Schema.validateAsync(req.body)
      const result = await big5DBCollection.insertOne(payload)
      const inserted = await big5DBCollection.findOne({ _id: result.insertedId })

      res.status(201).json(inserted) // responder primero

      // email cliente
      let email = JSON.parse(JSON.stringify(emailDefaults))
      email.html = emailTemplateBig5
      email = hidratarEmailBase(email, inserted.clientEmail, inserted.clientName, config.URL, 'Big 5')
      email = hidratarEmailBig5(email, inserted._id)
      await safeSend(email)

      // email admin
      email.to = 'marubuteler@gmail.com'
      email.subject = `Creactivistas Admin | Big 5: Resultados de ${escapeHtml(inserted.clientName)} (${inserted.clientEmail})`
      email.text = `Hola Maru, este email fue enviado automáticamente luego de que ${inserted.clientName} completó el test Big 5.`
      email.bcc = ['abuteler@enneagonstudios.com']
      await safeSend(email)

    } catch (err) {
      console.error(err)
      return res.status(err.isJoi ? 400 : 500).json({ error: err.message })
    }
  })

  // Next.js handler
  server.use(handler)
  server.listen(port, (err) => {
    if (err) throw err
    console.log(`✅ Ready on ${config.URL}:${port}`)
  })
})