import { UUIDGenerator } from '@/domain/contracts/gateways'
import { CountTotalProducts, LoadProductsByIds, LoadProductsByOffset, SaveProduct } from '@/domain/contracts/repos'
import { Product } from '@/domain/entities'
import { Repository } from '@/infra/repos/postgres/repository'

export class PgProductRepository extends Repository implements LoadProductsByIds, LoadProductsByOffset, CountTotalProducts, SaveProduct {
  private readonly productRepository = this.getRepository<Product>('Product')

  constructor (private readonly uuidGenerator: UUIDGenerator) { super() }

  async save (product: { name: string, price: number, description?: string, stock: number, imageUrl: string }): Promise<void> {
    const newProduct = this.productRepository.create({
      id: this.uuidGenerator.generate(),
      ...product
    })
    await this.productRepository.persistAndFlush(newProduct)
  }

  async loadByIds (ids: string[]): Promise<Product[]> {
    const products = await this.productRepository.find({
      id: {
        $in: ids
      }
    })
    return products
  }

  async load ({ limit, offset, orderBy, sortBy }: { limit: number, offset: number, orderBy: string, sortBy: string }): Promise<Product[]> {
    const products = await this.productRepository.find({}, {
      orderBy: { [sortBy]: orderBy as any },
      limit,
      offset
    })
    return products
  }

  async countTotal (): Promise<number> {
    const count = await this.productRepository.count()
    return count
  }
}
