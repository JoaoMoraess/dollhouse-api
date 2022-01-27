import { mock, MockProxy } from 'jest-mock-extended'
import { LoadProducts, setupLoadProducts } from '@/domain/use-cases'

describe('LoadProducts', () => {
  let sut: LoadProducts
  let productsRepo: MockProxy<any>
  let limit: number
  let offset: number
  let orderBy: string
  let sortBy: string

  beforeEach(() => {
    limit = 10
    offset = 0
    orderBy = 'ASC'
    sortBy = 'id'
    productsRepo = mock()
    productsRepo.countTotal.mockResolvedValue(100)
    productsRepo.load.mockResolvedValue(
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

  it('should call LoadProducts with correct input', async () => {
    await sut({ limit, offset, orderBy, sortBy })

    expect(productsRepo.load).toHaveBeenCalledWith({ limit, offset, orderBy, sortBy })
    expect(productsRepo.load).toHaveBeenCalledTimes(1)
  })
  it('should call CountTotalProducts', async () => {
    await sut({ limit, offset, orderBy, sortBy })

    expect(productsRepo.countTotal).toHaveBeenCalled()
    expect(productsRepo.countTotal).toHaveBeenCalledTimes(1)
  })
  it('should rethrow productsRepo.load throw', async () => {
    productsRepo.load.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut({ limit, offset, orderBy, sortBy })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })
  it('should rethrow productsRepo.countTotal throw', async () => {
    productsRepo.countTotal.mockRejectedValueOnce(new Error('count_error'))
    const promise = sut({ limit, offset, orderBy, sortBy })

    await expect(promise).rejects.toThrow(new Error('count_error'))
  })
  it('should return the correct data on success', async () => {
    const { products, totalProductsCount } = await sut({ limit, offset, orderBy, sortBy })

    expect(totalProductsCount).toBe(100)

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
