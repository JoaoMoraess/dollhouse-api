import { mock, MockProxy } from 'jest-mock-extended'
import { LoadProductsByIds } from '@/domain/contracts/repos'
import { LocalProducts } from '@/domain/entities'
import { LoadPurchaseInfo, setupLoadPurchaseInfo } from '@/domain/use-cases'

describe('LoadPurchaseInfo', () => {
  let sut: LoadPurchaseInfo
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
    sut = setupLoadPurchaseInfo(productsRepo)
  })

  it('should call loadProductsByIds with correct input', async () => {
    await sut({ localProducts })

    expect(productsRepo.loadByIds).toHaveBeenCalledWith(['any_id', 'other_id'])
    expect(productsRepo.loadByIds).toHaveBeenCalledTimes(1)
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
