import { UUIDGenerator } from '@/domain/contracts/gateways'
import { v4 } from 'uuid'

export class UUIdHandler implements UUIDGenerator {
  generate ({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    const uuid = v4()
    return `${key}_${uuid}`
  }
}
