import { Product } from '@/domain/entities'

type Input = { limit: number, offset: number, orderBy: string, sortBy: string }

export interface LoadProductsByOffset {
  load: (input: Input) => Promise<Product[]>
}
