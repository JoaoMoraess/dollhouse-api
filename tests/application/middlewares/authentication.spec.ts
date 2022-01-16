import { RequiredString } from '@/application/validation'
import { forbidden, HttpResponse, ok } from '@/application/helpers'
import { Middleware } from '@/application/contracts'

class AuthenticationMiddleware implements Middleware {
  constructor (private readonly authorize: Authorize) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse> {
    if (!this.validate({ authorization })) return forbidden()
    try {
      const userId = await this.authorize({ authorization })

      return ok({ userId })
    } catch {
      return forbidden()
    }
  }

  private validate ({ authorization }: {authorization: string}): boolean {
    const error = new RequiredString(authorization).validate()
    return error === undefined
  }
}

type HttpRequest = {authorization: string}
type Authorize = (input: {authorization: string}) => Promise<string>

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
    await sut.handle({ authorization: 'any_authorization' })

    expect(authorize).toHaveBeenCalledWith({ authorization: 'any_authorization' })
  })

  it('should validate httpRequest correctly', async () => {
    const httpResonse = await sut.handle({ authorization: null as any })

    expect(authorize).not.toHaveBeenCalled()
    expect(httpResonse).toEqual(forbidden())
  })

  it('should return the correct value on success', async () => {
    const httpResonse = await sut.handle({ authorization: 'any_authorization' })

    expect(httpResonse).toEqual(ok({ userId: 'any_user_id' }))
  })

  it('should return forbiden if authorization throws', async () => {
    authorize.mockRejectedValueOnce(new Error('any_error'))
    const httpResonse = await sut.handle({ authorization: 'any_authorization' })

    expect(httpResonse).toEqual(forbidden())
  })
})
