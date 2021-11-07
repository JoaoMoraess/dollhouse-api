import { LoadProductsByIds, LoadProductsByOffset } from '@/domain/contracts/repos'
import { Product } from '@/domain/entities'
import { Repository } from '@/infra/repos/postgres/repository'

export class PgProductRepository extends Repository implements LoadProductsByIds, LoadProductsByOffset {
  private readonly productRepository = this.getRepository<Product>('Product')

  async loadByIds (ids: string[]): Promise<Product[]> {
    const products = await this.productRepository.find({
      id: {
        $in: ids
      }
    })
    return products
  }

  async loadByOffset ({ limit, offset }: {limit: number, offset: number}): Promise<Product[]> {
    const products = await this.productRepository.findAll({
      limit,
      offset
    })
    return products
  }
}
