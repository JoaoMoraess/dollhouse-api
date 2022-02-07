import { Router } from 'express'
import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeLoadProductsController, makeSaveProductController } from '@/main/factories/application/controllers'
import { adminAuth } from '@/main/middlewares'
import { adaptMulter as upload } from '@/application/middlewares'

export default (router: Router): void => {
  router.get('/products', adapt(makeLoadProductsController()))
  router.post('/products', adminAuth, upload, adapt(makeSaveProductController()))
}
