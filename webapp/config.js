module.exports = {
  DB_CONNECTION: process.env.DB_CONNECTION || 'mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/<dbname>?retryWrites=true&w=majority',
  DB_USER: process.env.DB_USER || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'creactivistas',
  DB_COLLECTION_BIG5: process.env.DB_COLLECTION_BIG5 || 'big5dev',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  SENDGRID_TEMPLATE_ID: process.env.SENDGRID_TEMPLATE_ID || '',
  URL: process.env.URL || 'http://localhost',
}