import { RequiredString } from '@/application/validation'
import { forbidden, HttpResponse, ok } from '@/application/helpers'

class AuthenticationMiddleware {
  constructor (private readonly authorize: Authorize) {}

  async handle ({ token }: HttpRequest): Promise<HttpResponse> {
    if (!this.validate({ token })) return forbidden()
    const userId = await this.authorize({ token })

    return ok({ userId })
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
  let authorize: Authorize

  beforeAll(() => {
    authorize = jest.fn().mockResolvedValue('any_user_id')
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
})
