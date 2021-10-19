import { setupEffectPurchase, EffectPurchase } from '@/domain/use-cases'
import { makePgOrderRepo, makePgProductsRepo } from '@/main/factories/infra/repos/postgres'
import { makeCorreiosApi, makePagSeguroApi } from '@/main/factories/infra/gateway'

export const makeEffectPurchase = (): EffectPurchase => {
  return setupEffectPurchase(
    makePgProductsRepo(),
    makePgOrderRepo(),
    makeCorreiosApi(),
    makePagSeguroApi()
  )
}
