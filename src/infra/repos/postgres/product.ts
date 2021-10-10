import { PrismaClient } from '.prisma/client'
import { LoadProductsByIds } from '@/domain/contracts/repos'
import { Product } from '@/domain/entities'

export class PgProductRepository implements LoadProductsByIds {
  constructor (private readonly prisma: PrismaClient) {}

  async connect <T = any>(operation: Function): Promise<T> {
    return await this.prisma.$connect()
      .then(() => operation())
      .catch((error) => { throw error })
      .finally(await this.prisma.$disconnect())
  }

  async loadByIds (ids: string[]): Promise<Product[]> {
    const products = this.connect<Product[]>(() => {
      return this.prisma.product.findMany({
        where: {
          id: {
            in: ids
          }
        }
      })
    })

    return products
  }
}
