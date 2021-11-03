import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity({ collection: 'Order' })
export class Order {
  @PrimaryKey({ columnType: 'text' })
  id!: string

  @Property()
  total!: number

  @Property({ columnType: 'text' })
  cep!: string

  @Property({ columnType: 'text', fieldName: 'pagSeguroId' })
  pagSeguroId!: string

  @Property()
  confirmed!: boolean

  @Property()
  sent!: boolean

  @Property({ fieldName: 'deliveryCost' })
  deliveryCost!: number

  @Property({ fieldName: 'subTotal' })
  subTotal!: number
}
