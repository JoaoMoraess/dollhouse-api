import express from 'express'
import { configMiddlewares } from '@/main/config/middlewares'
import { configRoutes } from '@/main/config/routes'

const app = express()
configMiddlewares(app)
configRoutes(app)

export { app }
