import { ChargePurchase } from '@/domain/contracts/gateways'
import { AxiosHttpClient, PagSeguroApi } from '@/infra/gateways'
import { env } from '@/main/config/env'

jest.setTimeout(10000)

describe('PagSeguroApi', () => {
  let bearerToken: string
  let axiosClient: AxiosHttpClient
  let input: ChargePurchase.Input
  let sut: PagSeguroApi

  beforeEach(() => {
    input = {
      ammoutInCents: 1000,
      card: {
        number: '4111111111111111',
        expirationMoth: '12',
        expirationYear: '2030',
        securityCode: '123',
        holderName: 'Joao Moraess',
        brand: 'VISA'
      }
    }
    bearerToken = env.pagSeguro.token!
    axiosClient = new AxiosHttpClient()
    sut = new PagSeguroApi(bearerToken, axiosClient)
  })

  it('should charge with correct params', async () => {
    const { paymentResponse, id } = await sut.charge(input)
    expect(paymentResponse.message).toBe('SUCESSO')
    expect(id).toBeTruthy()
  })
})
