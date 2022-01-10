import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { Validator, ValidationBuilder, RequiredString } from '@/application/validation'

type HttpRequest = {email: string, password: string}

type Authentication = (input: { email: string, password: string }) => Promise<{token: string, name: string}>

class LoginController extends Controller {
  constructor (private readonly authentication: Authentication) {
    super()
  }

  override async perform ({ email, password }: HttpRequest): Promise<HttpResponse<any>> {
    void this.authentication({ email, password })

    return {
      data: {},
      statusCode: 200
    }
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

describe('LoginController', () => {
  let sut: LoginController
  let authentication: jest.Mock
  let email: string
  let password: string

  beforeAll(() => {
    authentication = jest.fn().mockResolvedValue({ token: 'any_token', name: 'any_name' })
    email = 'any_email@gmail.com'
    password = 'any_password123'
  })
  beforeEach(() => {
    sut = new LoginController(authentication)
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validatos correctly on save', async () => {
    const validators = sut.buildValidators({ email, password })

    expect(validators).toEqual([
      new RequiredString(email, 'email'),
      new RequiredString(password, 'password')
    ])
  })
  it('should call authentication with correct input', async () => {
    await sut.handle({ email, password })

    expect(authentication).toHaveBeenCalledWith({ email, password })
    expect(authentication).toHaveBeenCalledTimes(1)
  })
})
