import { UUIdHandler } from '@/infra/gateways'
import { DeleteFile, UploadFile } from '@/domain/contracts/gateways'
import { SaveProduct } from '@/domain/contracts/repos'

type Input = {name: string, price: number, description: string, imageFile: Buffer}
export type AddProduct = (product: Input) => Promise<void>
type Setup = (uuidHandler: UUIdHandler, fileStorage: UploadFile & DeleteFile, productRepo: SaveProduct) => AddProduct

export const setAddProduct: Setup = (uuidHandler, fileStorage, productRepo) => async ({ description, imageFile, name, price }) => {
  const fileName = uuidHandler.generate(name)
  const imageUrl = await fileStorage.upload({ file: imageFile, fileName })
  try {
    await productRepo.save({ name, price, description, imageUrl })
  } catch (error) {
    await fileStorage.delete({ fileName })
    throw error
  }
}
