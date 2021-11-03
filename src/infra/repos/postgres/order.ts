import { Repository } from './repository'
import { SaveOrder } from '@/domain/contracts/repos'

export class PgOrderRepository extends Repository implements SaveOrder {
  async save ({ cep, deliveryCost, pagSeguroId, products, subTotal, total }: SaveOrder.Input): Promise<void> {

  }
}
