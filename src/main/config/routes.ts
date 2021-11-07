import { Router, Express } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export const configRoutes = (app: Express): void => {
  const router = Router()
  readdirSync(join(__dirname, '../routes'))
    .filter(file => !file.endsWith('.map'))
    .filter(file => !file.endsWith('.d.ts'))
    .map(async file => {
      (await import(`../routes/${file}`)).default(router)
    })
  app.use('/api', router)
}
