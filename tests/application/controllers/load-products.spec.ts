import { Controller, LoadProductsController } from '@/application/controllers'
import { Required } from '@/application/validation'
import { LoadProducts } from '@/domain/use-cases'

describe('LoadProductsController', () => {
  let sut: LoadProductsController
  let loadProducts: LoadProducts
  let limit: string
  let offset: string
  let orderBy: string
  let sortBy: string

  beforeAll(() => {
    limit = '10'
    offset = '0'
    orderBy = 'ASC'
    sortBy = 'id'
    loadProducts = jest.fn().mockResolvedValue({
      products: [{
        id: 'any_id',
        name: 'any_name',
        stock: 2,
        imageUrl: 'any_image_url',
        price: 1299
      },
      {
        id: 'other_id',
        name: 'other_name',
        stock: 3,
        imageUrl: 'other_image_url',
        price: 3299
      }]
    })
  })

  beforeEach(() => {
    sut = new LoadProductsController(loadProducts)
  })
  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validatos correctly on save', async () => {
    const validators = sut.buildValidators({ limit, offset, orderBy, sortBy })

    expect(validators).toEqual([
      new Required(limit, 'limit'),
      new Required(offset, 'offset'),
      new Required(orderBy, 'orderBy'),
      new Required(sortBy, 'sortBy')
    ])
  })

  it('should call loadProducts with correct input', async () => {
    await sut.handle({ limit, offset, orderBy, sortBy })

    const numberLimit = Number(limit)
    const numberOffset = Number(offset)

    expect(loadProducts).toHaveBeenCalledWith({ limit: numberLimit, offset: numberOffset, orderBy, sortBy })
    expect(loadProducts).toHaveBeenCalledTimes(1)
  })
  it('should return 200 with valida data', async () => {
    const httpResponse = await sut.handle({ limit, offset, orderBy, sortBy })
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        products: [{
          id: 'any_id',
          name: 'any_name',
          stock: 2,
          imageUrl: 'any_image_url',
          price: 1299
        },
        {
          id: 'other_id',
          name: 'other_name',
          stock: 3,
          imageUrl: 'other_image_url',
          price: 3299
        }]
      }
    })
  })
})
