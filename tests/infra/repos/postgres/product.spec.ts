import { LoadProductsByIds } from '@/domain/contracts/repos'
import { Product } from '@/domain/entities'
import { PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

class PgProductRepository implements LoadProductsByIds {
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

describe('PgProductRepository', () => {
  describe('LoadByIds()', () => {
    let sut: PgProductRepository
    let prismaMock: DeepMockProxy<PrismaClient>

    beforeAll(() => {
      prismaMock = mockDeep<PrismaClient>()
      prismaMock.$connect.mockResolvedValue()

      prismaMock.product.findMany.mockResolvedValue([{
        id: 'any_id',
        imageUrl: 'any_image_url',
        name: 'any_name',
        price: 12.79,
        stock: 2
      }])
    })

    beforeEach(() => {
      sut = new PgProductRepository(prismaMock)
    })

    it('should return a product on success', async () => {
      const products = await sut.loadByIds(['any_id'])
      expect(products).toEqual([{
        id: 'any_id',
        imageUrl: 'any_image_url',
        name: 'any_name',
        price: 12.79,
        stock: 2
      }])
    })
  })
})
