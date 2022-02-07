import { UUIdHandler } from '@/infra/gateways'
import { mock, MockProxy } from 'jest-mock-extended'
import { AddProduct, setAddProduct } from '@/domain/use-cases'
import { DeleteFile, UploadFile } from '@/domain/contracts/gateways'
import { SaveProduct } from '@/domain/contracts/repos'

describe('AddProduct', () => {
  let sut: AddProduct
  let uuidHandler: MockProxy<UUIdHandler>
  let fileStorage: MockProxy<UploadFile & DeleteFile>
  let productRepo: MockProxy<SaveProduct>
  let params: {name: string, price: number, stock: number, description: string, imageFile: Buffer}

  beforeAll(() => {
    uuidHandler = mock<UUIdHandler>()
    uuidHandler.generate.mockReturnValue('any_product_name_uuid')
    fileStorage = mock<UploadFile & DeleteFile>()
    fileStorage.upload.mockResolvedValue('any_product_url')
    fileStorage.delete.mockResolvedValue()
    productRepo = mock<SaveProduct>()
    productRepo.save.mockResolvedValue()
    params = {
      name: 'any_product_name',
      price: 10,
      stock: 10,
      description: 'any_product_description',
      imageFile: Buffer.from(new ArrayBuffer(10))
    }
  })

  beforeEach(() => {
    sut = setAddProduct(uuidHandler, fileStorage, productRepo)
  })

  it('should call uuidHandler with correct key', async () => {
    await sut(params)

    expect(uuidHandler.generate).toHaveBeenCalledWith('any_product_name')
  })
  it('should call fileStorage with correct input', async () => {
    await sut(params)

    expect(fileStorage.upload).toHaveBeenCalledWith({
      file: params.imageFile,
      fileName: 'any_product_name_uuid'
    })
  })
  it('should call productRepo.add with correct input', async () => {
    await sut(params)

    expect(productRepo.save).toHaveBeenCalledWith({
      description: params.description,
      imageUrl: 'any_product_url',
      name: params.name,
      stock: params.stock,
      price: params.price
    })
  })
  it('should call fileStorage.delete and throws if productRepo.save throw', async () => {
    productRepo.save.mockRejectedValueOnce(new Error('any_error'))

    const promise = sut(params)

    await expect(promise).rejects.toThrow('any_error')
    expect(fileStorage.delete).toHaveBeenCalledWith({ fileName: 'any_product_name_uuid' })
  })
})
