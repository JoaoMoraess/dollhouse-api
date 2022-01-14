import { AuthenticationModel } from '@/domain/entities'
import { Controller } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'

type HttpRequest = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

type Registration = (input: { name: string, email: string, password: string }) => Promise<AuthenticationModel>

class RegistrationController extends Controller {
  constructor (private readonly registration: Registration) { super() }

  override async perform (httpRequest: HttpRequest): Promise<HttpResponse<AuthenticationModel>> {
    return ok({
      name: 'any_name',
      token: 'any_token'
    })
  }
}

describe('RegistrationController', () => {
  let sut: RegistrationController
  let registration: jest.Mock

  beforeAll(() => {
    registration = jest.fn().mockResolvedValue({
      name: 'any_name',
      token: 'any_token'
    })
  })

  beforeEach(() => {
    sut = new RegistrationController(registration)
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should ', async () => {

  })
})
