import { Product } from '@/domain/entities'
import { LoadProductsByOffset } from '@/domain/contracts/repos'

type Setup = (productsRepo: LoadProductsByOffset) => LoadProducts
type Input = { limit: number, offset: number }
type Output = { products: Product[] }

export type LoadProducts = ({ limit, offset }: Input) => Promise<Output>

export const setupLoadProducts: Setup = (productsRepo) => async ({ limit, offset }) => {
  const products = await productsRepo.loadByOffset({ limit, offset })

  return { products }
}
