import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core'
import { Product } from '@/infra/repos/postgres/entities/Product'
import { PgConnection } from '@/infra/repos/postgres/helpers/connection'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Connection', () => {
  let sut: PgConnection
  let orm: MockProxy<MikroORM>
  let connectionSpy: MockProxy<IDatabaseDriver<Connection>>

  beforeAll(async () => {
    connectionSpy = mock<IDatabaseDriver<Connection>>()
    orm = mock<MikroORM>()
    orm.em.getRepository = jest.fn().mockReturnValue('any_repository')
    orm.em.begin = jest.fn()
    orm.em.commit = jest.fn()
    orm.em.rollback = jest.fn()
    orm.connect.mockResolvedValue(connectionSpy)
    connectionSpy.close.mockResolvedValueOnce()
  })

  afterEach(async () => {
    PgConnection.instance = undefined
    PgConnection.orm = undefined
  })

  it('should connect on database', async () => {
    sut = PgConnection.getInstance(orm)

    await sut.connect()

    expect(orm.connect).toHaveBeenCalled()
    expect(orm.connect).toHaveBeenCalledTimes(1)

    await sut.disconnect()
  })

  it('should disconnect to database', async () => {
    sut = PgConnection.getInstance(orm)

    await sut.connect()
    await sut.disconnect()
    expect(connectionSpy.close).toHaveBeenCalled()
    expect(connectionSpy.close).toHaveBeenCalledTimes(1)
  })

  it('should call getRepository', async () => {
    sut = PgConnection.getInstance(orm)

    await sut.connect()
    const repository = sut.getRepository<Product>('Product')

    expect(repository).toBe('any_repository')
    await sut.disconnect()
  })

  it('should return the instace of connection', async () => {
    const connectionMock1 = { name: 'first_connection', close: () => null } as any
    orm.connect.mockResolvedValueOnce(connectionMock1)

    sut = PgConnection.getInstance(orm)

    const connectionMock2 = { name: 'second_connection', close: () => null } as any
    orm.connect.mockResolvedValueOnce(connectionMock2)

    const connection = PgConnection.getInstance()

    await sut.connect()
    expect(connection).toEqual({ connection: connectionMock1 })
    await sut.disconnect()
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

  it('should openTransaction calls MikroOrm.begin', async () => {
    const sut = PgConnection.getInstance(orm)
    await sut.connect()
    await sut.openTransaction()

    expect(orm.em.begin).toHaveBeenCalledWith()
    expect(orm.em.begin).toHaveBeenCalledTimes(1)

    await sut.disconnect()
  })
  it('should commit cals MikroOrm.commit', async () => {
    const sut = PgConnection.getInstance(orm)
    await sut.connect()
    await sut.openTransaction()
    await sut.commit()

    expect(orm.em.commit).toHaveBeenCalledWith()
    expect(orm.em.commit).toHaveBeenCalledTimes(1)

    await sut.disconnect()
  })
})
