import { LoadUserByEmail, SaveUser } from '@/domain/contracts/repos'
import { AuthenticationModel, AccessToken, UserRole } from '@/domain/entities'
import { TokenGenerator, Hasher } from '@/domain/contracts/gateways'

export type Registration = (input: {name: string, email: string, password: string}) => Promise<AuthenticationModel | null>
type Setup = (usersRepo: LoadUserByEmail & SaveUser, hasher: Hasher, tokenHandler: TokenGenerator) => Registration

export const setupRegistration: Setup = (usersRepo, hasher, tokenHandler) => async ({ email, name, password }) => {
  const registredUser = await usersRepo.loadByEmail({ email })
  if (registredUser !== null && registredUser !== undefined) return null
  const defaultRole: UserRole = 'customer'
  const hashedPassword = await hasher.hash({ plainText: password })
  const { id } = await usersRepo.save({
    email,
    name,
    password: hashedPassword
  })
  const token = await tokenHandler.generate({ key: id, userRole: defaultRole, expirationInMs: AccessToken.expirationInMs })
  return { name, token }
}
