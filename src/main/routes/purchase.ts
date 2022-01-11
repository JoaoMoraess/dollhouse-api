import { Router } from 'express'
import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeEffectPurchaseController, makeLoadPurchaseInfoController } from '@/main/factories/application/controllers'

export default (router: Router): void => {
  router.post('/purchase/effect', adapt(makeEffectPurchaseController()))
  router.post('/purchase/info', adapt(makeLoadPurchaseInfoController()))
}
