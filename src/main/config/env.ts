export const env = {
  port: process.env.PORT ?? 8080,
  pagSeguro: {
    token: process.env.PAGSEGURO_TOKEN
  }
}
