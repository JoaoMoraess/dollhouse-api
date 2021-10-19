import { CorreiosApi } from '@/infra/gateways'

export const makeCorreiosApi = (): CorreiosApi => {
  return new CorreiosApi('94750000', 'pac', 'N', 'N')
}
