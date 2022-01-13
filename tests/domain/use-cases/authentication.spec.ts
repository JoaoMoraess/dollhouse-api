import { mock, MockProxy } from 'jest-mock-extended'

interface LoadUserByEmail {
  loadByEmail: (field: string) => Promise<{id: string, name: string, password: string}>
}

type Setup = (userRepo: LoadUserByEmail) => Authentication
export type Authentication = (input: { email: string, password: string }) => Promise<{name: string, token: string}>

export const setAuthentication: Setup = (userRepo) => async ({ email, password }) => {
  await userRepo.loadByEmail(email)

  return {
    name: 'any_name',
    token: 'any_token'
  }
}

describe('Authentication', () => {
  let userRepo: MockProxy<LoadUserByEmail>
  let sut: Authentication
  let email: string
  let password: string

  beforeAll(() => {
    userRepo = mock()
    userRepo.loadByEmail.mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      password: 'any_password'
    })
  })
  beforeEach(() => {
    email = 'any_email@gmail.com'
    password = 'any_password_123'
    sut = setAuthentication(userRepo)
  })

  it('should call userRepo.loadByEmail with correct input', async () => {
    await sut({ email, password })

    expect(userRepo.loadByEmail).toHaveBeenCalledWith(email)
    expect(userRepo.loadByEmail).toHaveBeenCalledTimes(1)
  })
})
