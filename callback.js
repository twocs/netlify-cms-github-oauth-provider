const generateScript = require('./login_script.js')

module.exports = (oauth2, oauthProvider) => {
  function callbackMiddleWare (req, res, next) {
    const code = req.query.code
    const options = {
      code
    }

    if (oauthProvider === 'gitlab' || oauthProvider === 'bitbucket') {
      options.grant_type = 'authorization_code'
      options.redirect_uri = process.env.REDIRECT_URL
    }

    if (oauthProvider === 'gitlab') {
      options.client_id = process.env.OAUTH_CLIENT_ID
      options.client_secret = process.env.OAUTH_CLIENT_SECRET
    }

    oauth2.getToken(options)
      .then(result => {
        const token = oauth2.createToken(result)
        const tokenData = token.token && token.token.token ? token.token.token : token.token
        const content = {
          token: tokenData.access_token,
          provider: oauthProvider
        }
        return { message: 'success', content }
      })
      .catch(error => {
        console.error('Access Token Error', error.message)
        return { message: 'error', content: JSON.stringify(error) }
      })
      .then(result => {
        const script = generateScript(oauthProvider, result.message, result.content)
        return res.send(script)
      })
  }
  return callbackMiddleWare
}
