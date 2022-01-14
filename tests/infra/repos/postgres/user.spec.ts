import { IBackup } from 'pg-mem'
import { makeFakeDb } from '../mocks/connection'
import { PgConnection } from '@/infra/repos/postgres/helpers/connection'
import { Repository } from '@/infra/repos/postgres/repository'
import { LoadUserByEmail } from '@/domain/contracts/repos'
import { User } from '@/infra/repos/postgres/entities/User'
import { EntityRepository } from '@mikro-orm/core'
import { v4 } from 'uuid'

export class PgUserRepository extends Repository implements LoadUserByEmail {
  private readonly userRepository = this.getRepository<User>('User')

  async loadByEmail ({ email }: { email: string }): Promise<{ id: string, name: string, password: string } | null> {
    const [{ id, name, password }] = await this.userRepository.find({ email }, { fields: ['id', 'name', 'password'] })
    return { id, name, password }
  }
}

describe('PgUserRepository', () => {
  let sut: PgUserRepository
  let connection: PgConnection
  let pgUserRepo: EntityRepository<User>
  let backup: IBackup
  let userId: string
  let email: string

  beforeAll(async () => {
    const { db, orm } = await makeFakeDb([User])
    connection = PgConnection.getInstance(orm)
    await connection.connect()
    backup = db.backup()
    pgUserRepo = connection.getRepository<User>('User')
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  beforeEach(() => {
    email = 'any_email@mail.com'
    userId = v4()
    backup.restore()
    sut = new PgUserRepository()
  })

  it('should extend PgRepository', async () => {
    expect(sut).toBeInstanceOf(Repository)
  })

  describe('LoaduserByEmail', () => {
    it('should return the correct user', async () => {
      await pgUserRepo.persistAndFlush(pgUserRepo.create({
        id: userId,
        email,
        name: 'any_name',
        password: 'any_password',
        role: null
      }))

      const user = await sut.loadByEmail({ email })

      expect(user).toEqual({
        id: userId,
        name: 'any_name',
        password: 'any_password'
      })
    })
  })
})
