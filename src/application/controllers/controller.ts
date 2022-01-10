import { badRequest, HttpResponse, serverError } from '@/application/helpers'
import { ValidationComposite, Validator } from '@/application/validation'
import { InvalidCartError, NoLongerInStock } from '@/domain/entities/errors'

export abstract class Controller {
  abstract perform (httpRequest: any): Promise<HttpResponse>

  buildValidators (httpRequest: any): Validator[] {
    return []
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest)
    if (error !== undefined) return badRequest(error)
    try {
      return await this.perform(httpRequest)
    } catch (error) {
      if (error instanceof NoLongerInStock || error instanceof InvalidCartError) {
        return badRequest(error)
      }
      return serverError(error)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
