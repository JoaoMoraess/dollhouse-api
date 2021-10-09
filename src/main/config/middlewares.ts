import { Express, json } from 'express'
import cors from 'cors'

export const configMiddlewares = (app: Express): void => {
  app.use(cors())
  app.use(json())
  app.use((req, res, next) => {
    res.type('json')
    next()
  })
}
