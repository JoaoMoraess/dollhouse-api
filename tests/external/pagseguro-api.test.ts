import { AxiosHttpClient, HttpPostClient } from '@/infra/gateways'
import { env } from '@/main/config/env'

type Input = {
  ammout: number
  card: {
    holderName: string
    expirationMoth: string
    expirationYear: string
    securityCode: string
    number: string
    brand: 'VISA' | 'MASTERCARD' | 'AMEX' | 'ELO' | 'HIPERCARD' | 'HIPER' | 'DINERS'
  }

}

class PagSeguroApi {
  private readonly baseUrl = 'https://sandbox.api.pagseguro.com'

  constructor (
    private readonly bearerToken: string,
    private readonly httpClient: HttpPostClient
  ) {}

  async chargePurchase ({ ammout, card }: Input): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { payment_response } = await this.httpClient.post({
      data: {
        amount: {
          value: ammout,
          currency: 'BRL'
        },
        payment_method: {
          type: 'CREDIT_CARD',
          installments: 1,
          capture: false,
          card: {
            number: card.number,
            exp_month: card.expirationMoth,
            exp_year: card.expirationYear,
            security_code: card.securityCode,
            brand: card.brand,
            holder: {
              name: card.holderName
            }
          }
        }
      },
      url: `${this.baseUrl}/charges`,
      headers: {
        Authorization: this.bearerToken
      }
    })
    return payment_response
  }
}

describe('PagSeguroApi', () => {
  let bearerToken: string
  let axiosClient: AxiosHttpClient
  let input: Input
  let sut: PagSeguroApi

  beforeEach(() => {
    input = {
      ammout: 1000,
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
    const response = await sut.chargePurchase(input)

    expect(response.message).toBe('SUCESSO')
  })
})
