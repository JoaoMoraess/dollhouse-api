import { LoadCartInfoController } from '@/application/controllers'
import { makeLoadCartInfo, makeCheckProductsIsValid } from '@/main/factories/domain/use-cases'

export const makeLoadCartInfoController = (): LoadCartInfoController => {
  return new LoadCartInfoController(makeCheckProductsIsValid(), makeLoadCartInfo())
}
