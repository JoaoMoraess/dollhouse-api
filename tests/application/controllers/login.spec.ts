import { Controller } from '@/application/controllers'
import { HttpResponse, ok, badRequest } from '@/application/helpers'
import { Validator, ValidationBuilder, RequiredString } from '@/application/validation'
import { UserNotExistsError } from '@/application/errors'

type HttpRequest = {email: string, password: string}

type Authentication = (input: { email: string, password: string }) => Promise<{token: string, name: string}>
type CheckUserExists = (input: { email: string }) => Promise<boolean>

class LoginController extends Controller {
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

describe('LoginController', () => {
  let sut: LoginController
  let authentication: jest.Mock
  let checkUserExists: jest.Mock
  let email: string
  let password: string

  beforeAll(() => {
    checkUserExists = jest.fn().mockResolvedValue(true)
    authentication = jest.fn().mockResolvedValue({ token: 'any_token', name: 'any_name' })
    email = 'any_email@gmail.com'
    password = 'any_password123'
  })
  beforeEach(() => {
    sut = new LoginController(checkUserExists, authentication)
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

  it('should call checkUserExists with correct input', async () => {
    await sut.handle({ email, password })

    expect(checkUserExists).toHaveBeenCalledWith({ email })
    expect(checkUserExists).toHaveBeenCalledTimes(1)
  })

  it('should not cal authentication if checkUserExists returns false', async () => {
    checkUserExists.mockResolvedValueOnce(false)
    await sut.handle({ email, password })

    expect(authentication).not.toHaveBeenCalled()
    expect(authentication).toHaveBeenCalledTimes(0)
  })

  it('should call authentication with correct input', async () => {
    await sut.handle({ email, password })

    expect(authentication).toHaveBeenCalledWith({ email, password })
    expect(authentication).toHaveBeenCalledTimes(1)
  })

  it('should return 200 and correct data on success', async () => {
    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual(ok({ token: 'any_token', name: 'any_name' }))
  })
  it('should return 401 and UserNotExitsError if checkUserExists return false', async () => {
    checkUserExists.mockResolvedValueOnce(false)
    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual(badRequest(new UserNotExistsError()))
  })
})
