import { Controller } from '.'
import { HttpResponse, ok } from '../helpers'
import { ValidationBuilder, Validator } from '../validation'

type ProductCartItem = {
  id: string
  name: string
  imageUrl: string
  price: number
  quantity: number
}
type CartInfo = {
  products: ProductCartItem[]
  subTotal: number
}

type Quantity = number
export type LocalProducts = {
  [id: string]: Quantity
}

type HttpRequest = { localProducts: LocalProducts }

export class LoadCartController extends Controller {
  constructor (private readonly loadCartInfo: any) {
    super()
  }

  override async perform ({ localProducts }: HttpRequest): Promise<HttpResponse<CartInfo>> {
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
