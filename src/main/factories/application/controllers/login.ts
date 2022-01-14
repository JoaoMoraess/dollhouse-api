import { LoginController } from '@/application/controllers'
import { makeAuthentication } from '@/main/factories/domain/use-cases'

export const makeLoginController = (): LoginController => {
  return new LoginController(makeAuthentication())
}
