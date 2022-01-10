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
    backup.restore()
  })

  describe('POST /cart/info', () => {
    it('should return the correct cart info', async () => {
      const productId = 'any_fake_id'
      const fakeProduct = { id: productId, imageUrl: 'any_image', name: 'any_name', price: 1290, stock: 99 }
      await pgProductRepo.persistAndFlush(pgProductRepo.create(fakeProduct))
      const quantity = 3

      const { statusCode, body } = await request(configApp({ orm: ormStub, storage }))
        .post('/api/cart/info')
        .send({ localProducts: { [`${productId}`]: quantity } })

      expect(statusCode).toBe(200)
      expect(body).toEqual({
        products: [{ ...fakeProduct, quantity }],
        subTotal: fakeProduct.price * quantity
      })
    })

    it('should return 400 if product is not in stock', async () => {
      const productId = 'other_fake_id'
      const fakeProduct = { id: productId, imageUrl: 'any_image', name: 'any_name', price: 1290, stock: 1 }
      await pgProductRepo.persistAndFlush(pgProductRepo.create(fakeProduct))
      const quantity = 3

      const { statusCode, body } = await request(configApp({ orm: ormStub, storage }))
        .post('/api/cart/info')
        .send({ localProducts: { [`${productId}`]: quantity } })

      expect(statusCode).toBe(400)
      expect(body).toEqual({
        error: `Restam apenas 1 ${fakeProduct.name} em estoque!`
      })
    })

    it('should return 400 if product is not valid', async () => {
      const productId = 'invalid_fake_id'
      const quantity = 3

      const { statusCode, body } = await request(configApp({ orm: ormStub, storage }))
        .post('/api/cart/info')
        .send({ localProducts: { [`${productId}`]: quantity } })

      expect(statusCode).toBe(400)
      expect(body).toEqual({
        error: 'Carrinho invalido!'
      })
    })
  })
})
