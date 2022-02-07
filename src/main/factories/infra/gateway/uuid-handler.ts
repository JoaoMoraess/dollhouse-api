import { UUIDGenerator } from '@/domain/contracts/gateways'
import { UUIdHandler } from '@/infra/gateways'

export const makeUUIdHandler = (): UUIDGenerator => {
  return new UUIdHandler()
}
