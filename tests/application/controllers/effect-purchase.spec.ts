import { Controller, EffectPurchaseController } from '@/application/controllers'
import { noContent, badRequest } from '@/application/helpers'
import { Required, RequiredString } from '@/application/validation'
import { LocalProducts } from '@/domain/entities'
import { InvalidCartError, NoLongerInStock } from '@/domain/errors'

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

describe('EffectPurchaseController', () => {
  let httpRequest: HttpRequest
  let sut: EffectPurchaseController
  let effectPurchase: jest.Mock
  let ValidateProducts: jest.Mock

  beforeAll(() => {
    httpRequest = {
      localProducts: {
        any_id: 1,
        other_id: 2
      },
      cardBrand: 'VISA',
      cep: '94750-000',
      cardExpirationMoth: '4',
      cardExpirationYear: '2021',
      cardHolderName: 'Joao M',
      cardNumber: '2123123422',
      cardSecurityCode: '876'
    }
    effectPurchase = jest.fn().mockResolvedValue(() => {})
    ValidateProducts = jest.fn().mockResolvedValue(null)
  })
  beforeEach(() => {
    sut = new EffectPurchaseController(ValidateProducts, effectPurchase)
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validators', async () => {
    const validators = sut.buildValidators(httpRequest)

    expect(validators).toEqual([
      new Required(httpRequest.localProducts, 'localProducts'),
      new RequiredString(httpRequest.cep, 'cep'),
      new RequiredString(httpRequest.cardExpirationMoth, 'cardExpirationMoth'),
      new RequiredString(httpRequest.cardBrand, 'cardBrand'),
      new RequiredString(httpRequest.cardExpirationYear, 'cardExpirationYear'),
      new RequiredString(httpRequest.cardHolderName, 'cardHolderName'),
      new RequiredString(httpRequest.cardNumber, 'cardNumber'),
      new RequiredString(httpRequest.cardSecurityCode, 'cardSecurityCode')
    ])
  })
  it('should call effectPurchase with correct input', async () => {
    await sut.handle(httpRequest)

    expect(effectPurchase).toHaveBeenCalledWith(httpRequest)
    expect(effectPurchase).toHaveBeenCalledTimes(1)
  })
  it('should return noContent on success', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(noContent())
  })
  it('should return 401 with InvalidCart if cart is invalid', async () => {
    ValidateProducts.mockResolvedValueOnce(new InvalidCartError())
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidCartError()))
    expect(effectPurchase).not.toHaveBeenCalled()
  })

  it('should return 401 NoLongerInStock if products is out of stock', async () => {
    ValidateProducts.mockResolvedValueOnce(new NoLongerInStock('any_name', 2))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new NoLongerInStock('any_name', 2)))
    expect(effectPurchase).not.toHaveBeenCalled()
  })
})
