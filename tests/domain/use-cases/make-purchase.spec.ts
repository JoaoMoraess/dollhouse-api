import { mock, MockProxy } from 'jest-mock-extended'
import { ChargePurchase, DeliVeryCalculator } from '@/domain/contracts/gateways'
import { LoadProductsByIds, SaveOrder } from '@/domain/contracts/repos'
import { InvalidCartError } from '@/domain/entities/errors'
import { Input, MakePurchase, setupMakePurchase } from '@/domain/use-cases'

describe('MakePurchase', () => {
  let sut: MakePurchase
  let productsRepo: MockProxy<LoadProductsByIds>
  let ordersRepo: MockProxy<SaveOrder>
  let chargePurchase: MockProxy<ChargePurchase>
  let deliveryCalculator: MockProxy<DeliVeryCalculator>
  let deliveryPrice: number
  let input: Input

  beforeAll(() => {
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

    productsRepo = mock()
    productsRepo.loadByIds.mockResolvedValue([{
      id: 'any_id',
      imageUrl: 'any_image_url',
      name: 'any_name',
      price: 12970,
      stock: 3
    },
    {
      id: 'other_id',
      imageUrl: 'other_image_url',
      name: 'other_name',
      price: 12970,
      stock: 3
    }])

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
    sut = setupMakePurchase(productsRepo, ordersRepo, deliveryCalculator, chargePurchase)
  })

  it('should call productsRepo.loadByIds with correct input', async () => {
    await sut(input)

    expect(productsRepo.loadByIds).toHaveBeenCalledWith(Object.keys(input.localProducts))
    expect(productsRepo.loadByIds).toHaveBeenCalledTimes(1)
  })

  it('should call deliveryCalculator.calc with correct input', async () => {
    await sut(input)

    expect(deliveryCalculator.calc).toHaveBeenCalledWith({ cepWithoutIffen: input.cep, declaredValue: 0 })
    expect(deliveryCalculator.calc).toHaveBeenCalledTimes(1)
  })

  it('should call chargePurchase.charge with corect input', async () => {
    await sut(input)

    expect(chargePurchase.charge).toHaveBeenCalledWith({
      ammoutInCents: 12970 + 12970 + deliveryPrice,
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
      total: 12970 + 12970 + deliveryPrice,
      subTotal: 12970 + 12970,
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

  it('should rethrow if productsRepo throws', async () => {
    productsRepo.loadByIds.mockRejectedValueOnce(new Error('productRepo_error'))
    const promise = sut(input)

    await expect(promise).rejects.toThrow(new Error('productRepo_error'))
  })

  it('should rethrow if ordersRepo throws', async () => {
    ordersRepo.save.mockRejectedValueOnce(new Error('ordersRepo_error'))
    const promise = sut(input)

    await expect(promise).rejects.toThrow(new Error('ordersRepo_error'))
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

  it('should throw if invalid products are provided', async () => {
    input.localProducts = {
      invalid_id: 1
    }
    const promise = sut(input)

    await expect(promise).rejects.toThrow(new InvalidCartError())
  })
})
