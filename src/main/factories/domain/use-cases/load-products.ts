import { LoadProducts, setupLoadProducts } from '@/domain/use-cases'
import { makePgProductsRepo } from '@/main/factories/infra/repos/postgres'

export const makeLoadProducts = (): LoadProducts => {
  return setupLoadProducts(makePgProductsRepo())
}
