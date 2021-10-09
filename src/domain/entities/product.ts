import { LocalCartProducts } from '.'
import { NoLongerInStock } from './errors'

export type Product = {
  id: string
  name: string
  imageUrl: string
  price: number
  stock: number
}

type OutOfStockProducts = { name: string, inStock: number }

export class ProductStockManager {
  outOfStockProducts?: OutOfStockProducts

  constructor (
    private readonly localProducts: LocalCartProducts,
    private readonly dbProducts: Product[]
  ) {
    this.outOfStockProducts = dbProducts
      .filter((product) => product.stock - localProducts[product.id] < 0)
      .map(item => ({ name: item.name, inStock: item.stock }))[0]
  }

  validate (): void {
    if (this.outOfStockProducts !== undefined) throw new NoLongerInStock(this.outOfStockProducts.name, this.outOfStockProducts.inStock)
  }
}
