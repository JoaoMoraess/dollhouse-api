import { LoadProductsByIds } from '@/domain/contracts/repos'
import { LocalProducts, ProductCartItem } from '@/domain/entities'

type Setup = (productsRepo: LoadProductsByIds) => LoadPurchaseInfo
type Input = { localProducts: LocalProducts }
type Output = { products: ProductCartItem[], subTotal: number }

export type LoadPurchaseInfo = ({ localProducts }: Input) => Promise<Output>

export const setupLoadPurchaseInfo: Setup = (productsRepo) => async ({ localProducts }) => {
  const ids = Object.keys(localProducts)
  const dbProducts = await productsRepo.loadByIds(ids)

  const products = dbProducts.map(product => ({
    ...product,
    quantity: localProducts[product.id]
  }))
  const subTotal = products.reduce((acc, product) => acc + product.price * product.quantity, 0)

  return { products, subTotal }
}
