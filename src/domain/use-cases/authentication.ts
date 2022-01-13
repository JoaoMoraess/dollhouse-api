import { Encrypter, HashComparer } from '@/domain/contracts/cryptography'
import { LoadUserByEmail, UpdateUserToken } from '@/domain/contracts/repos'

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
