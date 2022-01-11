import { InvalidCartError } from '@/application/errors'
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadProductsByIds } from '@/domain/contracts/repos'
import { LocalProducts } from '../entities'

type CheckProductsIsValid = (input: { localProducts: LocalProducts }) => Promise<Error | null>

type SetCheckProductsIsValid = (productsRepo: LoadProductsByIds) => CheckProductsIsValid

const setCheckProductIsValid: SetCheckProductsIsValid = (productsRepo) => async ({ localProducts }) => {
  const ids = Object.keys(localProducts)
  const products = await productsRepo.loadByIds(ids)

  if (products.length !== ids.length) return new InvalidCartError()

  return null
}

describe('CheckProductsIsValid', () => {
  let sut: CheckProductsIsValid
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
    sut = setCheckProductIsValid(productsRepo)
  })

  it('should call productsRepo.loadByIds with correct values', async () => {
    await sut({ localProducts })

    expect(productsRepo.loadByIds).toHaveBeenCalled()
    expect(productsRepo.loadByIds).toHaveBeenCalledWith(Object.keys(localProducts))
  })

  it('should return invalid cart if localProducts have invalid product id', async () => {
    const error = await sut({ localProducts: { invalid_id: 2 } })

    expect(error).toEqual(new InvalidCartError())
  })
})
