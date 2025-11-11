const { ObjectId } = require('mongodb')

async function enqueueEmail(db, msg, opts = {}) {
  const jobs = db.collection('emailJobs')
  const job = {
    status: 'queued',
    createdAt: new Date(),
    attempts: 0,
    maxAttempts: opts.maxAttempts || 5,
    nextAttemptAt: new Date(),
    msg
  }
  const r = await jobs.insertOne(job)
  return r.insertedId
}

module.exports = { enqueueEmail }