import { PgUserRepository } from '@/infra/repos/postgres'

export const makePgUserRepo = (): PgUserRepository => {
  return new PgUserRepository()
}
