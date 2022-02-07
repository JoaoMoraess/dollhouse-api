import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity({ collection: 'Product' })
export class Product {
  @PrimaryKey({ columnType: 'text' })
  id!: string

  @Property({ columnType: 'text' })
  name!: string

  @Property()
  stock!: number

  @Property()
  price!: number

  @Property({ nullable: true, columnType: 'text' })
  description?: string

  @Property({ columnType: 'text', fieldName: 'imageUrl' })
  imageUrl!: string
}
