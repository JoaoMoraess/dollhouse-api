export class NoLongerInStock extends Error {
  constructor (productName: string, inStock: number) {
    const message = inStock === 0
      ? `O produto ${productName} nao esta mais em estoque!`
      : `O produto ${productName} nao esta mais em estoque! restam apenas ${inStock}`
    super(message)
    this.name = 'NoLongerInStock'
  }
}
