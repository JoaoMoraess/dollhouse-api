import { Controller } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'
import { Required, ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = {
  limit: number
}

class LoadProductsController extends Controller {
  constructor (private readonly loadProducts: any) {
    super()
  }

  override async perform ({ limit }: HttpRequest): Promise<HttpResponse> {
    const { products } = await this.loadProducts({ limit })
    return ok({ products })
  }

  override buildValidators ({ limit }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder
        .of({ fieldValue: limit, fieldName: 'limit' })
        .required()
        .build()
    ]
  }
}

describe('LoadProductsController', () => {
  let sut: LoadProductsController
  let loadProducts: any
  let limit: number

  beforeAll(() => {
    limit = 10
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
    const validators = sut.buildValidators({ limit })

    expect(validators).toEqual([
      new Required(limit, 'limit')
    ])
  })
  it('should call loadProducts with correct input', async () => {
    await sut.handle({ limit })

    expect(loadProducts).toHaveBeenCalledWith({ limit })
    expect(loadProducts).toHaveBeenCalledTimes(1)
  })
  it('should return 200 with valida data', async () => {
    const httpResponse = await sut.handle({ limit })
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
