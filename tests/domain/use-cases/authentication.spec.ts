import { mock, MockProxy } from 'jest-mock-extended'

interface LoadUserByEmail {
  loadByEmail: (input: {email: string}) => Promise<{id: string, name: string, password: string} | null>
}
interface HashComparer {
  compare: (input: {plainText: string, digest: string}) => Promise<boolean>
}
interface Encrypter {
  encrypt: (input: {plainText: string}) => Promise<string>
}

type Setup = (userRepo: LoadUserByEmail, hashComparer: HashComparer, encrypter: Encrypter) => Authentication
export type Authentication = (input: { email: string, password: string }) => Promise<{name: string, token: string} | null>

export const setAuthentication: Setup = (userRepo, hashComparer, encrypter) => async ({ email, password }) => {
  const user = await userRepo.loadByEmail({ email })

  if (user !== undefined && user !== null) {
    const isValidUser = await hashComparer.compare({ plainText: password, digest: user.password })
    if (isValidUser) {
      await encrypter.encrypt({ plainText: user.id })
    }
  }

  return null
}

describe('Authentication', () => {
  let userRepo: MockProxy<LoadUserByEmail>
  let hashComparer: MockProxy<HashComparer>
  let encrypter: MockProxy<Encrypter>
  let sut: Authentication
  let email: string
  let password: string

  beforeAll(() => {
    userRepo = mock()
    userRepo.loadByEmail.mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      password: 'any_hasshed_password'
    })
    hashComparer = mock()
    hashComparer.compare.mockResolvedValue(true)
    encrypter = mock()
    encrypter.encrypt.mockResolvedValue('encrypted_string')
  })
  beforeEach(() => {
    email = 'any_email@gmail.com'
    password = 'any_password'
    sut = setAuthentication(userRepo, hashComparer, encrypter)
  })

  it('should call userRepo.loadByEmail with correct input', async () => {
    await sut({ email, password })

    expect(userRepo.loadByEmail).toHaveBeenCalledWith({ email })
    expect(userRepo.loadByEmail).toHaveBeenCalledTimes(1)
  })
  it('should return null if userRepo.loadByEmail returns undefined', async () => {
    userRepo.loadByEmail.mockResolvedValueOnce(null)
    const userData = await sut({ email, password })

    expect(userData).toEqual(null)
  })
  it('should call hashComparer with correct input', async () => {
    await sut({ email, password })

    expect(hashComparer.compare).toHaveBeenCalledWith({ plainText: password, digest: 'any_hasshed_password' })
    expect(hashComparer.compare).toHaveBeenCalledTimes(1)
  })
  it('should call encrypter with correct input', async () => {
    await sut({ email, password })

    expect(encrypter.encrypt).toHaveBeenCalledWith({ plainText: 'any_id' })
    expect(encrypter.encrypt).toHaveBeenCalledTimes(1)
  })
})
