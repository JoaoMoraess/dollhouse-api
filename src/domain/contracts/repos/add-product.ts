export interface AddProduct {
  add: (product: {name: string, price: number, description: string, imageUrl: string}) => Promise<void>
}
