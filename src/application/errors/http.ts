export class ServerError extends Error {
  constructor (error?: Error) {
    const message = error?.message ?? 'Server failed. Try again soon'
    super(message)
    this.name = error?.message ?? 'ServerError'
    this.stack = error?.stack
  }
}

export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor () {
    super('Access denied')
    this.name = 'ForbiddenError'
  }
}
