import { Connection, EntityRepository, IDatabaseDriver, MikroORM } from '@mikro-orm/core'

export class PgConnection {
  private static instance?: PgConnection
  private connection?: IDatabaseDriver<Connection>

  private constructor (private readonly orm: MikroORM) {}

  static getInstance (orm: MikroORM): PgConnection {
    if (PgConnection.instance === undefined) PgConnection.instance = new PgConnection(orm)
    return PgConnection.instance
  }

  async connect (): Promise<void> {
    const isConnected = await this.orm.isConnected()
    if (!isConnected) {
      this.connection = await this.orm.connect()
    } else {
      console.log('database already connected!')
    }
  }

  async disconnect (): Promise<void> {
    if (this.connection === undefined) throw new Error('Connection not found')
    await this.connection.close()
    this.connection = undefined
  }

  getRepository<Entity> (entityName: string): EntityRepository<Entity> {
    if (this.connection === undefined) throw new Error('Connection not found')
    return this.orm.em.getRepository<Entity>(entityName)
  }
}
