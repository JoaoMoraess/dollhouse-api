import { LoadPurchaseInfoController } from '@/application/controllers'
import { makeLoadPurchaseInfo, makeValidateProducts } from '@/main/factories/domain/use-cases'

export const makeLoadPurchaseInfoController = (): LoadPurchaseInfoController => {
  return new LoadPurchaseInfoController(makeValidateProducts(), makeLoadPurchaseInfo())
}
