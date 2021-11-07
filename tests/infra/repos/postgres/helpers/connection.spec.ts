import { MikroORM } from '@mikro-orm/core'
import { IBackup } from 'pg-mem'
import { makeFakeDb } from '../../mocks/connection'
import { Product } from '@/infra/repos/postgres/entities/Product'
import { PgConnection } from '@/infra/repos/postgres/helpers/connection'

describe('Connection', () => {
  let sut: PgConnection
  let backup: IBackup
  let orm: MikroORM

  beforeAll(async () => {
    const fakeDb = await makeFakeDb([Product])
    orm = fakeDb.orm
    backup = fakeDb.db.backup()
  })

  afterEach(async () => {
    PgConnection.instance = undefined
    PgConnection.orm = undefined
  })

  beforeEach(() => {
    backup.restore()
  })

  it('should connect on database', async () => {
    sut = PgConnection.getInstance(orm)

    await sut.connect()
    const isConnected = await orm.isConnected()

    expect(isConnected).toBeTruthy()

    await sut.disconnect()
  })

  it('should disconnect to database', async () => {
    sut = PgConnection.getInstance(orm)

    await sut.connect()
    await sut.disconnect()
    const isConnected = await orm.isConnected()
    expect(isConnected).toBeFalsy()
  })

  it('should get the repository', async () => {
    sut = PgConnection.getInstance(orm)

    await sut.connect()
    const productRepository = sut.getRepository<Product>('Product')
    const productsCount = await productRepository.count()

    expect(productsCount).toBe(0)
    await sut.disconnect()
  })

  it('should return the instace of connection', async () => {
    sut = PgConnection.getInstance(orm)

    const connection = PgConnection.getInstance()
    await connection.connect()
    const isConnected = await orm.isConnected()
    expect(isConnected).toBeTruthy()
    await connection.disconnect()
  })

  it('should throw if orm is not provided', async () => {
    expect(() => {
      PgConnection.getInstance()
    }).toThrow(new Error('ORM is not provided'))
  })

  it('should throw if is not connected', async () => {
    const sut = PgConnection.getInstance(orm)
    expect(() => {
      sut.getRepository<Product>('Product')
    }).toThrow(new Error('Connection not found'))
  })

  it('should throw if is not connected', async () => {
    const sut = PgConnection.getInstance(orm)
    const promise = sut.disconnect()
    await expect(promise).rejects.toThrow(new Error('Connection not found'))
  })
})
