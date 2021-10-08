import { LoadProductsByIds } from '@/domain/contracts/repos/load-product-by-ids'
import { InvalidCartError, NoLongerInStock } from '@/domain/errors'
import { LocalCartProducts, ProductCartItem } from '@/domain/models'

type Setup = (productsRepo: LoadProductsByIds) => LoadCartInfo
type Input = { localProducts: LocalCartProducts }
export type LoadCartInfo = ({ localProducts }: Input) => Promise<{products: ProductCartItem[], subTotal: number}>

export const setupLoadCartInfo: Setup = (productsRepo) => async ({ localProducts }) => {
  const ids = Object.keys(localProducts)
  const dbProducts = await productsRepo.load(ids)
  if (dbProducts.length < ids.length) throw new InvalidCartError()

  const products = dbProducts.map((product, key) => ({
    ...product,
    quantity: localProducts[product.id]
  }))

  const stockManager = (): {name: string, stock: number} | undefined => {
    return dbProducts
      .filter((product) => product.stock - localProducts[product.id] < 0)
      .map(item => ({ name: item.name, stock: item.stock }))[0]
  }
  const outOfStockProducts = stockManager()
  if (outOfStockProducts !== undefined) throw new NoLongerInStock(outOfStockProducts.name, outOfStockProducts.stock)

  const subTotal = products.reduce((acc, product) => acc + product.price * product.quantity, 0)

  return { products, subTotal }
}
