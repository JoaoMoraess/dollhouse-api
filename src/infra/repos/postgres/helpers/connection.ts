import { Connection, EntityRepository, IDatabaseDriver, MikroORM } from '@mikro-orm/core'

export class PgConnection {
  private static instance?: PgConnection
  private connection?: IDatabaseDriver<Connection>
  private static orm: MikroORM

  private constructor () {}

  static getInstance (orm?: MikroORM): PgConnection {
    if (PgConnection.instance === undefined) {
      if (orm !== undefined && orm !== null) {
        PgConnection.orm = orm
      }
      PgConnection.instance = new PgConnection()
    }
    if (this.orm === undefined) throw new Error('ORM is not Provider')
    return PgConnection.instance
  }

  async connect (): Promise<void> {
    this.connection = await PgConnection.orm.connect()
  }

  async disconnect (force: boolean = false): Promise<void> {
    if (this.connection === undefined) throw new Error('Connection not found')
    await this.connection.close(force)
    this.connection = undefined
  }

  getRepository<Entity> (entityName: string): EntityRepository<Entity> {
    if (this.connection === undefined) throw new Error('Connection not found')
    return PgConnection.orm.em.getRepository<Entity>(entityName)
  }
}
