import axios from 'axios'

jest.mock('axios')

interface HttpGetClient {
  get: <T = any>(input: HttpGetClient.Input) => Promise<T>
}
namespace HttpGetClient {
  export type Input = {
    url: string
    params: object
  }
}

class AxiosHttpClient implements HttpGetClient {
  async get <T = any>({ params, url }: HttpGetClient.Input): Promise<T> {
    return await axios.get(url, params)
  }
}

describe('AxiosHttpClient', () => {
  let fakeAxios: jest.Mocked<typeof axios>
  let url: string
  let params: object
  let sut: AxiosHttpClient

  beforeAll(() => {
    url = 'any_url'
    params = {
      any_param: 'any'
    }
    fakeAxios = axios as jest.Mocked<typeof axios>
    fakeAxios.get.mockResolvedValue({
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
})
