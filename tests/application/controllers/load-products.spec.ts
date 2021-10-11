import { Controller } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'
import { Required, ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = {
  limit: number
  offset: number
}

class LoadProductsController extends Controller {
  constructor (private readonly loadProducts: any) {
    super()
  }

  override async perform ({ limit, offset }: HttpRequest): Promise<HttpResponse> {
    const { products } = await this.loadProducts({ limit, offset })
    return ok({ products })
  }

  override buildValidators ({ limit, offset }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder
        .of({ fieldValue: limit, fieldName: 'limit' })
        .required()
        .build(),
      ...ValidationBuilder
        .of({ fieldValue: offset, fieldName: 'offset' })
        .required()
        .build()
    ]
  }
}

describe('LoadProductsController', () => {
  let sut: LoadProductsController
  let loadProducts: any
  let limit: number
  let offset: number

  beforeAll(() => {
    limit = 10
    offset = 0
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
    const validators = sut.buildValidators({ limit, offset })

    expect(validators).toEqual([
      new Required(limit, 'limit'),
      new Required(offset, 'offset')
    ])
  })

  it('should call loadProducts with correct input', async () => {
    await sut.handle({ limit, offset })

    expect(loadProducts).toHaveBeenCalledWith({ limit, offset })
    expect(loadProducts).toHaveBeenCalledTimes(1)
  })
  it('should return 200 with valida data', async () => {
    const httpResponse = await sut.handle({ limit, offset })
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
