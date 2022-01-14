export const env = {
  port: process.env.PORT ?? 8080,
  secret: process.env.JWT_SECRET ?? 'wqerdfgrty345hgr',
  pagSeguro: {
    token: process.env.PAGSEGURO_TOKEN
  }
}
