export const env = {
  port: process.env.PORT ?? 8080,
  secret: process.env.JWT_SECRET ?? 'wqerdfgrty345hgr',
  pagSeguro: {
    token: process.env.PAGSEGURO_TOKEN
  },
  s3: {
    accessKey: process.env.AWS_S3_ACCESS_KEY ?? '',
    secret: process.env.AWS_S3_SECRET ?? '',
    bucket: process.env.AWS_S3_BUCKET ?? ''
  }
}
