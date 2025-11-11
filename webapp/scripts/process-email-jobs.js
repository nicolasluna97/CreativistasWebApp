const { MongoClient } = require('mongodb')
const config = require('../config')
const sgMail = require('@sendgrid/mail')
if (process.env.SENDGRID_API_KEY) sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sleep(ms){ return new Promise(r=>setTimeout(r, ms)) }

async function main(){
  const uri = (config.DB_CONNECTION || '')
    .replace('<user>', config.DB_USER || '')
    .replace('<password>', config.DB_PASSWORD || '')
    .replace('<dbname>', config.DB_NAME || '')
  if (!uri) throw new Error('MongoDB URI not configured. Check env/config.')

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  await client.connect()
  const db = client.db(config.DB_NAME)
  const jobs = db.collection('emailJobs')

  while(true){
    const now = new Date()
    const res = await jobs.findOneAndUpdate(
      { status: 'queued', nextAttemptAt: { $lte: now } },
      { $set: { status: 'processing', startedAt: new Date() } },
      { sort: { createdAt: 1 }, returnDocument: 'after' }
    )

    const job = res.value
    if(!job){
      await sleep(2000)
      continue
    }

    try{
      await sgMail.send(job.msg)
      await jobs.updateOne({ _id: job._id }, { $set: { status: 'sent', sentAt: new Date() } })
      console.log('Email sent', job._id.toString())
    }catch(err){
      const attempts = (job.attempts || 0) + 1
      const max = job.maxAttempts || 5
      const backoffMs = Math.min(60_000 * Math.pow(2, attempts), 60 * 60 * 1000)
      const next = new Date(Date.now() + backoffMs)
      const update = {
        $set: {
          status: attempts >= max ? 'failed' : 'queued',
          lastError: (err && err.message) ? err.message : String(err),
          attempts,
          nextAttemptAt: next,
          lastAttemptAt: new Date()
        }
      }
      await jobs.updateOne({ _id: job._id }, update)
      console.error('Send failed for job', job._id.toString(), 'attempts', attempts, 'err', err && err.message)
    }
  }
}

main().catch(e=>{ console.error(e); process.exit(1) })