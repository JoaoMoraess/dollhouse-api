import { Product } from '.'

export type ProductCartItem = { quantity: number } & Product

export type CartInfo = {
  products: ProductCartItem[]
  subTotal: number
}
