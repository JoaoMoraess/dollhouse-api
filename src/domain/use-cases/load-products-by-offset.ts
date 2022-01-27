import { Product } from '@/domain/entities'
import { LoadProductsByOffset, CountTotalProducts } from '@/domain/contracts/repos'

type Setup = (productsRepo: LoadProductsByOffset & CountTotalProducts) => LoadProducts
type Input = { limit: number, offset: number, orderBy: string, sortBy: string }
type Output = { products: Product[], totalProductsCount: number }

export type LoadProducts = ({ limit, offset, orderBy, sortBy }: Input) => Promise<Output>

export const setupLoadProducts: Setup = (productsRepo) => async ({ limit, offset, orderBy, sortBy }) => {
  const products = await productsRepo.load({ limit, offset, orderBy, sortBy })
  const totalProductsCount = await productsRepo.countTotal()
  return { products, totalProductsCount }
}
