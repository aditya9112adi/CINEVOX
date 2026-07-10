const jwt = require('jsonwebtoken')

async function verifyFirebaseToken(idToken) {
  const projectId = 'movies-app-auth-a8f8b'
  const decoded = jwt.decode(idToken, { complete: true })
  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('Invalid token structure')
  }

  const kid = decoded.header.kid
  const keysResponse = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com')
  const keys = await keysResponse.json()
  const publicKey = keys[kid]
  if (!publicKey) {
    throw new Error('Invalid key ID')
  }

  return jwt.verify(idToken, publicKey, {
    audience: projectId,
    issuer: `https://securetoken.google.com/${projectId}`,
    algorithms: ['RS256']
  })
}

module.exports = { verifyFirebaseToken }
