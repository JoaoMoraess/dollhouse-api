import { Router } from 'express'
import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeLoadCartInfoController } from '@/main/factories/application/controllers'

export default (router: Router): void => {
  router.post('/cart/info', adapt(makeLoadCartInfoController()))
}
