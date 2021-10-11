import { Controller } from '.'
import { HttpResponse, ok } from '@/application/helpers'
import { Validator, ValidationBuilder } from '@/application/validation'

type HttpRequest = {
  limit: number
  offset: number
}

export class LoadProductsController extends Controller {
  constructor (private readonly loadProducts: any) {
    super()
  }

  override async perform ({ limit, offset }: HttpRequest): Promise<HttpResponse> {
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
