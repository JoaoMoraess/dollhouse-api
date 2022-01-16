import { IBackup } from 'pg-mem'
import { makeFakeDb } from '../mocks/connection'
import { PgConnection } from '@/infra/repos/postgres/helpers/connection'
import { Repository } from '@/infra/repos/postgres/repository'
import { User } from '@/infra/repos/postgres/entities/User'
import { EntityRepository } from '@mikro-orm/core'
import { v4 } from 'uuid'
import { PgUserRepository } from '@/infra/repos/postgres'

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

  describe('loadByEmail()', () => {
    it('should return the correct user', async () => {
      await pgUserRepo.persistAndFlush(pgUserRepo.create({
        id: userId,
        email,
        name: 'any_name',
        password: 'any_password',
        role: 'customer'
      }))

      const user = await sut.loadByEmail({ email })

      expect(user).toEqual({
        id: userId,
        name: 'any_name',
        password: 'any_password',
        role: 'customer'
      })
    })
  })
  describe('saveUser()', () => {
    it('should save user correctly', async () => {
      const { id } = await sut.save({
        email: 'any_email@gmail.com',
        name: 'any_name',
        password: 'hashed_password'
      })

      const savedUser = await pgUserRepo.findOne({ email: 'any_email@gmail.com' })

      expect(savedUser).toBeTruthy()
      expect(savedUser?.id).toEqual(id)
      expect(savedUser?.name).toEqual('any_name')
      expect(savedUser?.role).toEqual('customer')
    })
  })
})
