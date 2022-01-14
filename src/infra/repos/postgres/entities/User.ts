import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity({ collection: 'User' })
export class User {
  @PrimaryKey({ columnType: 'text' })
  id!: string

  @Property({ columnType: 'text' })
  email!: string

  @Property({ columnType: 'text' })
  name!: string

  @Property({ columnType: 'text' })
  password!: string

  @Property({ columnType: 'text', nullable: true })
  role?: string
}
