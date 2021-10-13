import { Product } from '@/domain/entities'

type Input = {
  limit: number
  offset: number
}

export interface LoadProductsByOffset {
  loadByOffset: (input: Input) => Promise<Product[]>
}
