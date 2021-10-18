import { PrismaClient } from '.prisma/client'

export class Repository {
  prisma: PrismaClient

  constructor () {
    this.prisma = new PrismaClient()
  }

  protected async connect <T = any>(operation: Function): Promise<T> {
    return await this.prisma.$connect()
      .then(() => operation())
      .catch((error) => { throw error })
      .finally(await this.prisma.$disconnect())
  }
}
