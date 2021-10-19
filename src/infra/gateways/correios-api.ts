import { DeliVeryCalculator } from '@/domain/contracts/gateways'
import CorreiosFrete, { Frete } from 'frete'

export class CorreiosApi implements DeliVeryCalculator {
  private readonly config: Frete
  private readonly defaultOptions: DeliVeryCalculator.DefaultOpt

  constructor (origincep: string, service: DeliVeryCalculator.Services, ownHand: 'S' | 'N', acknowledgmentOfReceipt: 'S' | 'N') {
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
