import { EntityRepository } from '@mikro-orm/core'
import { PgConnection } from './helpers/connection'

export class Repository {
  constructor (private readonly connection: PgConnection = PgConnection.getInstance()) {}

  getRepository<Entity> (entityName: string): EntityRepository<Entity> {
    return this.connection.getRepository(entityName)
  }
}
