const simpleOauthModule = require('simple-oauth2')
const authMiddleWareInit = require('./auth.js')
const callbackMiddleWareInit = require('./callback')
const oauthProvider = process.env.OAUTH_PROVIDER || 'github'
const loginAuthTarget = process.env.AUTH_TARGET || '_self'
const defaultTokenHosts = {
  github: 'https://github.com',
  gitlab: 'https://gitlab.com',
  bitbucket: 'https://bitbucket.org'
}
const defaultAuthorizePaths = {
  github: '/login/oauth/authorize',
  gitlab: '/oauth/authorize',
  bitbucket: '/site/oauth2/authorize'
}
const defaultTokenPaths = {
  github: '/login/oauth/access_token',
  gitlab: '/oauth/token',
  bitbucket: '/site/oauth2/access_token'
}

const config = {
  client: {
    id: process.env.OAUTH_CLIENT_ID,
    secret: process.env.OAUTH_CLIENT_SECRET
  },
  auth: {
    // Supply GIT_HOSTNAME for enterprise github installs.
    tokenHost: process.env.GIT_HOSTNAME || defaultTokenHosts[oauthProvider] || defaultTokenHosts.github,
    tokenPath: process.env.OAUTH_TOKEN_PATH || defaultTokenPaths[oauthProvider] || defaultTokenPaths.github,
    authorizePath: process.env.OAUTH_AUTHORIZE_PATH || defaultAuthorizePaths[oauthProvider] || defaultAuthorizePaths.github
  }
}

const oauth2 = new simpleOauthModule.AuthorizationCode(config)

function indexMiddleWare (req, res) {
  res.send(`Hello<br>
    <a href="/auth" target="${loginAuthTarget}">
      Log in with ${oauthProvider.toUpperCase()}
    </a>`)
}

module.exports = {
  auth: authMiddleWareInit(oauth2, oauthProvider),
  callback: callbackMiddleWareInit(oauth2, oauthProvider),
  success: (req, res) => { res.send('') },
  index: indexMiddleWare
}
