import { HttpResponse, ok } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { ValidationBuilder, Validator, Required } from '@/application/validation'

type Quantity = number
type LocalProducts = {
  [id: string]: Quantity
}

type HttpRequest = { localProducts: LocalProducts }

class LoadCartInfoController extends Controller {
  constructor (private readonly loadCartInfo: any) {
    super()
  }

  override async perform ({ localProducts }: HttpRequest): Promise<HttpResponse> {
    const { products, subTotal } = await this.loadCartInfo({ localProducts })
    return ok({ products, subTotal })
  }

  override buildValidators ({ localProducts }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder
        .of({ fieldValue: localProducts, fieldName: 'localProducts' })
        .required()
        .build()
    ]
  }
}

describe('LoadCartInfoController', () => {
  let sut: LoadCartInfoController
  let loadCartInfo: jest.Mock
  let localProducts: LocalProducts

  beforeAll(() => {
    localProducts = {
      any_id: 1
    }
    loadCartInfo = jest.fn().mockResolvedValue({
      products: [{
        id: 'any_id',
        imageUrl: 'any_image_url',
        price: 1299,
        quantity: 1
      }]
    })
  })
  beforeEach(() => {
    sut = new LoadCartInfoController(loadCartInfo)
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
  it('should build validatos correctly on save', async () => {
    const validators = sut.buildValidators({ localProducts })

    expect(validators).toEqual([
      new Required(localProducts, 'localProducts')
    ])
  })

  it('should call loadCartInfo with correct input', async () => {
    await sut.handle({ localProducts })

    expect(loadCartInfo).toHaveBeenCalledWith({ localProducts })
    expect(loadCartInfo).toHaveBeenCalledTimes(1)
  })
  it('should return 200 with valida data', async () => {
    const httpResponse = await sut.handle({ localProducts })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        products: [{
          id: 'any_id',
          imageUrl: 'any_image_url',
          price: 1299,
          quantity: 1
        }]
      }
    })
  })
})
