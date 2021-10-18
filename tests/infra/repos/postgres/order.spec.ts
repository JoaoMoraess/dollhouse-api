import { PrismaClient } from '.prisma/client'
import { SaveOrder } from '@/domain/contracts/repos'
import { Repository } from '@/infra/repos/postgres/repository'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

export class PgOrderRepository extends Repository implements SaveOrder {
  async save ({ cep, deliveryCost, pagSeguroId, products, subTotal, total }: SaveOrder.Input): Promise<void> {
    await this
      .connect(() => this.prisma.order.create({
        data: {
          confirmed: false,
          pagSeguroId,
          cep,
          sent: false,
          deliveryCost,
          subTotal,
          total,
          products: {
            createMany: {
              data: products
            }
          }
        }
      }))
  }
}

describe('PgOrderRepository', () => {
  let sut: PgOrderRepository
  let prismaMock: DeepMockProxy<PrismaClient>
  let input: SaveOrder.Input

  beforeAll(() => {
    prismaMock = mockDeep<PrismaClient>()
    prismaMock.$connect.mockResolvedValue()

    prismaMock.order.create.mockImplementation()
    input = {
      cep: 'any_cep',
      deliveryCost: 1988,
      pagSeguroId: 'any_pagseguroId',
      products: [{
        productId: 'any_product_id',
        quantity: 2
      },
      {
        productId: 'other_product_id',
        quantity: 1
      }],
      subTotal: 20090,
      total: 20390
    }
  })
  beforeEach(() => {
    sut = new PgOrderRepository()
    sut.prisma = prismaMock
  })

  it('should extends Repository', async () => {
    expect(sut).toBeInstanceOf(Repository)
  })

  it('should call order.create with correct input', async () => {
    await sut.save(input)

    expect(prismaMock.order.create).toHaveBeenCalledWith({
      data: {
        confirmed: false,
        pagSeguroId: input.pagSeguroId,
        cep: input.cep,
        sent: false,
        deliveryCost: input.deliveryCost,
        subTotal: input.subTotal,
        total: input.total,
        products: {
          createMany: {
            data: input.products
          }
        }
      }
    })
  })
})
