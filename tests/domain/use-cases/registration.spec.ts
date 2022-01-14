import { LoadUserByEmail } from '@/domain/contracts/repos'
import { AuthenticationModel } from '@/domain/entities'
import { mock, MockProxy } from 'jest-mock-extended'

export type Registration = (input: {name: string, email: string, password: string}) => Promise<AuthenticationModel | null>
type Setup = (userRepo: LoadUserByEmail) => Registration

const setRegistration: Setup = (userRepo) => async ({ email, name, password }) => {
  await userRepo.loadByEmail({ email })
  return null
}

describe('Registration', () => {
  let sut: Registration
  let userRepo: MockProxy<LoadUserByEmail>
  let name: string
  let email: string
  let password: string

  beforeAll(() => {
    userRepo = mock<LoadUserByEmail>()
    userRepo.loadByEmail.mockResolvedValue(null)
  })

  beforeEach(() => {
    name = 'any_name'
    email = 'any_email@gmail.com'
    password = 'any_password'
    sut = setRegistration(userRepo)
  })

  it('should call userRepo.loadByEmail with correct input', async () => {
    await sut({ email, name, password })

    expect(userRepo.loadByEmail).toHaveBeenCalledWith({ email })
    expect(userRepo.loadByEmail).toHaveBeenCalledTimes(1)
  })
})
