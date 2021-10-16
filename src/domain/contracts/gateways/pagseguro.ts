export interface ChargePurchase {
  charge: (input: ChargePurchase.Input) => Promise<ChargePurchase.Output>
}

export namespace ChargePurchase {
  export type Input = {
    ammoutInCents: number
    card: {
      holderName: string
      expirationMoth: string
      expirationYear: string
      securityCode: string
      number: string
      brand: 'VISA' | 'MASTERCARD' | 'AMEX' | 'ELO' | 'HIPERCARD' | 'HIPER' | 'DINERS'
    }
  }
  export type Output = {
    paymentResponse: { message: string, reference: number, code: string }
    id: string
  }
}
