import { ChargePurchase } from '@/domain/contracts/gateways'
import { LoadProductsByIds, SaveOrder } from '@/domain/contracts/repos'
import { CartManager, LocalProducts, ProductStockManager } from '@/domain/entities'

export interface DeliVeryCalculator {
  calc: (input: any) => Promise<number>
}

export type Input = {
  localProducts: LocalProducts
  cep: string
  cardBrand: 'VISA' | 'MASTERCARD' | 'AMEX' | 'ELO' | 'HIPERCARD' | 'HIPER' | 'DINERS'
  cardNumber: string
  cardExpirationMoth: string
  cardExpirationYear: string
  cardSecurityCode: string
  cardHolderName: string
}

export type MakePurchase = (input: Input) => Promise<void>

type SetupMakePurchase = (
  productsRepo: LoadProductsByIds,
  ordersRepo: SaveOrder,
  deliveryCalculator: DeliVeryCalculator,
  chargePurchase: ChargePurchase
) => MakePurchase

export const setupMakePurchase: SetupMakePurchase = (
  productsRepo,
  ordersRepo,
  deliveryCalculator,
  chargePurchase
) => async input => {
  const productsIds = Object.keys(input.localProducts)
  const products = await productsRepo.loadByIds(productsIds)

  const cartManager = new CartManager(input.localProducts, products)
  const stockManager = new ProductStockManager(input.localProducts, products)

  const error = cartManager.validate() ?? stockManager.validate()
  if (error !== undefined) throw error

  const orderProducts: Array<{productId: string, quantity: number}> = Object
    .keys(input.localProducts)
    .map((key) => ({ productId: key, quantity: input.localProducts[key] }))

  const subTotal = cartManager.subTotal
  const deliveryCost = await deliveryCalculator.calc({ cep: input.cep })

  const totalInCents = subTotal + deliveryCost

  const { id, paymentResponse } = await chargePurchase.charge({
    ammoutInCents: totalInCents,
    card: {
      brand: input.cardBrand,
      expirationMoth: input.cardExpirationMoth,
      expirationYear: input.cardExpirationYear,
      holderName: input.cardHolderName,
      number: input.cardNumber,
      securityCode: input.cardSecurityCode
    }
  })
  if (paymentResponse.message === 'SUCESSO') {
    await ordersRepo.save({
      pagSeguroId: id,
      total: totalInCents,
      subTotal: subTotal,
      deliveryCost,
      products: orderProducts,
      cep: input.cep
    })
  }
}
