import { Product } from '.'
import { InvalidCartError } from './errors'

export type ProductCartItem = { quantity: number } & Product

export type CartInfo = {
  products: ProductCartItem[]
  subTotal: number
}

type Quantity = number
export type LocalCartProducts = {
  [id: string]: Quantity
}

export class CartManager {
  products: ProductCartItem[]
  subTotal: number

  constructor (
    private readonly localProducts: LocalCartProducts,
    private readonly dbProducts: Product[]
  ) {
    this.products = dbProducts.map(product => ({
      ...product,
      quantity: localProducts[product.id]
    }))
    this.subTotal = this.products.reduce((acc, product) => acc + Number(product.price) * product.quantity, 0)
  }

  validate (): Error | undefined {
    const ids = Object.keys(this.localProducts)
    if (this.dbProducts.length < ids.length) return new InvalidCartError()
  }
}
