import { MikroORM } from '@mikro-orm/core'

import options from '@/infra/repos/postgres/helpers/database-config'
import { IMemoryDb, newDb } from 'pg-mem'

export const makeFakeDb = async (entities?: any[]): Promise<{db: IMemoryDb, orm: MikroORM}> => {
  const db = newDb()
  const orm: MikroORM = await db.adapters.createMikroOrm({
    ...options,
    entitiesTs: entities ?? options.entitiesTs
  })
  await orm.getSchemaGenerator().createSchema()
  return { db, orm }
}
