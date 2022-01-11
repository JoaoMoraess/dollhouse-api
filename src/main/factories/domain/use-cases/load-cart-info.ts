import { LoadPurchaseInfo, setupLoadPurchaseInfo } from '@/domain/use-cases'
import { makePgProductsRepo } from '@/main/factories/infra/repos/postgres'

export const makeLoadPurchaseInfo = (): LoadPurchaseInfo => {
  return setupLoadPurchaseInfo(makePgProductsRepo())
}
