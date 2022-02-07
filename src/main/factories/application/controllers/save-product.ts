import { SaveProductController } from '@/application/controllers'
import { makeAddProduct } from '@/main/factories/domain/use-cases'

export const makeSaveProductController = (): SaveProductController => {
  return new SaveProductController(makeAddProduct())
}
