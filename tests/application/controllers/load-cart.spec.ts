import { Controller, LoadCartInfoController } from '@/application/controllers'
import { Required } from '@/application/validation'
import { LocalProducts } from '@/domain/entities'
import { LoadCartInfo } from '@/domain/use-cases'

describe('LoadCartInfoController', () => {
  let sut: LoadCartInfoController
  let loadCartInfo: LoadCartInfo
  let localProducts: LocalProducts

  beforeAll(() => {
    localProducts = {
      any_id: 1
    }
    loadCartInfo = jest.fn().mockResolvedValue({
      products: [{
        id: 'any_id',
        name: 'any_name',
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
          name: 'any_name',
          imageUrl: 'any_image_url',
          price: 1299,
          quantity: 1
        }]
      }
    })
  })
})
