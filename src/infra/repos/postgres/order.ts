import { Repository } from './repository'
import { SaveOrder } from '@/domain/contracts/repos'
import { Order } from './entities/Order'
import { OrderProduct } from './entities/OrderProduct'
import { v4 } from 'uuid'

export class PgOrderRepository extends Repository implements SaveOrder {
  private readonly orderRepository = this.getRepository<Order>('Order')
  private readonly orderProductRepository = this.getRepository<OrderProduct>('OrderProduct')

  async save ({ products, ...orderProps }: SaveOrder.Input): Promise<void> {
    const order = this.orderRepository.create({
      ...orderProps,
      id: v4(),
      confirmed: false,
      sent: false
    })

    const orderProducts = products.map(({ productId, quantity }) => {
      return this.orderProductRepository.create({
        id: v4(),
        order: order.id,
        product: productId,
        quantity
      })
    })
    await this.orderRepository.persistAndFlush(order)
    await this.orderProductRepository.persistAndFlush(orderProducts)
  }
}
