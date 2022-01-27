import { Controller } from '.'
import { HttpResponse, ok } from '@/application/helpers'
import { Validator, ValidationBuilder } from '@/application/validation'
import { LoadProducts } from '@/domain/use-cases'

type HttpRequest = {
  limit: string
  offset: string
  orderBy: string
  sortBy: string
}

export class LoadProductsController extends Controller {
  constructor (
    private readonly loadProducts: LoadProducts
  ) { super() }

  override async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    const limit = Number(httpRequest.limit)
    const offset = Number(httpRequest.offset)
    const { orderBy, sortBy } = httpRequest
    const { products, totalProductsCount } = await this.loadProducts({ limit, offset, orderBy, sortBy })
    return ok({ products, totalCount: totalProductsCount })
  }

  override buildValidators ({ limit, offset, orderBy, sortBy }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder
        .of({ fieldValue: limit, fieldName: 'limit' })
        .required()
        .build(),
      ...ValidationBuilder
        .of({ fieldValue: offset, fieldName: 'offset' })
        .required()
        .build(),
      ...ValidationBuilder
        .of({ fieldValue: orderBy, fieldName: 'orderBy' })
        .required()
        .build(),
      ...ValidationBuilder
        .of({ fieldValue: sortBy, fieldName: 'sortBy' })
        .required()
        .build()
    ]
  }
}
