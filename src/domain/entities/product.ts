
export type Product = {
  id: string
  name: string
  stock: number
  price: number
  imageUrl: string
}

type Quantity = number

export type LocalProducts = {
  [id: string]: Quantity
}

type OutOfStockProducts = { name: string, inStock: number }

export class ProductStockManager {
  outOfStockProducts?: OutOfStockProducts

  constructor (
    localProducts: LocalProducts,
    dbProducts: Product[]
  ) {
    this.outOfStockProducts = dbProducts
      .filter((product) => product.stock - localProducts[product.id] < 0)
      .map(item => ({ name: item.name, inStock: item.stock }))[0]
  }

  validate (): Error | undefined {
    if (this.outOfStockProducts !== undefined) return new Error()
  }
}
