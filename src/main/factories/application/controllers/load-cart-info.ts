import { LoadCartInfoController } from '@/application/controllers'
import { makeLoadCartInfo } from '@/main/factories/domain/use-cases'

export const makeLoadCartInfoController = (): LoadCartInfoController => {
  return new LoadCartInfoController(makeLoadCartInfo())
}
