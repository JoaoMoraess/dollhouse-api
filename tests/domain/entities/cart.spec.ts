import { CartManager, LocalProducts, Product } from '@/domain/entities'
import { InvalidCartError } from '@/domain/entities/errors'

describe('CartManager', () => {
  let localProducts: LocalProducts
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

  it('should filter products correctly', () => {
    const sut = new CartManager(localProducts, dbProducts)

    expect(sut.products).toEqual([{
      id: 'any_id',
      imageUrl: 'any_image_url',
      name: 'any_name',
      price: 12585,
      quantity: 1,
      stock: 1
    },
    {
      id: 'other_id',
      imageUrl: 'other_image_url',
      name: 'other_name',
      price: 12590,
      quantity: 2,
      stock: 3
    }])
  })
  it('should calc subTotal correctly', () => {
    const sut = new CartManager(localProducts, dbProducts)

    expect(sut.subTotal).toBe(37765)
  })
  it('should not return a error if localProducts ids match with dbProducts', () => {
    localProducts = {
      any_id: 1,
      other_id: 99
    }
    const sut = new CartManager(localProducts, dbProducts)
    const error = sut.validate()
    expect(error).toBeUndefined()
  })
  it('should return a error localProduct id is invalid', () => {
    dbProducts = [{
      id: 'any_id',
      imageUrl: 'any_image_url',
      name: 'any_name',
      price: 12585,
      stock: 1
    }]
    const sut = new CartManager(localProducts, dbProducts)
    const error = sut.validate()
    expect(error).toEqual(new InvalidCartError())
  })
})
