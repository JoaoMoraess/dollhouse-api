export class InvalidCartError extends Error {
  constructor () {
    super('Carrinho invalido!')
    this.name = 'InvalidCartError'
  }
}
