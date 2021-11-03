import { LoadProductsByIds, LoadProductsByOffset } from '@/domain/contracts/repos'
import { Product } from '@/domain/entities'
import { Repository } from '@/infra/repos/postgres/repository'

export class PgProductRepository extends Repository implements LoadProductsByIds, LoadProductsByOffset {
  async loadByIds (ids: string[]): Promise<Product[]> {
    return []
  }

  async loadByOffset ({ limit, offset }: {limit: number, offset: number}): Promise<Product[]> {
    return []
  }
}
