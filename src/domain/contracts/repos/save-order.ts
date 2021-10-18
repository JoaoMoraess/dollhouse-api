
export interface SaveOrder {
  save: (input: SaveOrder.Input) => Promise<void>
}

export namespace SaveOrder {
  export type Input = {
    pagSeguroId: string
    total: number
    subTotal: number
    deliveryCost: number
    products: Array<{
      productId: string
      quantity: number
    }>
    cep: string
  }
}
