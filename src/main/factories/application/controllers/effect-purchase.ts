import { Controller, EffectPurchaseController } from '@/application/controllers'
import { makeEffectPurchase, makeCheckProductsIsValid } from '@/main/factories/domain/use-cases'
import { makeTransactionController } from '@/main/factories/application/decorators'

export const makeEffectPurchaseController = (): Controller => {
  const controller = new EffectPurchaseController(makeCheckProductsIsValid(), makeEffectPurchase())
  return makeTransactionController(controller)
}
