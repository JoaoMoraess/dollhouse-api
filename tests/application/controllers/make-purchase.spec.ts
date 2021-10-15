import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { Validator, ValidationBuilder, Required, RequiredString } from '@/application/validation'

type Card = {
  number: number
  expirationMoth: number
  expirationYear: number
  securityCode: number
  holderName: string
}

type HttpRequest = {
  productsIds: string[]
  card: Card
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

  override buildValidators ({ productsIds, cep, card }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldValue: productsIds, fieldName: 'productsIds' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cep, fieldName: 'cep' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: card, fieldName: 'card' })
        .required().build()
    ]
  }
}

describe('MakePurchaseController', () => {
  let sut: MakePurchaseController
  let productsIds: string[]
  let cep: string
  let card: Card

  beforeEach(() => {
    productsIds = [
      'any_id',
      'other_id'
    ]
    cep = '94750-000'
    card = {
      expirationMoth: 4,
      expirationYear: 2021,
      holderName: 'Joao M',
      number: 2123123422,
      securityCode: 876
    }
  })
  beforeEach(() => {
    sut = new MakePurchaseController()
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validators', async () => {
    const validators = sut.buildValidators({
      productsIds,
      cep,
      card
    })

    expect(validators).toEqual([
      new Required(productsIds, 'productsIds'),
      new RequiredString(cep, 'cep'),
      new Required(card, 'card')
    ])
  })
})
