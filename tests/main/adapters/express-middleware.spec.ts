import { HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'

interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}

type Setup = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Setup = middleware => async (req, res, next) => {
  const { data, statusCode } = await middleware.handle({ ...req.headers })
}

describe('AdaptExpressMiddleware', () => {
  let sut: RequestHandler
  let middleware: MockProxy<Middleware>
  let next: NextFunction
  let req: Request
  let res: Response

  beforeAll(() => {
    req = getMockReq({ headers: { token: 'any_token' } })
    res = getMockRes().res
    next = getMockRes().next

    middleware = mock<Middleware>()
    middleware.handle.mockResolvedValue({ statusCode: 200, data: null })
  })

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware)
  })

  it('should call middleware.handle with correct input', async () => {
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ token: 'any_token' })
  })
})
