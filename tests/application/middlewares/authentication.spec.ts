import { forbidden, ok } from '@/application/helpers'
import { AuthenticationMiddleware } from '@/application/middlewares'

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let authorize: jest.Mock

  beforeAll(() => {
    authorize = jest.fn()
    authorize.mockResolvedValue({ key: 'any_user_id', userRole: 'customer' })
  })

  beforeEach(() => {
    sut = new AuthenticationMiddleware(authorize, 'customer')
  })

  it('should call authorize with correct input', async () => {
    await sut.handle({ authorization: 'any_token' })

    expect(authorize).toHaveBeenCalledWith({ token: 'any_token' })
  })

  it('should validate httpRequest correctly', async () => {
    const httpResonse = await sut.handle({ authorization: null as any })

    expect(authorize).not.toHaveBeenCalled()
    expect(httpResonse).toEqual(forbidden())
  })

  it('should return the correct value on success', async () => {
    const httpResonse = await sut.handle({ authorization: 'any_token' })

    expect(httpResonse).toEqual(ok({ userId: 'any_user_id' }))
  })

  it('should return forbiden if authorization throws', async () => {
    authorize.mockRejectedValueOnce(new Error('any_error'))
    const httpResonse = await sut.handle({ authorization: 'any_authorization' })

    expect(httpResonse).toEqual(forbidden())
  })

  it('should return forbiden authorize return invalid role', async () => {
    authorize.mockResolvedValueOnce({ key: 'any_user_id', userRole: 'invalid_role' })
    const httpResonse = await sut.handle({ authorization: 'any_authorization' })

    expect(httpResonse).toEqual(forbidden())
  })
  it('should not return forbiden if authorize return admin role', async () => {
    authorize.mockResolvedValueOnce({ key: 'any_user_id', userRole: 'admin' })
    const httpResonse = await sut.handle({ authorization: 'any_authorization' })

    expect(httpResonse).toEqual(ok({ userId: 'any_user_id' }))
  })
})
