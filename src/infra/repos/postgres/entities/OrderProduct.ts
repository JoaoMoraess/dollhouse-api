import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Order } from './Order'
import { Product } from './Product'

@Entity({ collection: 'OrderProduct' })
export class OrderProduct {
  @PrimaryKey({ columnType: 'text' })
  id!: string

  @ManyToOne({ entity: () => Product, fieldName: 'product', onUpdateIntegrity: 'cascade' })
  product!: Product

  @Property()
  quantity!: number

  @ManyToOne({ entity: () => Order, fieldName: 'order', onUpdateIntegrity: 'cascade', onDelete: 'cascade' })
  order!: Order
}
