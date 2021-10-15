import { Controller } from '.'
import { noContent, HttpResponse } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = {
  productsIds: string[]
  cep: string
  cardNumber: number
  cardExpirationMoth: number
  cardExpirationYear: number
  cardSecurityCode: number
  cardHolderName: string
}

export class MakePurchaseController extends Controller {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (private readonly makePurchase: any) {
    super()
  }

  override async perform (httpRequest: HttpRequest): Promise<HttpResponse<null>> {
    await this.makePurchase(httpRequest)
    return noContent()
  }

  override buildValidators ({
    productsIds,
    cep,
    cardExpirationMoth,
    cardExpirationYear,
    cardHolderName,
    cardNumber,
    cardSecurityCode
  }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldValue: productsIds, fieldName: 'productsIds' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cep, fieldName: 'cep' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cardExpirationMoth, fieldName: 'cardExpirationMoth' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cardExpirationYear, fieldName: 'cardExpirationYear' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cardHolderName, fieldName: 'cardHolderName' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cardNumber, fieldName: 'cardNumber' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cardSecurityCode, fieldName: 'cardSecurityCode' })
        .required().build()
    ]
  }
}
