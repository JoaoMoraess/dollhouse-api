import { LoadUserByEmail } from '@/domain/contracts/repos'
import { User } from './entities/User'
import { Repository } from './repository'

export class PgUserRepository extends Repository implements LoadUserByEmail {
  private readonly userRepository = this.getRepository<User>('User')

  async loadByEmail ({ email }: { email: string }): Promise<{ id: string, name: string, password: string } | null> {
    const user = await this.userRepository.findOne({ email })
    if (user !== undefined && user !== null) {
      const { id, name, password } = user
      return { id, name, password }
    }
    return null
  }
}
