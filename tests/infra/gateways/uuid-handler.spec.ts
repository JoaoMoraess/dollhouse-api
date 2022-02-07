import { v4 } from 'uuid'

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'any_uuid')
}))

interface UUIDGenerator {
  generate: (input: UUIDGenerator.Input) => UUIDGenerator.Output
}

namespace UUIDGenerator {
  export type Input = {
    key: string
  }
  export type Output = string
}

class UUIdHandler implements UUIDGenerator {
  generate ({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    const uuid = v4()
    return `${key}_${uuid}`
  }
}

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
    sut.generate({ key })
    expect(v4).toHaveBeenCalled()
  })

  it('should return the correct value', () => {
    const id = sut.generate({ key })
    expect(id).toBe(`${key}_any_uuid`)
  })
})
