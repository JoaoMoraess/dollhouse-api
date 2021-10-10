import { LoadCartController } from '@/application/controllers'
import { makeLoadCartInfo } from '@/main/factories/domain/use-cases'

export const makeLoadCartController = (): LoadCartController => {
  return new LoadCartController(makeLoadCartInfo())
}
