import { Middleware } from '@/application/contracts'
import { forbidden, HttpResponse, ok } from '@/application/helpers'
import { RequiredString } from '@/application/validation'
import { UserRole } from '@/domain/entities'

type HttpRequest = {authorization: string}
type Authorize = (input: {token: string}) => Promise<{ key: string, userRole: UserRole }>

export class AuthenticationMiddleware implements Middleware {
  constructor (
    private readonly authorize: Authorize,
    private readonly role: UserRole = 'customer'
  ) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Error | {userId: string}>> {
    if (!this.validate({ authorization })) return forbidden()
    try {
      const { key, userRole } = await this.authorize({ token: authorization })
      if (userRole !== 'admin') {
        if (userRole !== this.role) return forbidden()
      }

      return ok({ userId: key })
    } catch {
      return forbidden()
    }
  }

  private validate ({ authorization }: {authorization: string}): boolean {
    const error = new RequiredString(authorization).validate()
    return error === undefined
  }
}
