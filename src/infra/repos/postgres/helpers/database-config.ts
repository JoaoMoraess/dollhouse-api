import { Options } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'

const options: Options = {
  clientUrl: process.env.DATABASE_URL,
  type: 'postgresql',
  entities: ['dist/infra/repos/postgres/entities/**/*.js'],
  entitiesTs: ['src/infra/repos/postgres/entities/**/*.ts'],
  metadataProvider: TsMorphMetadataProvider
}
export default options
