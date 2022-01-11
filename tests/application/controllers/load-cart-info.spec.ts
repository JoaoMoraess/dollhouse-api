import { Controller, LoadCartInfoController } from '@/application/controllers'
import { Required } from '@/application/validation'
import { LocalProducts } from '@/domain/entities'
import { InvalidCartError, NoLongerInStock } from '@/application/errors'
import { badRequest } from '@/application/helpers'

describe('LoadCartInfoController', () => {
  let sut: LoadCartInfoController
  let localProducts: LocalProducts
  let loadCartInfo: jest.Mock
  let checkProductsIsValid: jest.Mock

  beforeAll(() => {
    localProducts = {
      any_id: 1
    }
    checkProductsIsValid = jest.fn().mockResolvedValue(null)

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
    sut = new LoadCartInfoController(checkProductsIsValid, loadCartInfo)
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

  it('should return 401 with InvalidCart if cart is invalid', async () => {
    checkProductsIsValid.mockResolvedValueOnce(new InvalidCartError())
    const httpResponse = await sut.handle({ localProducts })

    expect(httpResponse).toEqual(badRequest(new InvalidCartError()))
    expect(loadCartInfo).not.toHaveBeenCalled()
  })

  it('should return 401 NoLongerInStock if products is out of stock', async () => {
    checkProductsIsValid.mockResolvedValueOnce(new NoLongerInStock('any_name', 2))
    const httpResponse = await sut.handle({ localProducts })
    expect(httpResponse).toEqual(badRequest(new NoLongerInStock('any_name', 2)))
    expect(loadCartInfo).not.toHaveBeenCalled()
  })
})
