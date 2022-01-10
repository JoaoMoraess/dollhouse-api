import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { Validator, ValidationBuilder, RequiredString } from '@/application/validation'

class LoginController extends Controller {
  override async perform (httpRequest: any): Promise<HttpResponse<any>> {
    return {
      data: {},
      statusCode: 200
    }
  }

  override buildValidators ({ email, password }: {email: string, password: string}): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldValue: email, fieldName: 'email' })
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
  let email: string
  let password: string

  beforeEach(() => {
    sut = new LoginController()
  })
  beforeAll(() => {
    email = 'any_email@gmail.com'
    password = 'any_password123'
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
})
