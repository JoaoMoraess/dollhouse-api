import { LocalProducts, Product } from '.'

export type ProductCartItem = { quantity: number } & Product

export type CartInfo = {
  products: ProductCartItem[]
  subTotal: number
}

export class CartManager {
  products: ProductCartItem[]
  subTotal: number

  constructor (
    private readonly localProducts: LocalProducts,
    private readonly dbProducts: Product[]
  ) {
    this.products = dbProducts.map(product => ({
      ...product,
      quantity: localProducts[product.id]
    }))
    this.subTotal = this.products.reduce((acc, product) => acc + product.price * product.quantity, 0)
  }

  validate (): Error | undefined {
    const ids = Object.keys(this.localProducts)
    if (this.dbProducts.length !== ids.length) return new Error()
  }
}
