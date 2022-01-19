import { Controller } from '@/application/controllers/controller'
import { HttpResponse } from '../helpers'
class AddProductController extends Controller {
  override async perform (httpRequest: any): Promise<HttpResponse<any>> {
    return {
      data: {},
      statusCode: 200
    }
  }
}

describe('AddProductsController', () => {
  let sut: AddProductController

  beforeEach(() => {
    sut = new AddProductController()
  })

  it('should extend controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
})
