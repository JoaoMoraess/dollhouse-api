import { HashComparer } from '@/domain/contracts/gateways'
import { BcryptAdapter } from '@/infra/gateways'

export const makeHashComparer = (): HashComparer => {
  return new BcryptAdapter()
}
