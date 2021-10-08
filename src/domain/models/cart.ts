export type ProductCartItem = {
  id: string
  name: string
  imageUrl: string
  price: number
  quantity: number
}

export type CartInfo = {
  products: ProductCartItem[]
  subTotal: number
}

type Quantity = number
export type LocalCartProducts = {
  [id: string]: Quantity
}
