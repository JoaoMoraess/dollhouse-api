import { UUIdHandler } from '@/infra/gateways'
import { DeleteFile, UploadFile } from '@/domain/contracts/gateways'
import { AddProduct } from '@/domain/contracts/repos'

type Input = {name: string, price: number, description: string, imageFile: Buffer}
export type CreateProduct = (product: Input) => Promise<void>
type Setup = (uuidHandler: UUIdHandler, fileStorage: UploadFile & DeleteFile, productRepo: AddProduct) => CreateProduct

export const setCreateProduct: Setup = (uuidHandler, fileStorage, productRepo) => async ({ description, imageFile, name, price }) => {
  const fileName = uuidHandler.generate(name.replaceAll(' ', '_'))
  const imageUrl = await fileStorage.upload({ file: imageFile, fileName })
  try {
    await productRepo.add({ name, price, description, imageUrl })
  } catch (error) {
    await fileStorage.delete({ fileName })
    throw error
  }
}
