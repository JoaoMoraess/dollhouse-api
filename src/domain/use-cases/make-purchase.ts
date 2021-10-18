import { ChargePurchase } from '@/domain/contracts/gateways'
import { LoadProductsByIds } from '@/domain/contracts/repos'
import { CartManager, LocalProducts, ProductStockManager } from '@/domain/entities'

export interface SaveOrder {
  save: (input: any) => Promise<void>
}

export interface DeliVeryCalculator {
  calc: (input: any) => Promise<number>
}

export type Input = {
  brand: 'VISA' | 'MASTERCARD' | 'AMEX' | 'ELO' | 'HIPERCARD' | 'HIPER' | 'DINERS'
  localProducts: LocalProducts
  cep: string
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

  const subTotal = cartManager.subTotal
  const deliveryCost = await deliveryCalculator.calc({ cep: input.cep })

  const totalInCents = subTotal + deliveryCost

  const { id, paymentResponse } = await chargePurchase.charge({
    ammoutInCents: totalInCents,
    card: {
      brand: input.brand,
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
      products: input.localProducts,
      cep: input.cep
    })
  }
}
