import { mock, MockProxy } from 'jest-mock-extended'
import { ChargePurchase } from '@/domain/contracts/gateways'
import { LoadProductsByIds } from '@/domain/contracts/repos'

interface SaveOrder {
  save: (input: any) => Promise<void>
}

interface DeliVeryCalculator {
  calc: (input: any) => Promise<number>
}

type Input = {
  productsIds: string[]
  cep: string
  cardNumber: string
  cardExpirationMoth: string
  cardExpirationYear: string
  cardSecurityCode: string
  cardHolderName: string
}

type MakePurchase = (input: Input) => Promise<void>

type SetupMakePurchase = (
  productsRepo: LoadProductsByIds,
  ordersRepo: SaveOrder,
  deliveryCalculator: DeliVeryCalculator,
  chargePurchase: ChargePurchase
) => MakePurchase

const setupMakePurchase: SetupMakePurchase = (
  productsRepo,
  ordersRepo,
  deliveryCalculator,
  chargePurchase
) => async input => {
  const products = await productsRepo.loadByIds(input.productsIds)

  const subTotal = products.reduce((acc, product) => product.price + acc, 0)
  const subTotalInCents = subTotal * 100

  const deliveryAmmout = await deliveryCalculator.calc({ cep: input.cep })
  const totalInCents = Number((subTotalInCents + deliveryAmmout).toFixed())

  const { id, paymentResponse } = await chargePurchase.charge({
    ammoutInCents: totalInCents,
    card: {
      brand: 'VISA',
      expirationMoth: input.cardExpirationMoth,
      expirationYear: input.cardExpirationYear,
      holderName: input.cardHolderName,
      number: input.cardNumber,
      securityCode: input.cardSecurityCode
    }
  })
  if (paymentResponse.message === 'SUCESSO') {
    await ordersRepo.save({ id, productsIds: input.productsIds, cep: input.cep })
  }
}

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
      productsIds: ['any_id', 'other_id'],
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
      price: 129.70,
      stock: 3
    },
    {
      id: 'other_id',
      imageUrl: 'other_image_url',
      name: 'other_name',
      price: 129.70,
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

    expect(productsRepo.loadByIds).toHaveBeenCalledWith(input.productsIds)
    expect(productsRepo.loadByIds).toHaveBeenCalledTimes(1)
  })

  it('should call deliveryCalculator.calc with correct input', async () => {
    await sut(input)

    expect(deliveryCalculator.calc).toHaveBeenCalledWith({ cep: input.cep })
    expect(deliveryCalculator.calc).toHaveBeenCalledTimes(1)
  })

  it('should call chargePurchase.charge with corect input', async () => {
    await sut(input)

    expect(chargePurchase.charge).toHaveBeenCalledWith({
      ammoutInCents: Number((((129.70 + 129.70) * 100) + deliveryPrice).toFixed()),
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

    expect(ordersRepo.save).toHaveBeenCalledWith({ id: 'any_id', productsIds: input.productsIds, cep: input.cep })
    expect(ordersRepo.save).toHaveBeenCalledTimes(1)
  })
})
