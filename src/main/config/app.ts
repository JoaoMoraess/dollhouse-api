import express, { Express } from 'express'
import { configMiddlewares } from '@/main/config/middlewares'
import { configRoutes } from '@/main/config/routes'
import { configOrmStorage } from './orm-storage'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { AsyncLocalStorage } from 'async_hooks'

const configApp = (ormProps: { orm: MikroORM, storage: AsyncLocalStorage<EntityManager> }): Express => {
  const app = express()

  configOrmStorage(app, ormProps.orm, ormProps.storage)
  configMiddlewares(app)
  configRoutes(app)

  return app
}

export { configApp }
