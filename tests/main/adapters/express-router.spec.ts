import { Controller } from '@/application/controllers'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { adaptExpressRoute } from '@/main/adapters'

describe('ExpressRouteAdapter', () => {
  let sut: RequestHandler
  let controllerStub: MockProxy<Controller>
  let next: NextFunction
  let req: Request
  let res: Response

  beforeAll(() => {
    req = getMockReq({ body: { anyBody: 'any_data' } })
    res = getMockRes().res
    next = getMockRes().next
    controllerStub = mock()
    controllerStub.buildValidators.mockReturnValue([])
    controllerStub.handle.mockResolvedValue({
      statusCode: 200,
      data: { anyData: 'any_data' }
    })
  })

  beforeEach(() => {
    sut = adaptExpressRoute(controllerStub)
  })

  it('should call handle with correct request', async () => {
    await sut(req, res, next)

    expect(controllerStub.handle).toHaveBeenCalledWith({ anyBody: 'any_data' })
    expect(controllerStub.handle).toHaveBeenCalledTimes(1)
  })
  it('should call handle with empty request', async () => {
    const req = getMockReq()
    await sut(req, res, next)

    expect(controllerStub.handle).toHaveBeenCalledWith({})
    expect(controllerStub.handle).toHaveBeenCalledTimes(1)
  })
})
