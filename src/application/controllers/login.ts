import { Controller } from '.'
import { unauthorized, HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = {email: string, password: string}

type Authentication = (input: { email: string, password: string }) => Promise<{token: string, name: string} | null>

export class LoginController extends Controller {
  constructor (
    private readonly authentication: Authentication
  ) { super() }

  override async perform ({ email, password }: HttpRequest): Promise<HttpResponse<any>> {
    const userData = await this.authentication({ email, password })
    if (userData === null || userData === undefined) return unauthorized()

    return ok(userData)
  }

  override buildValidators ({ email, password }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldValue: email, fieldName: 'email' })
        .required()
        .email()
        .build(),
      ...ValidationBuilder.of({ fieldValue: password, fieldName: 'password' })
        .required()
        .build()
    ]
  }
}
