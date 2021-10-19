export interface DeliVeryCalculator {
  calc: (input: DeliVeryCalculator.Input) => Promise<DeliVeryCalculator.Output>
}

export type Service = 'sedex' | 'sedexCobrar' | 'pac' | 'pacCobrar' | 'sedex10' | 'sedex12' | 'sedexHoje'

enum Format {
  boxOrPackage = 1,
  rollOrPrism = 2,
  envelope = 3,
}

export namespace DeliVeryCalculator {
  export type Output = number
  export type Input = {
    cepWithoutIffen: string
    format?: Format
    declaredValue: number
    wheightInKg?: number
    lenghtIncm?: number
    heightIncm?: number
    widthIncm?: number
    diameterIncm?: number
  }

  export type DefaultOpt = {
    format: Format
    diameterIncm: number
    heightIncm: number
    lenghtIncm: number
    widthIncm: number
    wheightInKg: number
  }
}
