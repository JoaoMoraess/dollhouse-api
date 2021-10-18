import { LoadProductsByIds } from '@/domain/contracts/repos'
import { CartManager, LocalProducts, ProductCartItem, ProductStockManager } from '@/domain/entities'

type Setup = (productsRepo: LoadProductsByIds) => LoadCartInfo
type Input = { localProducts: LocalProducts }
type Output = { products: ProductCartItem[], subTotal: number }

export type LoadCartInfo = ({ localProducts }: Input) => Promise<Output>

export const setupLoadCartInfo: Setup = (productsRepo) => async ({ localProducts }) => {
  const ids = Object.keys(localProducts)
  const dbProducts = await productsRepo.loadByIds(ids)

  const cartManager = new CartManager(localProducts, dbProducts)
  const productStockManager = new ProductStockManager(localProducts, dbProducts)

  const error = cartManager.validate() ?? productStockManager.validate()
  if (error !== undefined) throw error

  return { products: cartManager.products, subTotal: cartManager.subTotal }
}
