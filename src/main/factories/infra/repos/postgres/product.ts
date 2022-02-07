import { PgProductRepository } from '@/infra/repos/postgres'
import { makeUUIdHandler } from '@/main/factories/infra/gateway'

export const makePgProductsRepo = (): PgProductRepository => {
  return new PgProductRepository(makeUUIdHandler())
}
