class AuthenticationMiddleware {
  constructor (private readonly authorize: Authorize) {}

  async handle ({ token }: HttpRequest): Promise<void> {
    await this.authorize({ token })
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
})
