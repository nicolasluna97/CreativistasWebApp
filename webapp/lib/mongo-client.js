const { MongoClient } = require('mongodb')
const config = require('../config')

let cachedClient = null
let cachedDb = null

async function connect() {
  const uri = (config.DB_CONNECTION || '')
    .replace('<user>', config.DB_USER || '')
    .replace('<password>', config.DB_PASSWORD || '')
    .replace('<dbname>', config.DB_NAME || '')

  if (!uri) {
    throw new Error('MongoDB URI not configured. Check DB_CONNECTION, DB_USER, DB_PASSWORD, DB_NAME.')
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    // IMPORTANT: store the connecting promise so concurrent invocations reuse it
    global._mongoClientPromise = client.connect()
  }

  cachedClient = await global._mongoClientPromise
  cachedDb = cachedClient.db(config.DB_NAME)

  return { client: cachedClient, db: cachedDb }
}

module.exports = { connect }