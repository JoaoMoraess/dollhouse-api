import { Controller } from '.'
import { UserNotExistsError } from '@/application/errors'
import { badRequest, HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = {email: string, password: string}

type Authentication = (input: { email: string, password: string }) => Promise<{token: string, name: string}>
type CheckUserExists = (input: { email: string }) => Promise<boolean>

export class LoginController extends Controller {
  constructor (
    private readonly checkUserExists: CheckUserExists,
    private readonly authentication: Authentication
  ) { super() }

  override async perform ({ email, password }: HttpRequest): Promise<HttpResponse<any>> {
    const userExists = await this.checkUserExists({ email })
    if (userExists) {
      const { name, token } = await this.authentication({ email, password })
      return ok({ name, token })
    }
    return badRequest(new UserNotExistsError())
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
