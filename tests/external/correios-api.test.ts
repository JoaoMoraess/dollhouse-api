import { DeliVeryCalculator, Service } from '@/domain/contracts/gateways'

import CorreiosFrete, { Frete } from 'frete'

class CorreiosApi implements DeliVeryCalculator {
  private readonly config: Frete
  private readonly defaultOptions: DeliVeryCalculator.DefaultOpt

  constructor (origincep: string, service: Service, ownHand: 'S' | 'N', acknowledgmentOfReceipt: 'S' | 'N') {
    this.config = CorreiosFrete()
      .cepOrigem(origincep)
      .maoPropria(ownHand)
      .avisoRecebimento(acknowledgmentOfReceipt)
      .servico(CorreiosFrete.servicos[service])
    this.defaultOptions = { format: 1, diameterIncm: 50, heightIncm: 3, lenghtIncm: 20, widthIncm: 30, wheightInKg: 0.4 }
  }

  async calc (input: DeliVeryCalculator.Input): Promise<DeliVeryCalculator.Output> {
    return new Promise<string>((resolve, reject) => {
      this.config
        .peso(input.wheightInKg ?? this.defaultOptions.wheightInKg)
        .formato(input.format ?? this.defaultOptions.format)
        .comprimento(input.lenghtIncm ?? this.defaultOptions.lenghtIncm)
        .altura(input.heightIncm ?? this.defaultOptions.heightIncm)
        .largura(input.widthIncm ?? this.defaultOptions.widthIncm)
        .diametro(input.diameterIncm ?? this.defaultOptions.diameterIncm)
        .valorDeclarado(input.declaredValue)
        .preco(input.cepWithoutIffen, (err: Error, result: Array<{valor: string}>) => {
          err !== null ? reject(err) : resolve(result[0].valor)
        })
    }).then(total => {
      const totalInCents = Number(total.replace(',', '.')) * 100
      return totalInCents
    }).catch(err => { throw err })
  }
}

describe('CorreiosApi', () => {
  let sut: CorreiosApi
  let input: DeliVeryCalculator.Input

  beforeEach(() => {
    input = {
      cepWithoutIffen: '90030140',
      declaredValue: 100
    }
  })
  beforeEach(() => {
    sut = new CorreiosApi('91740001', 'pac', 'N', 'N')
  })

  it('should return the correct data on success', async () => {
    const result = await sut.calc(input)
    expect(result).toEqual(2258)
  })

  it('should return error if cep is invalid', async () => {
    const errorMessaage = `CalcPreco:
Não foi encontrada precificação. ERP-005: CEP inexistente (00000000) --> UF DESTINO(-1).`

    input = { ...input, cepWithoutIffen: '00000000' }
    const promise = sut.calc(input)
    await expect(promise).rejects.toThrow(new Error(errorMessaage))
  })
})
