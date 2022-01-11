import { LoadProductsByIds } from '@/domain/contracts/repos'
import { LocalProducts, ProductCartItem } from '@/domain/entities'

type Setup = (productsRepo: LoadProductsByIds) => LoadCartInfo
type Input = { localProducts: LocalProducts }
type Output = { products: ProductCartItem[], subTotal: number }

export type LoadCartInfo = ({ localProducts }: Input) => Promise<Output>

export const setupLoadCartInfo: Setup = (productsRepo) => async ({ localProducts }) => {
  const ids = Object.keys(localProducts)
  const dbProducts = await productsRepo.loadByIds(ids)

  const products = dbProducts.map(product => ({
    ...product,
    quantity: localProducts[product.id]
  }))
  const subTotal = products.reduce((acc, product) => acc + product.price * product.quantity, 0)

  return { products, subTotal }
}
