import { MikroORM } from '@mikro-orm/core'
import { IBackup } from 'pg-mem'
import { makeFakeDb } from '../mocks/connection'
import { Product } from '@/infra/repos/postgres/entities/Product'
import { PgConnection } from '@/infra/repos/postgres/helpers/connection'

describe('Connection', () => {
  let sut: PgConnection
  let backup: IBackup
  let orm: MikroORM

  beforeAll(async () => {
    const fakeDb = await makeFakeDb([Product])
    orm = fakeDb.orm
    sut = PgConnection.getInstance(orm)
    backup = fakeDb.db.backup()
  })

  beforeEach(() => {
    backup.restore()
    sut = PgConnection.getInstance(orm)
  })

  it('should connect on database', async () => {
    await sut.connect()
    const isConnected = await orm.isConnected()

    expect(isConnected).toBeTruthy()

    await sut.disconnect()
  })
})
