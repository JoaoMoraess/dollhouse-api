import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'

class MakePurchaseController extends Controller {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor () {
    super()
  }

  override async perform (httpRequest: any): Promise<HttpResponse<any>> {
    return {
      statusCode: 200,
      data: ''
    }
  }
}

describe('MakePurchaseController', () => {
  let sut: MakePurchaseController
  beforeEach(() => {
    sut = new MakePurchaseController()
  })
  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
})
