const dev = process.env.NODE_ENV !== 'production'
require('dotenv').config()

const next = require('next')
const routes = require('./routes')
const express = require('express')
const helmet = require('helmet')
const sgMail = require('@sendgrid/mail')
const { join } = require('path')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const validMongoId = require('./lib/valid-mongoid')
const config = require('./config')
const emailTemplateActus = require('./emailtemplate-actus')
const emailTemplateBig5 = require('./emailtemplate-big5')
const { hidratarTemplateActus } = require('./lib/actus/server')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const app = next({ dev })
const handler = routes.getRequestHandler(app)
const port = parseInt(process.env.PORT, 10) || 3000

// NUEVO FLAG para desactivar DB en local
const disableDb = process.env.DISABLE_DB === '1'

const emailDefaults = {
  to: '',
  from: 'Creactivistas <marubuteler@gmail.com>',
  subject: 'Creactivistas | Resultados del test $__TESTNAME__',
  text: 'Hola $__NAME__, este email fue enviado automáticamente luego que completaste el test $__TESTNAME__. Si recibiste este correo es probable que tu casilla no soporte HTML.'
}

console.log(`> Initializing on ${config.URL}:${port}...`)

app.prepare().then(() => {
  const server = express()
  server.use(helmet())
  server.use(express.json())

  server.get('/api/ping', (req, res) => res.send('pong'))

  // Si la DB está desactivada, no conectar
  if (disableDb) {
    console.log('⚠️ DB DESACTIVADA — solo servidor local.')
    server.use(handler)
    server.listen(port, err => {
      if (err) throw err
      console.log(`> Ready on ${config.URL}:${port}`)
    })
    return
  }

  // ==========================
  // Conexión Mongo normal
  // ==========================
  const { DB_CONNECTION, DB_USER, DB_PASSWORD, DB_NAME } = config
  const uri = DB_CONNECTION
    .replace('<user>', DB_USER)
    .replace('<password>', DB_PASSWORD)
    .replace('<dbname>', DB_NAME)

  console.log('MongoDB uri:', uri)

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  client.connect(err => {
    if (err) {
      console.error('❌ Error conectando a MongoDB:', err.message)
      return
    }

    const db = client.db(config.DB_NAME)
    const actusDBCollection = db.collection(config.DB_COLLECTION_ACTUS)
    const big5DBCollection = db.collection(config.DB_COLLECTION_BIG5)

    // acá mantenés tus endpoints /api/actus, /api/big5, etc.
    // ...

    server.use(handler)

    server.listen(port, err => {
      if (err) throw err
      console.log(`✅ Ready on ${config.URL}:${port}`)
    })
  })
})
