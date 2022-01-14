import { SignUpController } from '@/application/controllers'
import { makeRegistration } from '@/main/factories/domain/use-cases'

export const makeSignUpController = (): SignUpController => {
  return new SignUpController(makeRegistration())
}
