import axios from 'axios'
import { HttpGetClient } from '.'

export class AxiosHttpClient implements HttpGetClient {
  async get <T = any>({ params, url }: HttpGetClient.Input): Promise<T> {
    const { data } = await axios.get(url, params)
    return data as any
  }
}
