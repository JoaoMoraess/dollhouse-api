import { PrismaClient } from '.prisma/client'
import { LoadProductsByIds, LoadProductsByOffset } from '@/domain/contracts/repos'
import { Product } from '@/domain/entities'

export class PgProductRepository implements LoadProductsByIds, LoadProductsByOffset {
  prisma: PrismaClient

  constructor () {
    this.prisma = new PrismaClient()
  }

  async connect <T = any>(operation: Function): Promise<T> {
    return await this.prisma.$connect()
      .then(() => operation())
      .catch((error) => { throw error })
      .finally(await this.prisma.$disconnect())
  }

  async loadByIds (ids: string[]): Promise<Product[]> {
    const products = await this.connect<Product[]>(() => {
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

  async loadByOffset ({ limit, offset }: {limit: number, offset: number}): Promise<Product[]> {
    const products = await this.connect<Product[]>(() => {
      return this.prisma.product.findMany({
        skip: offset,
        take: limit
      })
    })
    return products
  }
}
