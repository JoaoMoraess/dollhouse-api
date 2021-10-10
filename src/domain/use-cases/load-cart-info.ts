import { LoadProductsByIds } from '@/domain/contracts/repos'
import { CartManager, LocalCartProducts, ProductCartItem, ProductStockManager } from '@/domain/entities'

type Setup = (productsRepo: LoadProductsByIds) => LoadCartInfo
type Input = { localProducts: LocalCartProducts }
type Output = { products: ProductCartItem[], subTotal: number }

export type LoadCartInfo = ({ localProducts }: Input) => Promise<Output>

export const setupLoadCartInfo: Setup = (productsRepo) => async ({ localProducts }) => {
  const ids = Object.keys(localProducts)
  const dbProducts = await productsRepo.loadByIds(ids)

  const cartManager = new CartManager(localProducts, dbProducts)
  const productStockManager = new ProductStockManager(localProducts, dbProducts)

  const cartValid = cartManager.validate()
  if (cartValid !== undefined) throw cartValid

  const haveInStock = productStockManager.validate()
  if (haveInStock !== undefined) throw haveInStock

  return { products: cartManager.products, subTotal: cartManager.subTotal }
}
