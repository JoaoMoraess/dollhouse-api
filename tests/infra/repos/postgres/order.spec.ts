import { IBackup } from 'pg-mem'
import { PgOrderRepository } from '@/infra/repos/postgres'
import { makeFakeDb } from '../mocks/connection'
import { PgConnection } from '@/infra/repos/postgres/helpers/connection'
import { Repository } from '@/infra/repos/postgres/repository'
import { Order } from '@/infra/repos/postgres/entities/Order'
import { Product } from '@/infra/repos/postgres/entities/Product'
import { OrderProduct } from '@/infra/repos/postgres/entities/OrderProduct'
import { EntityRepository } from '@mikro-orm/core'

import { UUIdHandler } from '@/infra/gateways'

describe('PgOrderRepository', () => {
  let sut: PgOrderRepository
  let connection: PgConnection
  let backup: IBackup
  let pgProductRepo: EntityRepository<Product>
  let pgOrderRepo: EntityRepository<Order>
  let pgOrderProductRepo: EntityRepository<OrderProduct>

  beforeAll(async () => {
    const { db, orm } = await makeFakeDb([Product, Order, OrderProduct])
    connection = PgConnection.getInstance(orm)
    await connection.connect()
    backup = db.backup()
    pgProductRepo = connection.getRepository<Product>('Product')
    pgOrderRepo = connection.getRepository<Order>('Order')
    pgOrderProductRepo = connection.getRepository<OrderProduct>('OrderProduct')
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgOrderRepository(new UUIdHandler())
  })

  it('should extend PgRepository', async () => {
    expect(sut).toBeInstanceOf(Repository)
  })

  describe('save', () => {
    it('should save the order', async () => {
      const ids = ['1234', '4321']

      const product1 = pgProductRepo.create({
        id: ids[0],
        imageUrl: 'any_image_url',
        name: 'any_name',
        price: 2390,
        stock: 12
      })
      const product2 = pgProductRepo.create({
        id: ids[1],
        imageUrl: 'other_image_url',
        name: 'other_name',
        price: 2930,
        stock: 16
      })
      await pgProductRepo.persistAndFlush([product1, product2])

      await sut.save({
        cep: 'any_cep',
        deliveryCost: 123,
        pagSeguroId: 'any_pagseguro_id',
        products: [{
          productId: ids[0],
          quantity: 2
        },
        {
          productId: ids[1],
          quantity: 4
        }],
        subTotal: 1234,
        total: 1740
      })

      const orderProducts = await pgOrderProductRepo.findAll()
      const orders = await pgOrderRepo.findAll()

      expect(orderProducts[0].order).toEqual({ id: orders[0].id })
      expect(orderProducts[0].product.id).toBe(product1.id)
      expect(orderProducts[0].quantity).toBe(2)
      expect(orderProducts[1].order).toEqual({ id: orders[0].id })
      expect(orderProducts[1].product.id).toBe(product2.id)
      expect(orderProducts[1].quantity).toBe(4)

      expect(orders[0].cep).toBe('any_cep')
      expect(orders[0].confirmed).toBeFalsy()
      expect(orders[0].deliveryCost).toBe(123)
      expect(orders[0].pagSeguroId).toBe('any_pagseguro_id')
      expect(orders[0].sent).toBeFalsy()
      expect(orders[0].subTotal).toBe(1234)
      expect(orders[0].total).toBe(1740)
    })
  })
})
