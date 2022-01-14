import { HashComparer } from '@/domain/contracts/gateways'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements HashComparer {
  async compare ({ plainText, digest }: { plainText: string, digest: string }): Promise<boolean> {
    const isEqual = await bcrypt.compare(plainText, digest)
    return isEqual
  }
}
