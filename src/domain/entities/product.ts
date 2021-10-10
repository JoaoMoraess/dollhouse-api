import { LocalCartProducts } from '.'
import { NoLongerInStock } from './errors'

export type Product = {
  id: string
  name: string
  stock: number
  price: number
  imageUrl: string
}

type OutOfStockProducts = { name: string, inStock: number }

export class ProductStockManager {
  outOfStockProducts?: OutOfStockProducts

  constructor (
    localProducts: LocalCartProducts,
    dbProducts: Product[]
  ) {
    this.outOfStockProducts = dbProducts
      .filter((product) => product.stock - localProducts[product.id] < 0)
      .map(item => ({ name: item.name, inStock: item.stock }))[0]
  }

  validate (): Error | undefined {
    if (this.outOfStockProducts !== undefined) return new NoLongerInStock(this.outOfStockProducts.name, this.outOfStockProducts.inStock)
  }
}
