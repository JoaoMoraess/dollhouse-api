import { mock, MockProxy } from 'jest-mock-extended'

class InvalidCartError extends Error {
  constructor () {
    super('Carrinho invalido!')
    this.name = 'InvalidCartError'
  }
}

class NoLongerInStock extends Error {
  constructor (productName: string, inStock: number) {
    const message = inStock === 0
      ? `O produto ${productName} nao esta mais em estoque!`
      : `O produto ${productName} nao esta mais em estoque! restam apenas ${inStock}`
    super(message)
    this.name = 'NoLongerInStock'
  }
}

interface LoadProductsByIds {
  load: (ids: string[]) => Promise<Product[]>
}

type ProductCartItem = {
  id: string
  name: string
  imageUrl: string
  price: number
  quantity: number
}

type Product = {
  id: string
  name: string
  imageUrl: string
  price: number
  stock: number
}

type Quantity = number
export type LocalProducts = {
  [id: string]: Quantity
}

type Setup = (productsRepo: LoadProductsByIds) => LoadCartInfo
type Input = { localProducts: LocalProducts }
type LoadCartInfo = ({ localProducts }: Input) => Promise<{products: ProductCartItem[], subTotal: number}>

const setupLoadCartInfo: Setup = (productsRepo) => async ({ localProducts }) => {
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

describe('LoadCartInfo', () => {
  let sut: LoadCartInfo
  let productsRepo: MockProxy<LoadProductsByIds>
  let localProducts: LocalProducts

  beforeEach(() => {
    localProducts = {
      any_id: 1,
      other_id: 2
    }
    productsRepo = mock()
    productsRepo.load.mockResolvedValue([{
      id: 'any_id',
      imageUrl: 'any_image_url',
      name: 'any_name',
      stock: 2,
      price: 123
    },
    {
      id: 'other_id',
      imageUrl: 'any_image_url',
      name: 'other_name',
      stock: 2,
      price: 321
    }])
  })
  beforeEach(() => {
    sut = setupLoadCartInfo(productsRepo)
  })

  it('should call loadProductsByIds with correct input', async () => {
    await sut({ localProducts })

    expect(productsRepo.load).toHaveBeenCalledWith(['any_id', 'other_id'])
    expect(productsRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should throw if cart is invalid', async () => {
    localProducts = {
      any_id: 1,
      other_id: 2,
      invalid_id: 99
    }
    const promise = sut({ localProducts })

    await expect(promise).rejects.toThrow(new InvalidCartError())
  })

  it('should return NoLongerInStock if stockManager return a object', async () => {
    localProducts = {
      any_id: 4
    }
    const promise = sut({ localProducts })
    await expect(promise).rejects.toThrow(new NoLongerInStock('any_name', 2))
  })

  it('should return the first product that is out of stock', async () => {
    localProducts = {
      any_id: 4,
      other_id: 99
    }
    const promise = sut({ localProducts })
    await expect(promise).rejects.toThrow(new NoLongerInStock('any_name', 2))
  })

  it('should rethrow productsRepo throw', async () => {
    productsRepo.load.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut({ localProducts })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should return the correct data on success', async () => {
    const { products, subTotal } = await sut({ localProducts })

    expect(products).toEqual([{
      id: 'any_id',
      imageUrl: 'any_image_url',
      name: 'any_name',
      quantity: 1,
      stock: 2,
      price: 123
    },
    {
      id: 'other_id',
      imageUrl: 'any_image_url',
      name: 'other_name',
      quantity: 2,
      stock: 2,
      price: 321
    }])

    expect(subTotal).toEqual(765)
  })
})
