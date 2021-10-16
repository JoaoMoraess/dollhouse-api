import axios from 'axios'
import { HttpGetClient, HttpPostClient } from '.'

export class AxiosHttpClient implements HttpGetClient, HttpPostClient {
  async get <T = any>(input: HttpGetClient.Input): Promise<T> {
    const { data } = await axios.get(input.url, input.params)
    return data as any
  }

  async post <T = any>(input: HttpPostClient.Input): Promise<T> {
    const { data } = await axios.post(input.url, input.data, {
      headers: input.headers
    })
    return data as any
  }
}
