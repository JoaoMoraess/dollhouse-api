import { Controller } from '.'
import { noContent, HttpResponse, badRequest } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { ValidateProducts, EffectPurchase } from '@/domain/use-cases'
import { LocalProducts } from '@/domain/entities'

type HttpRequest = {
  localProducts: LocalProducts
  cep: string
  cardBrand: 'VISA' | 'MASTERCARD' | 'AMEX' | 'ELO' | 'HIPERCARD' | 'HIPER' | 'DINERS'
  cardNumber: string
  cardExpirationMoth: string
  cardExpirationYear: string
  cardSecurityCode: string
  cardHolderName: string
}

export class EffectPurchaseController extends Controller {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (
    private readonly ValidateProducts: ValidateProducts,
    private readonly makePurchase: EffectPurchase
  ) { super() }

  override async perform (httpRequest: HttpRequest): Promise<HttpResponse<null | Error>> {
    const error = await this.ValidateProducts({ localProducts: httpRequest.localProducts })
    if (error !== null) return badRequest(error)
    await this.makePurchase(httpRequest)
    return noContent()
  }

  override buildValidators ({
    localProducts,
    cep,
    cardBrand,
    cardExpirationMoth,
    cardExpirationYear,
    cardHolderName,
    cardNumber,
    cardSecurityCode
  }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldValue: localProducts, fieldName: 'localProducts' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cep, fieldName: 'cep' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cardExpirationMoth, fieldName: 'cardExpirationMoth' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cardBrand, fieldName: 'cardBrand' })
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
