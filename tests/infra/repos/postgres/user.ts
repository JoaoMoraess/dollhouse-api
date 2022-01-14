import { IBackup } from 'pg-mem'
import { PgProductRepository } from '@/infra/repos/postgres'
import { makeFakeDb } from '../mocks/connection'
import { Product } from '@/infra/repos/postgres/entities/Product'
import { PgConnection } from '@/infra/repos/postgres/helpers/connection'
import { Repository } from '@/infra/repos/postgres/repository'
import { LoadUserByEmail } from '@/domain/contracts/repos'

export class PgUserRepository extends Repository implements LoadUserByEmail {
  // private readonly orderRepository = this.getRepository<User>('User')

  async loadByEmail (input: { email: string }): Promise<{ id: string, name: string, password: string } | null> {
    return null
  }
}

describe('PgProductRepository', () => {
  let sut: PgProductRepository
  let connection: PgConnection
  // let pgUserRepo: EntityRepository<User>
  let backup: IBackup
  // let userId: string

  beforeAll(async () => {
    const { db, orm } = await makeFakeDb([Product])
    connection = PgConnection.getInstance(orm)
    await connection.connect()
    backup = db.backup()
    // pgUserRepo = connection.getRepository<User>('User')
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  beforeEach(() => {
    // userId = v4()
    backup.restore()
    sut = new PgProductRepository()
  })

  it('should extend PgRepository', async () => {
    expect(sut).toBeInstanceOf(Repository)
  })

  describe('LoaduserByEmail', () => {
    // pgUserRepo.create({
    //   id: userId,
    //   accessToken: null,
    //   email: 'any_email@mail.com',
    //   name: 'any_name',
    //   password: 'any_password',
    //   role: null
    // })
  })
})
