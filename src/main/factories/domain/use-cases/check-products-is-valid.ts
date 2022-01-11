import { CheckProductsIsValid, setCheckProductIsValid } from '@/domain/use-cases'
import { makePgProductsRepo } from '@/main/factories/infra/repos/postgres'

export const makeCheckProductsIsValid = (): CheckProductsIsValid => {
  return setCheckProductIsValid(makePgProductsRepo())
}
