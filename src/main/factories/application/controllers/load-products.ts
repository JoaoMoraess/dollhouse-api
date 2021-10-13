import { LoadProductsController } from '@/application/controllers'
import { makeLoadProducts } from '@/main/factories/domain/use-cases'

export const makeLoadProductsController = (): LoadProductsController => {
  return new LoadProductsController(makeLoadProducts())
}
