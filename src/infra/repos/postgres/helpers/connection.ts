import { Connection, EntityRepository, IDatabaseDriver, MikroORM } from '@mikro-orm/core'

export class PgConnection {
  static instance?: PgConnection
  private connection?: IDatabaseDriver<Connection>
  static orm?: MikroORM

  private constructor () {}

  static getInstance (orm?: MikroORM): PgConnection {
    if (PgConnection.instance === undefined) {
      if (orm !== undefined && orm !== null) {
        PgConnection.orm = orm
      }
      PgConnection.instance = new PgConnection()
    }
    if (PgConnection.orm === undefined || PgConnection.orm === null) throw new Error('ORM is not provided')
    return PgConnection.instance
  }

  async connect (): Promise<void> {
    if (PgConnection.orm !== undefined || PgConnection.orm !== null) {
      this.connection = await PgConnection.orm!.connect()
    } else {
      throw new Error('ORM is not provided')
    }
  }

  async disconnect (force: boolean = false): Promise<void> {
    if (this.connection === undefined) throw new Error('Connection not found')
    await this.connection.close(force)
    this.connection = undefined
  }

  getRepository<Entity> (entityName: string): EntityRepository<Entity> {
    if (this.connection === undefined) throw new Error('Connection not found')
    if (PgConnection.orm !== undefined || PgConnection.orm !== null) {
      return PgConnection.orm!.em.getRepository<Entity>(entityName)
    } else {
      throw new Error('ORM is not provided')
    }
  }
}
