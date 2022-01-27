import { IBackup } from 'pg-mem'
import { PgProductRepository } from '@/infra/repos/postgres'
import { makeFakeDb } from '../mocks/connection'
import { Product } from '@/infra/repos/postgres/entities/Product'
import { PgConnection } from '@/infra/repos/postgres/helpers/connection'
import { Repository } from '@/infra/repos/postgres/repository'
import { EntityRepository } from '@mikro-orm/core'

describe('PgProductRepository', () => {
  let sut: PgProductRepository
  let connection: PgConnection
  let pgProductRepo: EntityRepository<Product>
  let backup: IBackup

  beforeAll(async () => {
    const { db, orm } = await makeFakeDb([Product])
    connection = PgConnection.getInstance(orm)
    await connection.connect()
    backup = db.backup()
    pgProductRepo = connection.getRepository<Product>('Product')
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgProductRepository()
  })

  it('should extend PgRepository', async () => {
    expect(sut).toBeInstanceOf(Repository)
  })
  describe('loadByIds', () => {
    it('should return a correct list of products', async () => {
      const ids = ['1234', '4321']

      const entitie1 = pgProductRepo.create({
        id: ids[0],
        imageUrl: 'any_image_url',
        name: 'any_name',
        price: 2390,
        stock: 12
      })
      const entitie2 = pgProductRepo.create({
        id: ids[1],
        imageUrl: 'other_image_url',
        name: 'other_name',
        price: 2930,
        stock: 16
      })
      await pgProductRepo.persistAndFlush([entitie1, entitie2])

      const products = await sut.loadByIds(ids)
      expect(products).toEqual([entitie1, entitie2])
    })
  })
  describe('load', () => {
    it('should return a correct offset', async () => {
      const entitie1 = pgProductRepo.create({
        id: 'any_id',
        imageUrl: 'any_image_url',
        name: 'any_name',
        price: 2390,
        stock: 12
      })
      const entitie2 = pgProductRepo.create({
        id: 'other_id',
        imageUrl: 'other_image_url',
        name: 'other_name',
        price: 2930,
        stock: 16
      })
      await pgProductRepo.persistAndFlush([entitie1, entitie2])

      const products = await sut.load({ limit: 1, offset: 1, orderBy: 'ASC', sortBy: 'id' })
      expect(products).toEqual([entitie2])
    })
  })
  describe('countTotal', () => {
    it('should return a correct offset', async () => {
      const entitie1 = pgProductRepo.create({
        id: 'any_product_id',
        imageUrl: 'any_image_url',
        name: 'any_name',
        price: 2390,
        stock: 12
      })
      const entitie2 = pgProductRepo.create({
        id: 'other_product_id',
        imageUrl: 'other_image_url',
        name: 'other_name',
        price: 2930,
        stock: 16
      })
      await pgProductRepo.persistAndFlush([entitie1, entitie2])

      const productsCount = await sut.countTotal()
      expect(productsCount).toEqual(2)
    })
  })
})
