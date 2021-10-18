import { mock, MockProxy } from 'jest-mock-extended'
import { LoadProductsByIds } from '@/domain/contracts/repos'
import { InvalidCartError, NoLongerInStock } from '@/domain/entities/errors'
import { LocalProducts } from '@/domain/entities'
import { LoadCartInfo, setupLoadCartInfo } from '@/domain/use-cases'

describe('LoadCartInfo', () => {
  let sut: LoadCartInfo
  let productsRepo: MockProxy<LoadProductsByIds>
  let localProducts: LocalProducts

  beforeEach(() => {
    localProducts = {
      any_id: 1,
      other_id: 2
    }
    productsRepo = mock()
    productsRepo.loadByIds.mockResolvedValue([{
      id: 'any_id',
      imageUrl: 'any_image_url',
      name: 'any_name',
      stock: 2,
      price: 123
    },
    {
      id: 'other_id',
      imageUrl: 'any_image_url',
      name: 'other_name',
      stock: 2,
      price: 321
    }])
  })
  beforeEach(() => {
    sut = setupLoadCartInfo(productsRepo)
  })

  it('should call loadProductsByIds with correct input', async () => {
    await sut({ localProducts })

    expect(productsRepo.loadByIds).toHaveBeenCalledWith(['any_id', 'other_id'])
    expect(productsRepo.loadByIds).toHaveBeenCalledTimes(1)
  })

  it('should throw if cart is invalid', async () => {
    localProducts = {
      any_id: 1,
      other_id: 2,
      invalid_id: 99
    }
    const promise = sut({ localProducts })

    await expect(promise).rejects.toThrow(new InvalidCartError())
  })

  it('should return NoLongerInStock if stockManager return a object', async () => {
    localProducts = {
      any_id: 4,
      other_id: 2
    }
    const promise = sut({ localProducts })
    await expect(promise).rejects.toThrow(new NoLongerInStock('any_name', 2))
  })

  it('should return the first product that is out of stock', async () => {
    localProducts = {
      any_id: 4,
      other_id: 99
    }
    const promise = sut({ localProducts })
    await expect(promise).rejects.toThrow(new NoLongerInStock('any_name', 2))
  })
  it('should return the first error if find', async () => {
    localProducts = {
      any_id: 4,
      other_id: 99,
      invalid_id: 999
    }
    const promise = sut({ localProducts })
    await expect(promise).rejects.toThrow(new InvalidCartError())
  })

  it('should rethrow productsRepo throw', async () => {
    productsRepo.loadByIds.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut({ localProducts })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should return the correct data on success', async () => {
    const { products, subTotal } = await sut({ localProducts })

    expect(products).toEqual([{
      id: 'any_id',
      imageUrl: 'any_image_url',
      name: 'any_name',
      quantity: 1,
      stock: 2,
      price: 123
    },
    {
      id: 'other_id',
      imageUrl: 'any_image_url',
      name: 'other_name',
      quantity: 2,
      stock: 2,
      price: 321
    }])

    expect(subTotal).toEqual(765)
  })
})
