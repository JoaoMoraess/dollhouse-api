import { Controller, RegistrationController } from '@/application/controllers'
import { ok, unauthorized } from '@/application/helpers'
import { Email, RequiredString } from '@/application/validation'

type HttpRequest = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

describe('RegistrationController', () => {
  let sut: RegistrationController
  let registration: jest.Mock
  let httpRequest: HttpRequest

  beforeAll(() => {
    registration = jest.fn().mockResolvedValue({
      name: 'any_name',
      token: 'any_token'
    })
  })

  beforeEach(() => {
    httpRequest = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    sut = new RegistrationController(registration)
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validatos correctly on save', async () => {
    const validators = sut.buildValidators({ ...httpRequest })

    expect(validators).toEqual([
      new RequiredString(httpRequest.name, 'name'),
      new RequiredString(httpRequest.email, 'email'),
      new Email(httpRequest.email, 'email'),
      new RequiredString(httpRequest.password, 'password'),
      new RequiredString(httpRequest.passwordConfirmation, 'passwordConfirmation')
    ])
  })
  it('should call Registration with correct input', async () => {
    await sut.handle(httpRequest)

    expect(registration).toHaveBeenCalledWith({ name: httpRequest.name, email: httpRequest.email, password: httpRequest.password })
    expect(registration).toHaveBeenCalledTimes(1)
  })
  it('should return the correct data on success', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok({ name: 'any_name', token: 'any_token' }))
  })

  it('should return unauthorized if registration returns null', async () => {
    registration.mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorized())
  })
})
