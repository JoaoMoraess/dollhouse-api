import { LoadPurchaseInfoController } from '@/application/controllers'
import { makeLoadPurchaseInfo, makeCheckProductsIsValid } from '@/main/factories/domain/use-cases'

export const makeLoadPurchaseInfoController = (): LoadPurchaseInfoController => {
  return new LoadPurchaseInfoController(makeCheckProductsIsValid(), makeLoadPurchaseInfo())
}
