import { Middleware } from '@/application/contracts'
import { RequestHandler } from 'express'

type Setup = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Setup = middleware => async (req, res, next) => {
  const { statusCode, data } = await middleware.handle({ ...req.headers })
  if (statusCode === 200) {
    const validEntries = Object.entries(data).filter(([, value]) => value)
    req.locals = { ...req.locals, ...Object.fromEntries(validEntries) }
    next()
  } else {
    res.status(statusCode).json({ error: data.message })
  }
}
