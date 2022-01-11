import { LocalProducts, ProductCartItem } from '@/domain/entities'
import { Controller } from '.'
import { HttpResponse, badRequest, ok } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { LoadCartInfo } from '@/domain/use-cases'

type HttpRequest = { localProducts: LocalProducts }
type Model = { products: ProductCartItem[], subTotal: number }

export type CheckProductsIsValid = (input: { localProducts: LocalProducts }) => Promise<Error | null>

export class LoadCartInfoController extends Controller {
  constructor (
    private readonly checkProductsIsValid: CheckProductsIsValid,
    private readonly loadCartInfo: LoadCartInfo
  ) { super() }

  override async perform ({ localProducts }: HttpRequest): Promise<HttpResponse<Model | Error>> {
    const error = await this.checkProductsIsValid({ localProducts })
    if (error !== null) return badRequest(error)
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
