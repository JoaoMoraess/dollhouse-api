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
import { User } from '@/infra/repos/postgres/entities/User'

describe('EffectPurchase route', () => {
  const storage = new AsyncLocalStorage<EntityManager>()
  let ormStub: MikroORM<IDatabaseDriver<Connection>>

  let connection: PgConnection
  let pgProductRepo: EntityRepository<Product>
  let backup: IBackup

  beforeAll(async () => {
    const { db, orm } = await makeFakeDb([Product, Order, OrderProduct, User])
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

  describe('POST /purchase/effect', () => {
    const pagseguroChargeSpy = jest.fn()
    const correiosApiSpy = jest.fn()

    jest.mock('@/infra/gateways/pagseguro-api', () => ({
      PagSeguroApi: jest.fn().mockReturnValue({ charge: pagseguroChargeSpy })
    }))

    jest.mock('@/infra/gateways/correios-api', () => ({
      CorreiosApi: jest.fn().mockReturnValue({ calc: correiosApiSpy })
    }))

    it('should return 204 on success', async () => {
      pagseguroChargeSpy.mockResolvedValueOnce({
        paymentResponse: { message: 'SUCESSO', reference: 'any_reference', code: 'any_code' },
        id: 'any_id'
      })
      correiosApiSpy.mockResolvedValueOnce(1209)

      const fakeProduct = {
        id: 'any_fake_id',
        imageUrl: 'any_fake_image',
        name: 'any_product_name',
        price: 1290,
        stock: 99
      }
      await pgProductRepo.persistAndFlush(pgProductRepo.create(fakeProduct))

      const { statusCode } = await request(configApp({ orm: ormStub, storage }))
        .post('/api/purchase/effect')
        .send({
          localProducts: { [`${fakeProduct.id}`]: 2 },
          cep: '12312313',
          cardBrand: 'VISA',
          cardNumber: '4111111111111111',
          cardExpirationMoth: '12',
          cardExpirationYear: '2030',
          cardSecurityCode: '123',
          cardHolderName: 'nome teste'
        })

      expect(statusCode).toBe(204)
    })
    it('should return 400 if product is not in stock', async () => {
      const fakeProduct = {
        id: 'other_fake_id',
        imageUrl: 'any_fake_image',
        name: 'any_product_name',
        price: 1290,
        stock: 1
      }
      await pgProductRepo.persistAndFlush(pgProductRepo.create(fakeProduct))

      const { statusCode, body } = await request(configApp({ orm: ormStub, storage }))
        .post('/api/purchase/effect')
        .send({
          localProducts: { [`${fakeProduct.id}`]: 2 },
          cep: '12312313',
          cardBrand: 'VISA',
          cardNumber: '4111111111111111',
          cardExpirationMoth: '12',
          cardExpirationYear: '2030',
          cardSecurityCode: '123',
          cardHolderName: 'nome teste'
        })

      expect(statusCode).toBe(400)
      expect(body).toEqual({
        error: `Restam apenas 1 ${fakeProduct.name} em estoque!`
      })
    })

    it('should return 400 if product is not valid', async () => {
      const fakeProduct = {
        id: 'any_id',
        imageUrl: 'any_fake_image',
        name: 'any_product_name',
        price: 1290,
        stock: 1
      }
      await pgProductRepo.persistAndFlush(pgProductRepo.create(fakeProduct))

      const { statusCode, body } = await request(configApp({ orm: ormStub, storage }))
        .post('/api/purchase/effect')
        .send({
          localProducts: { ainvalid_id: 2 },
          cep: '12312313',
          cardBrand: 'VISA',
          cardNumber: '4111111111111111',
          cardExpirationMoth: '12',
          cardExpirationYear: '2030',
          cardSecurityCode: '123',
          cardHolderName: 'nome teste'
        })

      expect(statusCode).toBe(400)
      expect(body).toEqual({
        error: 'Carrinho invalido!'
      })
    })
  })

  describe('POST /purchase/info', () => {
    it('should return the correct purchase info', async () => {
      const productId = 'fake_id'
      const fakeProduct = { id: productId, imageUrl: 'any_image', name: 'any_name', price: 1290, stock: 99 }
      await pgProductRepo.persistAndFlush(pgProductRepo.create(fakeProduct))
      const quantity = 3

      const { statusCode, body } = await request(configApp({ orm: ormStub, storage }))
        .post('/api/purchase/info')
        .send({ localProducts: { [`${productId}`]: quantity } })

      expect(statusCode).toBe(200)
      expect(body).toEqual({
        products: [{ ...fakeProduct, quantity }],
        subTotal: fakeProduct.price * quantity
      })
    })

    it('should return 400 if product is not in stock', async () => {
      const productId = 'other_id'
      const fakeProduct = { id: productId, imageUrl: 'any_image', name: 'any_name', price: 1290, stock: 1 }
      await pgProductRepo.persistAndFlush(pgProductRepo.create(fakeProduct))
      const quantity = 3

      const { statusCode, body } = await request(configApp({ orm: ormStub, storage }))
        .post('/api/purchase/info')
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
        .post('/api/purchase/info')
        .send({ localProducts: { [`${productId}`]: quantity } })

      expect(statusCode).toBe(400)
      expect(body).toEqual({
        error: 'Carrinho invalido!'
      })
    })
  })
})
