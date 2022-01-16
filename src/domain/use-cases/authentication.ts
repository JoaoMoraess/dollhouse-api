import { LoadUserByEmail } from '@/domain/contracts/repos'
import { TokenGenerator, HashComparer } from '@/domain/contracts/gateways'
import { AccessToken } from '@/domain/entities'

type Setup = (usersRepo: LoadUserByEmail, hashComparer: HashComparer, tokenHandler: TokenGenerator) => Authentication
export type Authentication = (input: { email: string, password: string }) => Promise<{name: string, token: string} | null>

export const setAuthentication: Setup = (
  usersRepo,
  hashComparer,
  tokenHandler
) => async ({ email, password }) => {
  const user = await usersRepo.loadByEmail({ email })
  if (user !== undefined && user !== null) {
    const isValidUser = await hashComparer.compare({ plainText: password, digest: user.password })
    if (isValidUser) {
      const token = await tokenHandler.generate({ key: user.id, userRole: user.role, expirationInMs: AccessToken.expirationInMs })
      return { name: user.name, token }
    }
  }
  return null
}
