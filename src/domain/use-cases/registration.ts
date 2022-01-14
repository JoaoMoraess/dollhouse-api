import { LoadUserByEmail, SaveUser } from '@/domain/contracts/repos'
import { AuthenticationModel, AccessToken } from '@/domain/entities'
import { TokenGenerator, Hasher } from '@/domain/contracts/gateways'

export type Registration = (input: {name: string, email: string, password: string}) => Promise<AuthenticationModel | null>
type Setup = (usersRepo: LoadUserByEmail & SaveUser, hasher: Hasher, tokenHandler: TokenGenerator) => Registration

export const setRegistration: Setup = (usersRepo, hasher, tokenHandler) => async ({ email, name, password }) => {
  const registredUser = await usersRepo.loadByEmail({ email })
  if (registredUser !== null && registredUser !== undefined) return null
  const hashedPassword = await hasher.hash({ plainText: password })
  const { id } = await usersRepo.save({
    email,
    name,
    password: hashedPassword
  })
  const token = tokenHandler.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
  return { name, token }
}
