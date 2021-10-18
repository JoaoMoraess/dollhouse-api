import { LocalCartProducts, Product, ProductStockManager } from '@/domain/entities'
import { NoLongerInStock } from '@/domain/entities/errors'

describe('ProductStockManager', () => {
  let localProducts: LocalCartProducts
  let dbProducts: Product[]

  beforeEach(() => {
    localProducts = {
      any_id: 1,
      other_id: 2
    }
    dbProducts = [{
      id: 'any_id',
      imageUrl: 'any_image_url',
      name: 'any_name',
      price: 12585,
      stock: 1
    },
    {
      id: 'other_id',
      imageUrl: 'other_image_url',
      name: 'other_name',
      price: 12590,
      stock: 3
    }]
  })

  it('should get first out of stock product', () => {
    localProducts = { any_id: 2, other_id: 2 }
    const sut1 = new ProductStockManager(localProducts, dbProducts)

    expect(sut1.outOfStockProducts).toEqual({ name: 'any_name', inStock: 1 })

    localProducts = { any_id: 1, other_id: 4 }
    const sut2 = new ProductStockManager(localProducts, dbProducts)

    expect(sut2.outOfStockProducts).toEqual({ name: 'other_name', inStock: 3 })
  })
  it('should return NoLongerInStockError if quantity is bigger than stock', () => {
    localProducts = { any_id: 2, other_id: 2 }
    const sut = new ProductStockManager(localProducts, dbProducts)

    const error = sut.validate()
    expect(error).toEqual(new NoLongerInStock('any_name', 1))
  })
  it('should not return a error if quantity is smaller than stock', () => {
    localProducts = { any_id: 1, other_id: 2 }
    const sut = new ProductStockManager(localProducts, dbProducts)

    const error = sut.validate()
    expect(error).toBeUndefined()
  })
})
