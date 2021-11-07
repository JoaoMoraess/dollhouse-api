import options from '@/infra/repos/postgres/helpers/database-config'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { AsyncLocalStorage } from 'async_hooks'

export const configOrm = async (): Promise<{orm: MikroORM, storage: AsyncLocalStorage<EntityManager>}> => {
  const storage = new AsyncLocalStorage<EntityManager>()
  const orm = await MikroORM.init({
    context: () => storage.getStore(),
    ...options
  })

  return { orm, storage }
}
