import axios from 'axios'
import { AxiosHttpClient } from '@/infra/gateways'

jest.mock('axios')

describe('AxiosHttpClient', () => {
  let fakeAxios: jest.Mocked<typeof axios>
  let url: string
  let params: object
  let data: object
  let sut: AxiosHttpClient

  beforeAll(() => {
    url = 'any_url'
    params = {
      any_param: 'any'
    }
    data = {
      any_param: 'any'
    }
    fakeAxios = axios as jest.Mocked<typeof axios>
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data'
    })
    fakeAxios.post.mockResolvedValue({
      status: 200,
      data: 'any_data'
    })
  })

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  it('should call axios.get with correct input', async () => {
    await sut.get({ params, url })

    expect(fakeAxios.get).toHaveBeenCalledWith(url, params)
  })

  it('should call axios.post with correct input', async () => {
    await sut.post({ data, url })

    expect(fakeAxios.post).toHaveBeenCalledWith(url, data)
  })

  it('should return data on success', async () => {
    const result = await sut.get({ params, url })

    expect(result).toEqual('any_data')
  })
  it('should rethrow if axios throws', async () => {
    fakeAxios.get.mockRejectedValueOnce(new Error('http_error'))
    const promise = sut.get({ params, url })

    await expect(promise).rejects.toThrow(new Error('http_error'))
  })
})
