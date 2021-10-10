import { PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { PgProductRepository } from '@/infra/repos/postgres'

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
