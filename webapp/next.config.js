const isProd = process.env.NODE_ENV === 'production'

// Si tenés next-offline instalado:
let withOffline
try {
  withOffline = require('next-offline')
} catch {
  withOffline = (cfg) => cfg
}

const baseConfig = {
  experimental: {
    newNextLinkBehavior: false // quitalo cuando termines de migrar Links
  }
}

module.exports = isProd
  ? withOffline({
      ...baseConfig,
      // Opcional: config de workbox
      workboxOpts: { swDest: 'static/service-worker.js' }
    })
  : {
      ...baseConfig,
      // En dev, deshabilitamos totalmente next-offline
      poweredByHeader: false
    }

    module.exports = {
  poweredByHeader: false,
}