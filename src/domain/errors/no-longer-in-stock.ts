export class NoLongerInStock extends Error {
  constructor (productName: string, inStock: number) {
    const message = inStock === 0
      ? `O produto ${productName} nao esta mais em estoque!`
      : `Restam apenas ${inStock} ${productName} em estoque!`
    super(message)
    this.name = 'NoLongerInStock'
  }
}
