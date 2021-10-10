import { Product } from '@/domain/entities'

export interface LoadProductsByIds {
  loadByIds: (ids: string[]) => Promise<Product[]>
}
