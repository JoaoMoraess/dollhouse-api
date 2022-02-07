import { v4 } from 'uuid'
import { UUIdHandler } from '@/infra/gateways'

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'any_uuid')
}))

describe('UUidHandler', () => {
  let key: string
  let sut: UUIdHandler

  beforeEach(() => {
    sut = new UUIdHandler()
  })

  beforeAll(() => {
    key = 'any_key'
  })

  it('should call v4', () => {
    sut.generate(key)
    expect(v4).toHaveBeenCalled()
  })

  it('should return the correct value', () => {
    const id = sut.generate(key)
    expect(id).toBe(`${key}_any_uuid`)
  })

  it('should return the correct value without key', () => {
    const id = sut.generate()
    expect(id).toBe('any_uuid')
  })
})
