import { DbTransactionController } from '@/application/decorators'
import { Controller } from '@/application/controllers'
import { DbTransaction } from '@/application/contracts'
import { mock, MockProxy } from 'jest-mock-extended'

describe('DbTransactionController', () => {
  let sut: DbTransactionController
  let decoratee: MockProxy<Controller>
  let db: MockProxy<DbTransaction>

  beforeAll(() => {
    decoratee = mock<Controller>()
    decoratee.perform.mockResolvedValue({ statusCode: 200, data: null })
    db = mock<DbTransaction>()
  })

  beforeEach(() => {
    sut = new DbTransactionController(decoratee, db)
  })

  it('should call db.openTransaction()', async () => {
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalled()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })
  it('should call decoratee.perform with correct input', async () => {
    await sut.perform({ any: 'any' })

    expect(decoratee.perform).toHaveBeenCalledWith({ any: 'any' })
    expect(decoratee.perform).toHaveBeenCalledTimes(1)
  })
  it('should rethrow and call db.rollback if decoratee.perform fails', async () => {
    decoratee.perform.mockRejectedValueOnce(new Error('Aplication Error'))

    const promise = sut.perform({ any: 'any' })

    await expect(promise).rejects.toThrow(new Error('Aplication Error'))
    expect(db.roolback).toHaveBeenCalledWith()
    expect(db.roolback).toHaveBeenCalledTimes(1)
  })
  it('should call db.commit if decoratee.perform succeds', async () => {
    await sut.perform({ any: 'any' })

    expect(db.commit).toHaveBeenCalledWith()
    expect(db.commit).toHaveBeenCalledTimes(1)
  })
  it('should rethrow and call db.rollback if db.commit fails', async () => {
    db.commit.mockRejectedValueOnce(new Error('Database Error'))

    const promise = sut.perform({ any: 'any' })

    await expect(promise).rejects.toThrow(new Error('Database Error'))
    expect(db.roolback).toHaveBeenCalledWith()
    expect(db.roolback).toHaveBeenCalledTimes(1)
  })

  it('should call db.closeTransaction', async () => {
    await sut.perform({ any: 'any' })

    expect(db.closeTransaction).toHaveBeenCalled()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
  })
  it('should return the correct data on success', async () => {
    const response = await sut.perform({ any: 'any' })

    expect(response).toEqual({ statusCode: 200, data: null })
  })
})
