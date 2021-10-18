import { LoadProductsByIds, LoadProductsByOffset } from '@/domain/contracts/repos'
import { Product } from '@/domain/entities'
import { Repository } from '@/infra/repos/postgres/repository'

export class PgProductRepository extends Repository implements LoadProductsByIds, LoadProductsByOffset {
  async loadByIds (ids: string[]): Promise<Product[]> {
    const products = await this
      .connect<Product[]>(() => this.prisma.product.findMany({ where: { id: { in: ids } } }))
    return products
  }

  async loadByOffset ({ limit, offset }: {limit: number, offset: number}): Promise<Product[]> {
    const products = await this
      .connect<Product[]>(() => this.prisma.product.findMany({ skip: offset, take: limit }))
    return products
  }
}
