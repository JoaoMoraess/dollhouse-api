import { mock, MockProxy } from 'jest-mock-extended'
import { LoadProductsByIds } from '@/domain/contracts/repos'
import { LocalProducts } from '@/domain/entities'
import { ValidateProducts, setupValidateProducts } from '@/domain/use-cases'
import { InvalidCartError, NoLongerInStock } from '@/domain/errors'

describe('ValidateProducts', () => {
  let sut: ValidateProducts
  let productsRepo: MockProxy<LoadProductsByIds>
  let localProducts: LocalProducts

  beforeAll(() => {
    localProducts = {
      any_id: 2,
      other_id: 3
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
  })

  beforeEach(() => {
    sut = setupValidateProducts(productsRepo)
  })

  it('should call productsRepo.loadByIds with correct values', async () => {
    await sut({ localProducts })

    expect(productsRepo.loadByIds).toHaveBeenCalled()
    expect(productsRepo.loadByIds).toHaveBeenCalledWith(Object.keys(localProducts))
  })

  it('should return InvaliCartError if localProducts have invalid product id', async () => {
    const error = await sut({ localProducts: { invalid_id: 2 } })

    expect(error).toEqual(new InvalidCartError())
  })

  it('should return NoLongerInStockError if quantity of localProducts is bigger from products stock', async () => {
    const error = await sut({ localProducts: { ...localProducts, any_id: 4 } })

    expect(error).toEqual(new NoLongerInStock('any_name', 3))
  })
})
