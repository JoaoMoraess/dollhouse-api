import { Controller } from '@/application/controllers/controller'
import { HttpResponse } from '@/application/helpers'
import { Validator, RequiredString, RequiredBuffer, MaxFileSize, NumberLength, RequiredNumber } from '@/application/validation'
import { ValidationBuilder } from '@/application/validation/builder'

type HttpRequrest = {
  name: string
  price: number
  stock: number
  imageFile: { buffer: Buffer }
}

class AddProductController extends Controller {
  override async perform (httpRequest: HttpRequrest): Promise<HttpResponse<any>> {
    return {
      data: {},
      statusCode: 200
    }
  }

  override buildValidators ({ name, price, stock, imageFile }: HttpRequrest): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldValue: name, fieldName: 'name' }).required().build(),
      ...ValidationBuilder.of({ fieldValue: price, fieldName: 'price' }).required().minNumber(0).build(),
      ...ValidationBuilder.of({ fieldValue: stock, fieldName: 'stock' }).required().minNumber(0).build(),
      ...ValidationBuilder.of({ fieldValue: imageFile, fieldName: 'imageFile' }).required().image({ maxSizeInMb: 1 }).build()
    ]
  }// TODO make a extension validation to imageFile field
}

describe('AddProductsController', () => {
  let sut: AddProductController
  let httpRequest: HttpRequrest

  beforeEach(() => {
    httpRequest = {
      name: 'pencil',
      price: 1290,
      stock: 5,
      imageFile: { buffer: Buffer.from(new ArrayBuffer(1 * 1024)) }
    }
    sut = new AddProductController()
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
      new MaxFileSize(1, httpRequest.imageFile.buffer)
    ])
  })
})
