import { ChargePurchase } from '@/domain/contracts/gateways'
import { HttpPostClient } from '.'

export class PagSeguroApi implements ChargePurchase {
  private readonly baseUrl = 'https://sandbox.api.pagseguro.com'

  constructor (
    private readonly bearerToken: string,
    private readonly httpClient: HttpPostClient
  ) {}

  async charge ({ ammoutInCents, card }: ChargePurchase.Input): Promise<ChargePurchase.Output> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { payment_response, id } = await this.httpClient.post({
      data: {
        amount: {
          value: ammoutInCents,
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
    return {
      paymentResponse: payment_response,
      id
    }
  }
}
