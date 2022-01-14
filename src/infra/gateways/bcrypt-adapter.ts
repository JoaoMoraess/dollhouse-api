import { HashComparer, Hasher } from '@/domain/contracts/gateways'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number = 12) {}

  async hash ({ plainText }: { plainText: string }): Promise<string> {
    const hashedText = await bcrypt.hash(plainText, this.salt)
    return hashedText
  }

  async compare ({ plainText, digest }: { plainText: string, digest: string }): Promise<boolean> {
    const isEqual = await bcrypt.compare(plainText, digest)
    return isEqual
  }
}
