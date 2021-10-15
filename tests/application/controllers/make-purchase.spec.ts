import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { Validator, ValidationBuilder, Required, RequiredString } from '@/application/validation'

type HttpRequest = {
  productsIds: string[]
  cart: {
    number: number
    expirationMoth: number
    expirationYear: number
    securityCode: number
    holderName: string
  }
  cep: string
}

class MakePurchaseController extends Controller {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor () {
    super()
  }

  override async perform (httpRequest: HttpRequest): Promise<HttpResponse<any>> {
    return {
      statusCode: 200,
      data: ''
    }
  }

  override buildValidators ({ productsIds, cep, cart }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldValue: productsIds, fieldName: 'productsIds' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cep, fieldName: 'cep' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cart, fieldName: 'cart' })
        .required().build()
    ]
  }
}

describe('MakePurchaseController', () => {
  let sut: MakePurchaseController
  beforeEach(() => {
    sut = new MakePurchaseController()
  })
  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
  it('should build validators', async () => {
    const validators = sut.buildValidators({
      productsIds: ['any_id', 'other_id'],
      cep: '94750-000',
      cart: {
        expirationMoth: 4,
        expirationYear: 2021,
        holderName: 'Joao M',
        number: 2123123422,
        securityCode: 876
      }
    })

    expect(validators).toEqual([
      new Required(['any_id', 'other_id'], 'productsIds'),
      new RequiredString('94750-000', 'cep'),
      new Required({
        expirationMoth: 4,
        expirationYear: 2021,
        holderName: 'Joao M',
        number: 2123123422,
        securityCode: 876
      }, 'cart')
    ])
  })
})
