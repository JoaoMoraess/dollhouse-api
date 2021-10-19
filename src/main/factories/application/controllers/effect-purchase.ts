import { EffectPurchaseController } from '@/application/controllers'
import { makeEffectPurchase } from '@/main/factories/domain/use-cases'

export const makeEffectPurchaseController = (): EffectPurchaseController => {
  return new EffectPurchaseController(makeEffectPurchase())
}
