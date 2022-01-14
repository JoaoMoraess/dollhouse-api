import { LocalProducts, ProductCartItem } from '@/domain/entities'
import { Controller } from '.'
import { HttpResponse, badRequest, ok } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { ValidateProducts, LoadPurchaseInfo } from '@/domain/use-cases'

type HttpRequest = { localProducts: LocalProducts }
type Model = { products: ProductCartItem[], subTotal: number }

export class LoadPurchaseInfoController extends Controller {
  constructor (
    private readonly validateProducts: ValidateProducts,
    private readonly loadPurchaseInfo: LoadPurchaseInfo
  ) { super() }

  override async perform ({ localProducts }: HttpRequest): Promise<HttpResponse<Model | Error>> {
    const error = await this.validateProducts({ localProducts })
    if (error !== null) return badRequest(error)
    const { products, subTotal } = await this.loadPurchaseInfo({ localProducts })
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
