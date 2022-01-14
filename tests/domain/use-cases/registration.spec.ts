import { LoadUserByEmail } from '@/domain/contracts/repos'
import { AuthenticationModel } from '@/domain/entities'
import { mock, MockProxy } from 'jest-mock-extended'

export interface Hasher {
  hash: (input: { plainText: string }) => Promise<string>
}

export type Registration = (input: {name: string, email: string, password: string}) => Promise<AuthenticationModel | null>
type Setup = (usersRepo: LoadUserByEmail, hasher: Hasher) => Registration

const setRegistration: Setup = (usersRepo, hasher) => async ({ email, name, password }) => {
  const registredUser = await usersRepo.loadByEmail({ email })
  if (registredUser !== null && registredUser !== undefined) return null

  await hasher.hash({ plainText: password })

  return null
}

describe('Registration', () => {
  let sut: Registration
  let usersRepo: MockProxy<LoadUserByEmail>
  let hasher: MockProxy<Hasher>
  let name: string
  let email: string
  let password: string

  beforeAll(() => {
    usersRepo = mock<LoadUserByEmail>()
    usersRepo.loadByEmail.mockResolvedValue(null)
    hasher = mock<Hasher>()
    hasher.hash.mockResolvedValue('hashed_string')
  })

  beforeEach(() => {
    name = 'any_name'
    email = 'any_email@gmail.com'
    password = 'any_password'
    sut = setRegistration(usersRepo, hasher)
  })

  it('should call usersRepo.loadByEmail with correct input', async () => {
    await sut({ email, name, password })

    expect(usersRepo.loadByEmail).toHaveBeenCalledWith({ email })
    expect(usersRepo.loadByEmail).toHaveBeenCalledTimes(1)
  })

  it('should return null if usersRepo.loadByEmail returns null', async () => {
    usersRepo.loadByEmail.mockResolvedValueOnce(null)
    const authenticationModel = await sut({ email, name, password })

    expect(authenticationModel).toEqual(null)
  })
  it('should call hasher with correct input', async () => {
    await sut({ email, name, password })

    expect(hasher.hash).toHaveBeenCalledWith({ plainText: password })
    expect(hasher.hash).toBeCalledTimes(1)
  })
})
