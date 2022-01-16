import { Middleware } from '@/application/contracts'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'
import { adaptExpressMiddleware } from '@/main/adapters'

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
    middleware.handle.mockResolvedValue({
      statusCode: 200,
      data: { anyData: 'any_data' }
    })
  })

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware)
  })

  it('should call middleware.handle with correct input', async () => {
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ token: 'any_token' })
  })
  it('should return an error if middleware.handle returns 200', async () => {
    middleware.handle.mockResolvedValueOnce({ data: { message: 'any_error' }, statusCode: 301 })
    await sut(req, res, next)

    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(301)
    expect(res.status).toHaveBeenCalledTimes(1)
  })
  it('should return an error if middleware.handle returns 200', async () => {
    middleware.handle.mockResolvedValueOnce({ data: new Error('any_error'), statusCode: 301 })
    await sut(req, res, next)

    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(301)
    expect(res.status).toHaveBeenCalledTimes(1)
  })

  it('should add valid data to req.locals', async () => {
    await sut(req, res, next)

    expect(req.locals).toEqual({ anyData: 'any_data' })
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should not add invalid data to req.locals', async () => {
    middleware.handle.mockResolvedValueOnce({ data: { invalidProp: null, anyData: 'any_data' }, statusCode: 200 })
    await sut(req, res, next)

    expect(req.locals).toEqual({ anyData: 'any_data' })
    expect(next).toHaveBeenCalledTimes(1)
  })
})
