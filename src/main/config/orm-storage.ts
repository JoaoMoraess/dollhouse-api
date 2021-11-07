import { EntityManager, MikroORM } from '@mikro-orm/core'
import { AsyncLocalStorage } from 'async_hooks'
import { Express } from 'express'

export const configOrmStorage = (app: Express, orm: MikroORM, storage: AsyncLocalStorage<EntityManager>): void => {
  app.use((req, res, next) => {
    storage.run(orm.em.fork(true, true), next, 'route')
  })
}
