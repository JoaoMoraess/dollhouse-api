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
