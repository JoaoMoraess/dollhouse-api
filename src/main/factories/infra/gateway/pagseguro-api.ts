import { PagSeguroApi } from '@/infra/gateways'
import { env } from '@/main/config/env'
import { makeAxiosHttpClient } from '.'

export const makePagSeguroApi = (): PagSeguroApi => {
  return new PagSeguroApi(env.pagSeguro.token!, makeAxiosHttpClient())
}
