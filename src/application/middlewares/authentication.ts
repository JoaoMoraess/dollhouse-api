import { Middleware } from '@/application/contracts'
import { forbidden, HttpResponse, ok } from '@/application/helpers'
import { RequiredString } from '@/application/validation'

type HttpRequest = {authorization: string}
type Authorize = (input: {authorization: string}) => Promise<string>

export class AuthenticationMiddleware implements Middleware {
  constructor (private readonly authorize: Authorize) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Error | {userId: string}>> {
    if (!this.validate({ authorization })) return forbidden()
    try {
      const userId = await this.authorize({ authorization })

      return ok({ userId })
    } catch {
      return forbidden()
    }
  }

  private validate ({ authorization }: {authorization: string}): boolean {
    const error = new RequiredString(authorization).validate()
    return error === undefined
  }
}
