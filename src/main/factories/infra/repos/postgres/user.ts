import { PgUserRepository } from '@/infra/repos/postgres'
import { makeUUIdHandler } from '@/main/factories/infra/gateway'

export const makePgUserRepo = (): PgUserRepository => {
  return new PgUserRepository(makeUUIdHandler())
}
