import { PgProductRepository } from '@/infra/repos/postgres'

export const makePgProductsRepo = (): PgProductRepository => {
  return new PgProductRepository()
}
