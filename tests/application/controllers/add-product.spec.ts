import { Controller } from '@/application/controllers/controller'
import { noContent } from '@/application/helpers'
import { RequiredString, RequiredBuffer, AllowedMimeTypes, MaxFileSize, NumberLength, RequiredNumber } from '@/application/validation'
import { AddProductController } from '@/application/controllers'

type HttpRequest = {
  name: string
  price: number
  stock: number
  imageFile: { buffer: Buffer, mimeType: string }
}

describe('AddProductsController', () => {
  let sut: AddProductController
  let httpRequest: HttpRequest
  let addProduct: jest.Mock

  beforeAll(() => {
    addProduct = jest.fn()
  })

  beforeEach(() => {
    httpRequest = {
      name: 'pencil',
      price: 1290,
      stock: 5,
      imageFile: { buffer: Buffer.from(new ArrayBuffer(1 * 1024)), mimeType: 'image/jpg' }
    }
    sut = new AddProductController(addProduct)
  })

  it('should extend controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should make validators correctly', async () => {
    const validators = sut.buildValidators(httpRequest)
    expect(validators).toEqual([
      new RequiredString(httpRequest.name, 'name'),
      new RequiredNumber(httpRequest.price, 'price'),
      new NumberLength(httpRequest.price, 'min', 0, 'price'),
      new RequiredNumber(httpRequest.stock, 'stock'),
      new NumberLength(httpRequest.stock, 'min', 0, 'stock'),
      new RequiredBuffer(httpRequest.imageFile.buffer, 'imageFile'),
      new MaxFileSize(1, httpRequest.imageFile.buffer),
      new AllowedMimeTypes(['jpg', 'png'], 'image/jpg')
    ])
  })

  it('should call addProduct with correct values', async () => {
    await sut.handle(httpRequest)

    expect(addProduct).toHaveBeenCalledWith({ ...httpRequest })
    expect(addProduct).toHaveBeenCalledTimes(1)
  })
  it('should return noContent on success', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(noContent())
  })
})
