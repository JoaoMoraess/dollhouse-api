import { Controller, LoginController } from '@/application/controllers'
import { ok, unauthorized } from '@/application/helpers'
import { RequiredString } from '@/application/validation'

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

  it('should return 200 and correct data on success', async () => {
    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual(ok({ token: 'any_token', name: 'any_name' }))
  })
  it('should return unauthorized if authentication returns null', async () => {
    authentication.mockResolvedValueOnce(null)
    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual(unauthorized())
  })
})
