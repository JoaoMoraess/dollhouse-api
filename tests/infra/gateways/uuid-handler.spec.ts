import { v4 } from 'uuid'

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'any_uuid')
}))

class UUIdHandler {
  generate (): string {
    const id = v4()
    return id
  }
}

describe('UUidHandler', () => {
  it('should call v4', () => {
    const uuidHandler = new UUIdHandler()
    uuidHandler.generate()
    expect(v4).toHaveBeenCalled()
  })
})
