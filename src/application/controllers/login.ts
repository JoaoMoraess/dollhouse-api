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
    if (userData !== null && userData !== undefined) return ok(userData)

    return unauthorized()
  }

  override buildValidators ({ email, password }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldValue: email, fieldName: 'email' })// TODO criar validador de email
        .required()
        .build(),
      ...ValidationBuilder.of({ fieldValue: password, fieldName: 'password' })
        .required()
        .build()
    ]
  }
}
