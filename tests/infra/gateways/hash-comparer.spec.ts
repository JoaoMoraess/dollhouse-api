import { HashComparer } from '@/domain/contracts/gateways'
import bcrypt from 'bcrypt'

class BcryptAdapter implements HashComparer {
  async compare ({ plainText, digest }: { plainText: string, digest: string }): Promise<boolean> {
    const isEqual = await bcrypt.compare(plainText, digest)
    return isEqual
  }
}

jest.mock('bcrypt')

describe('BcryptAdapter', () => {
  let sut: BcryptAdapter
  let fakeBcrypt: jest.Mocked<typeof bcrypt>
  let plainText: string
  let digest: string

  beforeEach(() => {
    fakeBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
    plainText = 'any_string'
    digest = 'any_encrypted_string'
    sut = new BcryptAdapter()
  })

  it('should call bcrypt.compare with correct input', async () => {
    await sut.compare({ plainText, digest })

    expect(fakeBcrypt.compare).toHaveBeenCalledWith(plainText, digest)
    expect(fakeBcrypt.compare).toHaveBeenCalledTimes(1)
  })
})
