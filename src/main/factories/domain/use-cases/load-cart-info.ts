import { LoadCartInfo, setupLoadCartInfo } from '@/domain/use-cases'
import { makePgProductsRepo } from '@/main/factories/infra/repos/postgres'

export const makeLoadCartInfo = (): LoadCartInfo => {
  return setupLoadCartInfo(makePgProductsRepo())
}
