import { setupEffectPurchase, EffectPurchase } from '@/domain/use-cases'
import { makePgOrderRepo } from '@/main/factories/infra/repos/postgres'
import { makeCorreiosApi, makePagSeguroApi } from '@/main/factories/infra/gateway'
import { makeLoadPurchaseInfo } from '.'

export const makeEffectPurchase = (): EffectPurchase => {
  return setupEffectPurchase(
    makeLoadPurchaseInfo(),
    makePgOrderRepo(),
    makeCorreiosApi(),
    makePagSeguroApi()
  )
}
