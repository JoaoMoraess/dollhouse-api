import { LoadUserByEmail } from '@/domain/contracts/repos'
import { AuthenticationModel, AccessToken } from '@/domain/entities'
import { TokenGenerator } from '@/domain/contracts/gateways'
import { mock, MockProxy } from 'jest-mock-extended'

export interface SaveUser {
  save: (input: {name: string, email: string, password: string}) => Promise<{id: string}>
}
export interface Hasher {
  hash: (input: { plainText: string }) => Promise<string>
}

export type Registration = (input: {name: string, email: string, password: string}) => Promise<AuthenticationModel | null>
type Setup = (usersRepo: LoadUserByEmail & SaveUser, hasher: Hasher, tokenHandler: TokenGenerator) => Registration

const setRegistration: Setup = (usersRepo, hasher, tokenHandler) => async ({ email, name, password }) => {
  const registredUser = await usersRepo.loadByEmail({ email })
  if (registredUser !== null && registredUser !== undefined) return null
  const hashedPassword = await hasher.hash({ plainText: password })
  const { id } = await usersRepo.save({
    email,
    name,
    password: hashedPassword
  })
  tokenHandler.generate({ key: id, expirationInMs: AccessToken.expirationInMs })

  return null
}

describe('Registration', () => {
  let sut: Registration
  let usersRepo: MockProxy<LoadUserByEmail & SaveUser>
  let hasher: MockProxy<Hasher>
  let tokenHandler: MockProxy<TokenGenerator>
  let name: string
  let email: string
  let password: string

  beforeAll(() => {
    usersRepo = mock<LoadUserByEmail & SaveUser>()
    usersRepo.loadByEmail.mockResolvedValue(null)
    usersRepo.save.mockResolvedValue({ id: 'any_id' })
    hasher = mock<Hasher>()
    hasher.hash.mockResolvedValue('hashed_string')
    tokenHandler = mock<TokenGenerator>()
    tokenHandler.generate.mockReturnValue('any_token')
  })

  beforeEach(() => {
    name = 'any_name'
    email = 'any_email@gmail.com'
    password = 'any_password'
    sut = setRegistration(usersRepo, hasher, tokenHandler)
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
  it('should call hasher.hash with correct input', async () => {
    await sut({ email, name, password })

    expect(hasher.hash).toHaveBeenCalledWith({ plainText: password })
    expect(hasher.hash).toBeCalledTimes(1)
  })
  it('should call usersRepo.save with correct input', async () => {
    await sut({ email, name, password })

    expect(usersRepo.save).toHaveBeenCalledWith({ email, name, password: 'hashed_string' })
    expect(usersRepo.save).toBeCalledTimes(1)
  })
  it('should call tokenHandler.generate with correct input', async () => {
    await sut({ email, name, password })

    expect(tokenHandler.generate).toHaveBeenCalledWith({ key: 'any_id', expirationInMs: AccessToken.expirationInMs })
    expect(tokenHandler.generate).toBeCalledTimes(1)
  })
})
