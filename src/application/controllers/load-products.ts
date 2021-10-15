import { Controller } from '.'
import { HttpResponse, ok } from '@/application/helpers'
import { Validator, ValidationBuilder } from '@/application/validation'
import { LoadProducts } from '@/domain/use-cases'

type HttpRequest = {
  limit: string
  offset: string
}

export class LoadProductsController extends Controller {
  constructor (private readonly loadProducts: LoadProducts) {
    super()
  }

  override async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    const limit = Number(httpRequest.limit)
    const offset = Number(httpRequest.offset)
    const { products } = await this.loadProducts({ limit, offset })
    return ok({ products })
  }

  override buildValidators ({ limit, offset }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder
        .of({ fieldValue: limit, fieldName: 'limit' })
        .required()
        .build(),
      ...ValidationBuilder
        .of({ fieldValue: offset, fieldName: 'offset' })
        .required()
        .build()
    ]
  }
}
