import { Product } from '@/domain/models'

export interface LoadProductsByIds {
  load: (ids: string[]) => Promise<Product[]>
}
