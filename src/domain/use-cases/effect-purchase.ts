import { ChargePurchase, DeliVeryCalculator } from '@/domain/contracts/gateways'
import { SaveOrder } from '@/domain/contracts/repos'
import { LocalProducts } from '@/domain/entities'
import { LoadPurchaseInfo } from '.'

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

export type EffectPurchase = (input: Input) => Promise<void>

type SetupEffectPurchase = (
  loadPurchaseInfo: LoadPurchaseInfo,
  ordersRepo: SaveOrder,
  deliveryCalculator: DeliVeryCalculator,
  chargePurchase: ChargePurchase
) => EffectPurchase

export const setupEffectPurchase: SetupEffectPurchase = (
  loadPurchaseInfo,
  ordersRepo,
  deliveryCalculator,
  chargePurchase
) => async input => {
  const { products, subTotal } = await loadPurchaseInfo({ localProducts: input.localProducts })
  console.log(products[0].stock)// TODO remover log e adionar productsRepo.updateProductsStock

  const orderProducts: Array<{productId: string, quantity: number}> = Object
    .keys(input.localProducts)
    .map((key) => ({ productId: key, quantity: input.localProducts[key] }))

  const deliveryCost = await deliveryCalculator.calc({ cepWithoutIffen: input.cep, declaredValue: 0 })

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
