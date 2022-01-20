export class RequiredFieldError extends Error {
  constructor (field?: string) {
    const message = field === undefined
      ? 'Campo invalido!'
      : `O campo ${field} esta invalido!`
    super(message)
    this.name = 'RequiredFieldError'
  }
}

export class InvalidFieldError extends Error {
  constructor (field?: string) {
    const message = field === undefined
      ? 'Campo invalido!'
      : `O campo ${field} esta invalido!`
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

export class InvalidMimeTypeError extends Error {
  constructor (allowed: string[]) {
    super(`Arquivo nao suportado. tipo suportado: ${allowed.join(', ')}`)
    this.name = 'InvalidMimeTypeError'
  }
}
