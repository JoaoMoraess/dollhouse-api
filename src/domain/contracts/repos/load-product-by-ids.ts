import { Product } from '@/domain/entities'

export interface LoadProductsByIds {
  load: (ids: string[]) => Promise<Product[]>
}
