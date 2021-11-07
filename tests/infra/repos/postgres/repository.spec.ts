import { IBackup } from 'pg-mem'
import { makeFakeDb } from '../mocks/connection'
import { Product } from '@/infra/repos/postgres/entities/Product'
import { PgConnection } from '@/infra/repos/postgres/helpers/connection'
import { Repository } from '@/infra/repos/postgres/repository'

describe('PgProductRepository', () => {
  let sut: Repository
  let connection: PgConnection
  let backup: IBackup

  beforeAll(async () => {
    const { db, orm } = await makeFakeDb([Product])
    connection = PgConnection.getInstance(orm)
    await connection.connect()
    backup = db.backup()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  beforeEach(() => {
    backup.restore()
    sut = new Repository()
  })

  it('should return the repository', async () => {
    const repository = sut.getRepository<Product>('Product')

    const count = await repository.count()
    expect(count).toBe(0)
  })
})
