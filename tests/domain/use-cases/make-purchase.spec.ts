import { mock, MockProxy } from 'jest-mock-extended'
import { ChargePurchase } from '@/domain/contracts/gateways'
import { LoadProductsByIds } from '../contracts/repos'

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

type SetupMakePurchase = (productsRepo: LoadProductsByIds, chargePurchase: ChargePurchase) => MakePurchase

const setupMakePurchase: SetupMakePurchase = (productsRepo, chargePurchase) => async input => {
  await productsRepo.loadByIds(input.productsIds)
}

describe('MakePurchase', () => {
  let sut: MakePurchase
  let productsRepo: MockProxy<LoadProductsByIds>
  let chargePurchase: MockProxy<ChargePurchase>
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
        message: 'SUCESS',
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
  })
  beforeEach(() => {
    sut = setupMakePurchase(productsRepo, chargePurchase)
  })

  it('should call productsRepo.loadByIds with correct input', async () => {
    await sut(input)

    expect(productsRepo.loadByIds).toHaveBeenCalledWith(input.productsIds)
    expect(productsRepo.loadByIds).toHaveBeenCalledTimes(1)
  })
})
