import { AddProduct, setupAddProduct } from '@/domain/use-cases'
import { makeAWSS3FileStorage, makeUUIdHandler } from '@/main/factories/infra/gateway'
import { makePgProductsRepo } from '@/main/factories/infra/repos/postgres'

export const makeAddProduct = (): AddProduct => {
  return setupAddProduct(makeUUIdHandler(), makeAWSS3FileStorage(), makePgProductsRepo())
}
