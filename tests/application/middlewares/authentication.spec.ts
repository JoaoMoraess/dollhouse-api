import { RequiredString } from '@/application/validation'
import { forbidden, HttpResponse, ok } from '@/application/helpers'
import { Middleware } from '@/application/contracts'

class AuthenticationMiddleware implements Middleware {
  constructor (private readonly authorize: Authorize) {}

  async handle ({ token }: HttpRequest): Promise<HttpResponse> {
    if (!this.validate({ token })) return forbidden()
    try {
      const userId = await this.authorize({ token })

      return ok({ userId })
    } catch {
      return forbidden()
    }
  }

  private validate ({ token }: {token: string}): boolean {
    const error = new RequiredString(token).validate()
    return error === undefined
  }
}

type HttpRequest = {token: string}
type Authorize = (input: {token: string}) => Promise<string>

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let authorize: jest.Mock

  beforeAll(() => {
    authorize = jest.fn()
    authorize.mockResolvedValue('any_user_id')
  })

  beforeEach(() => {
    sut = new AuthenticationMiddleware(authorize)
  })

  it('should call authorize with correct input', async () => {
    await sut.handle({ token: 'any_token' })

    expect(authorize).toHaveBeenCalledWith({ token: 'any_token' })
  })

  it('should validate httpRequest correctly', async () => {
    const httpResonse = await sut.handle({ token: null as any })

    expect(authorize).not.toHaveBeenCalled()
    expect(httpResonse).toEqual(forbidden())
  })

  it('should return the correct value on success', async () => {
    const httpResonse = await sut.handle({ token: 'any_token' })

    expect(httpResonse).toEqual(ok({ userId: 'any_user_id' }))
  })

  it('should return forbiden if authorization throws', async () => {
    authorize.mockRejectedValueOnce(new Error('any_error'))
    const httpResonse = await sut.handle({ token: 'any_token' })

    expect(httpResonse).toEqual(forbidden())
  })
})
