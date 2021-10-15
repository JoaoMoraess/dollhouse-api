import { Controller, MakePurchaseController } from '@/application/controllers'
import { noContent } from '@/application/helpers'
import { Required, RequiredString, RequiredNumber } from '@/application/validation'

type HttpRequest = {
  productsIds: string[]
  cep: string
  cardNumber: number
  cardExpirationMoth: number
  cardExpirationYear: number
  cardSecurityCode: number
  cardHolderName: string
}

describe('MakePurchaseController', () => {
  let httpRequest: HttpRequest
  let sut: MakePurchaseController
  let makePurchase: jest.Mock

  beforeAll(() => {
    httpRequest = {
      productsIds: ['any_id', 'other_id'],
      cep: '94750-000',
      cardExpirationMoth: 4,
      cardExpirationYear: 2021,
      cardHolderName: 'Joao M',
      cardNumber: 2123123422,
      cardSecurityCode: 876
    }
    makePurchase = jest.fn().mockResolvedValue(() => {})
  })
  beforeEach(() => {
    sut = new MakePurchaseController(makePurchase)
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validators', async () => {
    const validators = sut.buildValidators(httpRequest)

    expect(validators).toEqual([
      new Required(httpRequest.productsIds, 'productsIds'),
      new RequiredString(httpRequest.cep, 'cep'),
      new RequiredNumber(httpRequest.cardExpirationMoth, 'cardExpirationMoth'),
      new RequiredNumber(httpRequest.cardExpirationYear, 'cardExpirationYear'),
      new RequiredString(httpRequest.cardHolderName, 'cardHolderName'),
      new RequiredNumber(httpRequest.cardNumber, 'cardNumber'),
      new RequiredNumber(httpRequest.cardSecurityCode, 'cardSecurityCode')
    ])
  })
  it('should call makePurchase with correct input', async () => {
    await sut.handle(httpRequest)

    expect(makePurchase).toHaveBeenCalledWith(httpRequest)
    expect(makePurchase).toHaveBeenCalledTimes(1)
  })
  it('should return noContent on success', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(noContent())
  })
})
