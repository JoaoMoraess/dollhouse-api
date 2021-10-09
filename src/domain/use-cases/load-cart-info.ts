import { LoadProductsByIds } from '@/domain/contracts/repos'
import { CartManager, LocalCartProducts, ProductCartItem, ProductStockManager } from '@/domain/entities'

type Setup = (productsRepo: LoadProductsByIds) => LoadCartInfo
type Input = { localProducts: LocalCartProducts }
type Output = { products: ProductCartItem[], subTotal: number }

export type LoadCartInfo = ({ localProducts }: Input) => Promise<Output>

export const setupLoadCartInfo: Setup = (productsRepo) => async ({ localProducts }) => {
  const ids = Object.keys(localProducts)
  const dbProducts = await productsRepo.load(ids)

  const cartManager = new CartManager(localProducts, dbProducts)
  const productStockManager = new ProductStockManager(localProducts, dbProducts)

  cartManager.validate()
  productStockManager.validate()

  return { products: cartManager.products, subTotal: cartManager.subTotal }
}
