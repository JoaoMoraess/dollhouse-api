import { mock, MockProxy } from 'jest-mock-extended'
import { ChargePurchase, DeliVeryCalculator } from '@/domain/contracts/gateways'
import { SaveOrder } from '@/domain/contracts/repos'
import { Input, EffectPurchase, setupEffectPurchase } from '@/domain/use-cases'

describe('EffectPurchase', () => {
  let sut: EffectPurchase
  let ordersRepo: MockProxy<SaveOrder>
  let chargePurchase: MockProxy<ChargePurchase>
  let deliveryCalculator: MockProxy<DeliVeryCalculator>
  let loadPurchaseInfo: jest.Mock
  let deliveryPrice: number
  let input: Input

  beforeAll(() => {
    loadPurchaseInfo = jest.fn().mockResolvedValue({
      subTotal: 2580,
      products: [{
        id: 'any_id',
        name: 'any_name',
        stock: 2,
        price: 1290,
        imageUrl: '',
        quantity: 1
      },
      {
        id: 'other_id',
        name: 'other_name',
        stock: 2,
        price: 1290,
        imageUrl: '',
        quantity: 1
      }]
    })
    deliveryPrice = 7089
    input = {
      cardBrand: 'VISA',
      localProducts: {
        any_id: 1,
        other_id: 1
      },
      cep: '1243-2333',
      cardNumber: '4111111111111111',
      cardExpirationMoth: '12',
      cardExpirationYear: '2030',
      cardSecurityCode: '123',
      cardHolderName: 'Joao Moraess'
    }

    ordersRepo = mock()
    ordersRepo.save.mockResolvedValue()

    deliveryCalculator = mock()
    deliveryCalculator.calc.mockResolvedValue(deliveryPrice)

    chargePurchase = mock()
    chargePurchase.charge.mockResolvedValue({
      paymentResponse: {
        code: 'any_code',
        message: 'SUCESSO',
        reference: 1234
      },
      id: 'any_id'
    })
  })
  beforeEach(() => {
    sut = setupEffectPurchase(loadPurchaseInfo, ordersRepo, deliveryCalculator, chargePurchase)
  })

  it('should call deliveryCalculator.calc with correct input', async () => {
    await sut(input)

    expect(deliveryCalculator.calc).toHaveBeenCalledWith({ cepWithoutIffen: input.cep, declaredValue: 0 })
    expect(deliveryCalculator.calc).toHaveBeenCalledTimes(1)
  })

  it('should call chargePurchase.charge with corect input', async () => {
    await sut(input)

    expect(chargePurchase.charge).toHaveBeenCalledWith({
      ammoutInCents: 1290 + 1290 + deliveryPrice,
      card: {
        brand: 'VISA',
        expirationMoth: input.cardExpirationMoth,
        expirationYear: input.cardExpirationYear,
        holderName: input.cardHolderName,
        number: input.cardNumber,
        securityCode: input.cardSecurityCode
      }
    })
    expect(chargePurchase.charge).toHaveBeenCalledTimes(1)
  })

  it('should call ordersRepo.save with correct input', async () => {
    await sut(input)

    expect(ordersRepo.save).toHaveBeenCalledWith({
      pagSeguroId: 'any_id',
      total: 1290 + 1290 + deliveryPrice,
      subTotal: 1290 + 1290,
      deliveryCost: deliveryPrice,
      products: [{
        productId: 'any_id',
        quantity: 1
      },
      {
        productId: 'other_id',
        quantity: 1
      }],
      cep: input.cep
    })
    expect(ordersRepo.save).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if ordersRepo throws', async () => {
    ordersRepo.save.mockRejectedValueOnce(new Error('ordersRepo_error'))
    const promise = sut(input)

    await expect(promise).rejects.toThrow(new Error('ordersRepo_error'))
  })

  it('should rethrow if loadPurchaseInfo throws', async () => {
    loadPurchaseInfo.mockRejectedValueOnce(new Error('loadPurchase_error'))
    const promise = sut(input)

    await expect(promise).rejects.toThrow(new Error('loadPurchase_error'))
  })

  it('should rethrow if ordersRepo throws', async () => {
    deliveryCalculator.calc.mockRejectedValueOnce(new Error('deliveryCalculator_error'))
    const promise = sut(input)

    await expect(promise).rejects.toThrow(new Error('deliveryCalculator_error'))
  })

  it('should rethrow if ordersRepo throws', async () => {
    chargePurchase.charge.mockRejectedValueOnce(new Error('chargePurchase_error'))
    const promise = sut(input)

    await expect(promise).rejects.toThrow(new Error('chargePurchase_error'))
  })
})
