import { PgConnection } from '@/infra/repos/postgres/helpers/connection'
import { EntityRepository, Connection, EntityManager, IDatabaseDriver, MikroORM } from '@mikro-orm/core'
import { IBackup } from 'pg-mem'
import { makeFakeDb } from '@/tests/infra/repos/mocks/connection'
import { Product } from '@/infra/repos/postgres/entities/Product'
import request from 'supertest'
import { configApp } from '@/main/config/app'
import { AsyncLocalStorage } from 'async_hooks'
import { Order } from '@/infra/repos/postgres/entities/Order'
import { OrderProduct } from '@/infra/repos/postgres/entities/OrderProduct'

describe('Product routes', () => {
  const storage = new AsyncLocalStorage<EntityManager>()
  let ormStub: MikroORM<IDatabaseDriver<Connection>>

  let connection: PgConnection
  let pgProductRepo: EntityRepository<Product>
  let backup: IBackup
  let fakeProduct: Product

  beforeAll(async () => {
    const { db, orm } = await makeFakeDb([Product, Order, OrderProduct])
    connection = PgConnection.getInstance(orm)
    await connection.connect()
    backup = db.backup()
    pgProductRepo = connection.getRepository<Product>('Product') as any
    ormStub = orm
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  beforeEach(() => {
    fakeProduct = pgProductRepo.create({
      id: 'any_fake_id',
      imageUrl: 'any_fake_image',
      name: 'any_product_name',
      price: 1290,
      stock: 99
    })
    backup.restore()
  })

  describe('GET /products', () => {
    it('should return products on success', async () => {
      await pgProductRepo.persistAndFlush(fakeProduct)

      const { statusCode, body } = await request(configApp({ orm: ormStub, storage }))
        .get('/api/products')
        .send({ limit: 2, offset: 0 })

      expect(statusCode).toBe(200)
      expect(body).toEqual({ products: [fakeProduct] })
    })
  })
})
