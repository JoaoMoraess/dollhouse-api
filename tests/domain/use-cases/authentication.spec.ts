import { mock, MockProxy } from 'jest-mock-extended'

interface LoadUserByEmail {
  loadByEmail: (input: {email: string}) => Promise<{id: string, name: string, password: string} | null>
}

interface UpdateUserToken {
  updateToken: (input: {id: string, token: string}) => Promise<void>
}

interface HashComparer {
  compare: (input: {plainText: string, digest: string}) => Promise<boolean>
}

interface Encrypter {
  encrypt: (input: {plainText: string}) => Promise<string>
}

type Setup = (usersRepo: LoadUserByEmail & UpdateUserToken, hashComparer: HashComparer, encrypter: Encrypter) => Authentication
export type Authentication = (input: { email: string, password: string }) => Promise<{name: string, token: string} | null>

export const setAuthentication: Setup = (usersRepo, hashComparer, encrypter) => async ({ email, password }) => {
  const user = await usersRepo.loadByEmail({ email })
  if (user !== undefined && user !== null) {
    const isValidUser = await hashComparer.compare({ plainText: password, digest: user.password })
    if (isValidUser) {
      const token = await encrypter.encrypt({ plainText: user.id })
      await usersRepo.updateToken({ id: user.id, token })
      return { name: user.name, token }
    }
  }

  return null
}

describe('Authentication', () => {
  let usersRepo: MockProxy<LoadUserByEmail & UpdateUserToken>
  let hashComparer: MockProxy<HashComparer>
  let encrypter: MockProxy<Encrypter>
  let sut: Authentication
  let email: string
  let password: string

  beforeAll(() => {
    usersRepo = mock()
    usersRepo.loadByEmail.mockResolvedValue({
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
    sut = setAuthentication(usersRepo, hashComparer, encrypter)
  })

  it('should call usersRepo.loadByEmail with correct input', async () => {
    await sut({ email, password })

    expect(usersRepo.loadByEmail).toHaveBeenCalledWith({ email })
    expect(usersRepo.loadByEmail).toHaveBeenCalledTimes(1)
  })
  it('should return null if usersRepo.loadByEmail returns null', async () => {
    usersRepo.loadByEmail.mockResolvedValueOnce(null)
    const userData = await sut({ email, password })

    expect(userData).toEqual(null)
  })
  it('should return null if hashComparer.compare returns false', async () => {
    hashComparer.compare.mockResolvedValueOnce(false)
    const userData = await sut({ email, password })

    expect(userData).toEqual(null)
  })
  it('should call hashComparer.compare with correct input', async () => {
    await sut({ email, password })

    expect(hashComparer.compare).toHaveBeenCalledWith({ plainText: password, digest: 'any_hasshed_password' })
    expect(hashComparer.compare).toHaveBeenCalledTimes(1)
  })
  it('should call encrypter.encrypt with correct input', async () => {
    await sut({ email, password })

    expect(encrypter.encrypt).toHaveBeenCalledWith({ plainText: 'any_id' })
    expect(encrypter.encrypt).toHaveBeenCalledTimes(1)
  })
  it('should call usersRepo.updateToken with correct input', async () => {
    await sut({ email, password })

    expect(usersRepo.updateToken).toHaveBeenCalledWith({ id: 'any_id', token: 'encrypted_string' })
    expect(usersRepo.updateToken).toHaveBeenCalledTimes(1)
  })
  it('should return the correct data on success', async () => {
    const userData = await sut({ email, password })

    expect(userData).toEqual({ name: 'any_name', token: 'encrypted_string' })
  })
})
