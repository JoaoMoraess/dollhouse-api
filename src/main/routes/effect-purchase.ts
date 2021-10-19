import { Router } from 'express'
import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeEffectPurchaseController } from '@/main/factories/application/controllers'

export default (router: Router): void => {
  router.post('/effect-purchase', adapt(makeEffectPurchaseController()))
}
