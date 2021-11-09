import { DbTransaction } from '@/application/contracts'
import { Connection, EntityManager, EntityRepository, IDatabaseDriver, MikroORM } from '@mikro-orm/core'
import { AsyncLocalStorage } from 'async_hooks'

export class PgConnection implements DbTransaction {
  static storage: AsyncLocalStorage<EntityManager> = new AsyncLocalStorage()
  static instance?: PgConnection
  static orm?: MikroORM

  private connection?: IDatabaseDriver<Connection>

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
    this.connection = await PgConnection.orm!.connect()
  }

  async disconnect (force: boolean = false): Promise<void> {
    if (this.connection === undefined) throw new Error('Connection not found')
    await this.connection.close(force)
    this.connection = undefined
  }

  getRepository<Entity> (entityName: string): EntityRepository<Entity> {
    if (this.connection === undefined) throw new Error('Connection not found')
    return PgConnection.orm!.em.getRepository<Entity>(entityName)
  }

  async openTransaction (): Promise<void> {
    await PgConnection.orm!.em.begin()
  }

  async commit (): Promise<void> {
    await PgConnection.orm!.em.commit()
  }

  async roolback (): Promise<void> {
    await PgConnection.orm!.em.rollback()
  }
}
