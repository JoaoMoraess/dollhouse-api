import { ValidateProducts, setValidateProducts } from '@/domain/use-cases'
import { makePgProductsRepo } from '@/main/factories/infra/repos/postgres'

export const makeValidateProducts = (): ValidateProducts => {
  return setValidateProducts(makePgProductsRepo())
}
