/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require( 'http-proxy-middleware' )

module.exports = app => {
  app.use(
    '/api',
    createProxyMiddleware( {
      target: 'http://localhost:4000',
      pathRewrite: { '^/api/': '/' },
      changeOrigin: true,
    } ),
  )
}
