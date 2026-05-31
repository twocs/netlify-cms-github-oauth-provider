const randomstring = require('randomstring')
const defaultScopes = {
  github: 'repo,user',
  gitlab: 'api',
  bitbucket: 'repository account email'
}

module.exports = (oauth2, oauthProvider) => {
  // Authorization uri definition
  const authorizationUri = oauth2.authorizeURL({
    redirectURI: process.env.REDIRECT_URL,
    scope: process.env.SCOPES || defaultScopes[oauthProvider] || defaultScopes.github,
    state: randomstring.generate(32)
  })

  return (req, res, next) => {
    res.redirect(authorizationUri)
  }
}
