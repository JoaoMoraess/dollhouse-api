import { Repository } from './repository'
import { SaveOrder } from '@/domain/contracts/repos'

export class PgOrderRepository extends Repository implements SaveOrder {
  async save ({ cep, deliveryCost, pagSeguroId, products, subTotal, total }: SaveOrder.Input): Promise<void> {
    await this
      .connect(() => this.prisma.order.create({
        data: {
          confirmed: false,
          pagSeguroId,
          cep,
          sent: false,
          deliveryCost,
          subTotal,
          total,
          products: {
            createMany: {
              data: products
            }
          }
        }
      }))
  }
}
