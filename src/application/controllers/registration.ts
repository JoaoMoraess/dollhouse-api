import { AuthenticationModel } from '@/domain/entities'
import { Controller } from '@/application/controllers'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { Validator, ValidationBuilder } from '@/application/validation'

type HttpRequest = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

type Registration = (input: { name: string, email: string, password: string }) => Promise<AuthenticationModel | null>

export class RegistrationController extends Controller {
  constructor (private readonly registration: Registration) { super() }

  override async perform (httpRequest: HttpRequest): Promise<HttpResponse<any>> {
    const { email, name, password } = httpRequest
    const authenticationModel = await this.registration({ email, name, password })

    if (authenticationModel !== null && authenticationModel !== undefined) {
      return ok(authenticationModel)
    }
    return unauthorized()
  }

  override buildValidators ({ name, email, password, passwordConfirmation }: HttpRequest): Validator[] {
    // TODO fazer o compareFieldsValidator
    return [
      ...ValidationBuilder.of({ fieldValue: name, fieldName: 'name' }).required().build(),
      ...ValidationBuilder.of({ fieldValue: email, fieldName: 'email' }).required().email().build(),
      ...ValidationBuilder.of({ fieldValue: password, fieldName: 'password' }).required().build(),
      ...ValidationBuilder.of({ fieldValue: passwordConfirmation, fieldName: 'passwordConfirmation' }).required().build()
    ]
  }
}
