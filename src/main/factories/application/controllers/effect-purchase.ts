import { Controller, EffectPurchaseController } from '@/application/controllers'
import { makeEffectPurchase, makeValidateProducts } from '@/main/factories/domain/use-cases'
import { makeTransactionController } from '@/main/factories/application/decorators'

export const makeEffectPurchaseController = (): Controller => {
  const controller = new EffectPurchaseController(makeValidateProducts(), makeEffectPurchase())
  return makeTransactionController(controller)
}
