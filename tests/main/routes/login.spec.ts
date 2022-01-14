import { PgConnection } from '@/infra/repos/postgres/helpers/connection'
import { EntityRepository, Connection, EntityManager, IDatabaseDriver, MikroORM } from '@mikro-orm/core'
import { IBackup } from 'pg-mem'
import { makeFakeDb } from '@/tests/infra/repos/mocks/connection'
import request from 'supertest'
import { configApp } from '@/main/config/app'
import { AsyncLocalStorage } from 'async_hooks'
import { User } from '@/infra/repos/postgres/entities/User'
import { v4 } from 'uuid'
import bcrypt from 'bcrypt'
import { Product } from '@/infra/repos/postgres/entities/Product'
import { Order } from '@/infra/repos/postgres/entities/Order'
import { OrderProduct } from '@/infra/repos/postgres/entities/OrderProduct'

describe('Product routes', () => {
  const storage = new AsyncLocalStorage<EntityManager>()
  let ormStub: MikroORM<IDatabaseDriver<Connection>>

  let connection: PgConnection
  let pgUserRepo: EntityRepository<User>
  let backup: IBackup

  beforeAll(async () => {
    const { db, orm } = await makeFakeDb([User, Product, Order, OrderProduct])
    connection = PgConnection.getInstance(orm)
    await connection.connect()
    backup = db.backup()
    pgUserRepo = connection.getRepository<User>('User') as any
    ormStub = orm
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  beforeEach(() => {
    backup.restore()
  })

  describe('POST /login', () => {
    it('should return the correct data on success', async () => {
      const password = await bcrypt.hash('any_password', 12)
      const fakeUser = pgUserRepo.create({
        id: v4(),
        email: 'any_email@mail.com',
        name: 'any_name',
        password
      })
      await pgUserRepo.persistAndFlush(fakeUser)

      const { statusCode, body } = await request(configApp({ orm: ormStub, storage }))
        .post('/api/login')
        .send({ email: 'any_email@mail.com', password: 'any_password' })

      expect(statusCode).toBe(200)
      expect(body.name).toEqual('any_name')
      expect(body.token).toBeTruthy()
    })
    it('should return unauthorized if password is wrong', async () => {
      const password = await bcrypt.hash('any_password', 12)
      const fakeUser = pgUserRepo.create({
        id: v4(),
        email: 'any_email@mail.com',
        name: 'any_name',
        password
      })
      await pgUserRepo.persistAndFlush(fakeUser)

      const { statusCode, body } = await request(configApp({ orm: ormStub, storage }))
        .post('/api/login')
        .send({ email: 'any_email@mail.com', password: 'invalid_password' })

      expect(statusCode).toBe(401)
      expect(body.error).toEqual('Unauthorized')
    })

    it('should return unauthorized if email is wrong', async () => {
      const password = await bcrypt.hash('any_password', 12)
      const fakeUser = pgUserRepo.create({
        id: v4(),
        email: 'any_email@mail.com',
        name: 'any_name',
        password
      })
      await pgUserRepo.persistAndFlush(fakeUser)

      const { statusCode, body } = await request(configApp({ orm: ormStub, storage }))
        .post('/api/login')
        .send({ email: 'invalid_email@mail.com', password: 'any_password' })

      expect(statusCode).toBe(401)
      expect(body.error).toEqual('Unauthorized')
    })
  })
  describe('POST /signup', () => {
    it('should return the correct data on success', async () => {
      const { statusCode, body } = await request(configApp({ orm: ormStub, storage }))
        .post('/api/signup')
        .send({ name: 'any_name', email: 'any_email@mail.com', password: 'any_password', passwordConfirmation: 'any_password' })

      const savedUser = await pgUserRepo.findOne({ email: 'any_email@mail.com' })

      expect(statusCode).toBe(200)
      expect(body.name).toEqual('any_name')
      expect(body.token).toBeTruthy()
      expect(savedUser?.role).toBeNull()
    })
    it('should return unauthorized if email already registred', async () => {
      const password = await bcrypt.hash('any_password', 12)
      const fakeUser = pgUserRepo.create({
        id: v4(),
        email: 'any_email123@mail.com',
        name: 'any_name',
        password
      })
      await pgUserRepo.persistAndFlush(fakeUser)

      const { statusCode, body } = await request(configApp({ orm: ormStub, storage }))
        .post('/api/signup')
        .send({ name: 'any_name', email: 'any_email123@mail.com', password: 'any_password', passwordConfirmation: 'any_password' })

      expect(statusCode).toBe(401)
      expect(body.error).toEqual('Unauthorized')
    })
  })
})
