import { PgConnection } from '@/infra/repos/postgres/helpers/connection'

export const makePgConnection = (): PgConnection => {
  return PgConnection.getInstance()
}
