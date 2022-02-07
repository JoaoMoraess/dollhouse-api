import { UUIDGenerator } from '@/domain/contracts/gateways'
import { v4 } from 'uuid'

export class UUIdHandler implements UUIDGenerator {
  generate (key?: string): string {
    const uuid = v4()
    return key ? `${key}_${uuid}` : uuid
  }
}
