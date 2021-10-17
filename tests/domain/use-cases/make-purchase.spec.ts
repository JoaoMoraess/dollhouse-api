import { mock, MockProxy } from 'jest-mock-extended'
import { ChargePurchase } from '@/domain/contracts/gateways'
import { LoadProductsByIds } from '@/domain/contracts/repos'

interface SaveOrder {
  save: (input: any) => Promise<void>
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
  chargePurchase: ChargePurchase,
  ordersRepo: SaveOrder
) => MakePurchase

const setupMakePurchase: SetupMakePurchase = (productsRepo, chargePurchase, ordersRepo) => async input => {
  const products = await productsRepo.loadByIds(input.productsIds)
  const total = products.reduce((acc, product) => product.price + acc, 0)
  const totalInCents = total * 100
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
  let chargePurchase: MockProxy<ChargePurchase>
  let ordersRepo: MockProxy<SaveOrder>
  let input: Input

  beforeAll(() => {
    input = {
      productsIds: ['any_id', 'other_id'],
      cep: '1243-2333',
      cardNumber: '4111111111111111',
      cardExpirationMoth: '12',
      cardExpirationYear: '2030',
      cardSecurityCode: '123',
      cardHolderName: 'Joao Moraess'
    }
    chargePurchase = mock()
    chargePurchase.charge.mockResolvedValue({
      paymentResponse: {
        code: 'any_code',
        message: 'SUCESSO',
        reference: 1234
      },
      id: 'any_id'
    })
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
  })
  beforeEach(() => {
    sut = setupMakePurchase(productsRepo, chargePurchase, ordersRepo)
  })

  it('should call productsRepo.loadByIds with correct input', async () => {
    await sut(input)

    expect(productsRepo.loadByIds).toHaveBeenCalledWith(input.productsIds)
    expect(productsRepo.loadByIds).toHaveBeenCalledTimes(1)
  })
  it('should call chargePurchase.charge with corect input', async () => {
    await sut(input)

    expect(chargePurchase.charge).toHaveBeenCalledWith({
      ammoutInCents: (129.70 + 129.70) * 100,
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
