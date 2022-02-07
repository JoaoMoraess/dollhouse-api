import { HttpResponse, noContent } from '@/application/helpers'
import { Validator } from '@/application/validation'
import { ValidationBuilder } from '@/application/validation/builder'
import { AddProduct } from '@/domain/use-cases'
import { Controller } from '.'

type HttpRequest = {
  name: string
  price: number
  stock: number
  description?: string
  imageFile: { buffer: Buffer, mimeType: string }
}

export class SaveProductController extends Controller {
  constructor (
    private readonly addProduct: AddProduct
  ) { super() }

  override async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { imageFile: { buffer }, name, price, stock, description } = httpRequest
    await this.addProduct({ imageFile: buffer, name, price, stock, description })
    return noContent()
  }

  override buildValidators ({ name, price, stock, imageFile }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldValue: name, fieldName: 'name' }).required().build(),
      ...ValidationBuilder.of({ fieldValue: price, fieldName: 'price' }).required().minNumber(0).build(),
      ...ValidationBuilder.of({ fieldValue: stock, fieldName: 'stock' }).required().minNumber(0).build(),
      ...ValidationBuilder.of({ fieldValue: imageFile, fieldName: 'imageFile' }).required().image({ maxSizeInMb: 1, allowed: ['jpg', 'png'] }).build()
    ]
  }
}
