export class RequiredFieldError extends Error {
  constructor (field?: string) {
    const message = field === undefined
      ? 'Field required'
      : `The field ${field} is required`
    super(message)
    this.name = 'RequiredFieldError'
  }
}

export class InvalidFieldError extends Error {
  constructor (field?: string) {
    const message = field === undefined
      ? 'Field invalid!'
      : `The field ${field} is invalid!`
    super(message)
    this.name = 'InvalidFieldError'
  }
}
export class MaxFileSizeError extends Error {
  constructor (maxSizeInMb: number) {
    const message = `Tamanho maximo de arquivo ${maxSizeInMb}Mb`
    super(message)
    this.name = 'MaxFileSizeError'
  }
}
