import { Router } from 'express'
import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeLoginController, makeSignUpController } from '@/main/factories/application/controllers'

export default (router: Router): void => {
  router.post('/login', adapt(makeLoginController()))
  router.post('/signup', adapt(makeSignUpController()))
}
