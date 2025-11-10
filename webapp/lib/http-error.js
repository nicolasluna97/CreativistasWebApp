class HttpError extends Error {
  constructor(status = 500, message = 'Internal Server Error', expose = false) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.expose = expose // si true, se puede enviar el mensaje al cliente
  }
}
module.exports = HttpError