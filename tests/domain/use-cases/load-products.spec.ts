import { mock, MockProxy } from 'jest-mock-extended'
import { LoadProducts, setupLoadProducts } from '@/domain/use-cases'

describe('LoadProducts', () => {
  let sut: LoadProducts
  let productsRepo: MockProxy<any>
  let limit: number
  let offset: number

  beforeEach(() => {
    limit = 10
    offset = 0
    productsRepo = mock()
    productsRepo.loadByOffset.mockResolvedValue(
      [{
        id: 'any_id',
        name: 'any_name',
        imageUrl: 'any_image_url',
        stock: 2,
        price: 123
      },
      {
        id: 'other_id',
        name: 'other_name',
        imageUrl: 'any_image_url',
        stock: 2,
        price: 321
      }]
    )
  })
  beforeEach(() => {
    sut = setupLoadProducts(productsRepo)
  })

  it('should call loadProductsByOffset with correct input', async () => {
    await sut({ limit, offset })

    expect(productsRepo.loadByOffset).toHaveBeenCalledWith({ limit, offset })
    expect(productsRepo.loadByOffset).toHaveBeenCalledTimes(1)
  })
  it('should rethrow productsRepo throw', async () => {
    productsRepo.loadByOffset.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut({ limit, offset })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })
  it('should return the correct data on success', async () => {
    const { products } = await sut({ limit, offset })

    expect(products).toEqual([{
      id: 'any_id',
      name: 'any_name',
      imageUrl: 'any_image_url',
      stock: 2,
      price: 123
    },
    {
      id: 'other_id',
      name: 'other_name',
      imageUrl: 'any_image_url',
      stock: 2,
      price: 321
    }])
  })
})
