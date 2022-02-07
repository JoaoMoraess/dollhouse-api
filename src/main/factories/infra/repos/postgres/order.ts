import { PgOrderRepository } from '@/infra/repos/postgres'
import { makeUUIdHandler } from '@/main/factories/infra/gateway'

export const makePgOrderRepo = (): PgOrderRepository => {
  return new PgOrderRepository(makeUUIdHandler())
}
