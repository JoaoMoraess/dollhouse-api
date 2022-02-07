import { HttpResponse, noContent } from '@/application/helpers'
import { Validator } from '@/application/validation'
import { ValidationBuilder } from '@/application/validation/builder'
import { Controller } from '.'

type HttpRequest = {
  name: string
  price: number
  stock: number
  imageFile: { buffer: Buffer, mimeType: string }
}

type SaveProduct = (input: HttpRequest) => Promise<void>

export class SaveProductController extends Controller {
  constructor (
    private readonly SaveProduct: SaveProduct
  ) { super() }

  override async perform (httpRequest: HttpRequest): Promise<HttpResponse<any>> {
    const { imageFile, name, price, stock } = httpRequest
    await this.SaveProduct({ imageFile, name, price, stock })
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
