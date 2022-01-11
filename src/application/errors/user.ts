export class UserNotExistsError extends Error {
  constructor () {
    super('Usuario nao registrado.')
    this.name = 'UserNotExists'
  }
}
