import { LocalProducts, ProductCartItem } from '@/domain/entities'
import { Controller } from '.'
import { HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { LoadCartInfo } from '@/domain/use-cases'

type HttpRequest = { localProducts: LocalProducts }
type Model = { products: ProductCartItem[], subTotal: number }

export class LoadCartInfoController extends Controller {
  constructor (private readonly loadCartInfo: LoadCartInfo) {
    super()
  }

  override async perform ({ localProducts }: HttpRequest): Promise<HttpResponse<Model>> {
    const { products, subTotal } = await this.loadCartInfo({ localProducts })
    return ok({ products, subTotal })
  }

  override buildValidators ({ localProducts }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder
        .of({ fieldValue: localProducts, fieldName: 'localProducts' })
        .required()
        .build()
    ]
  }
}
