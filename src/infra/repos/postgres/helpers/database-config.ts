import { Options } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'

const options: Options = {
  clientUrl: process.env.DATABASE_URL,
  type: 'postgresql',
  entities: ['dist/infra/repos/postgres/entities/**/*.js'],
  entitiesTs: ['src/infra/repos/postgres/entities/**/*.ts'],
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
    path: 'src/infra/repos/postgres/migrations', // path to the folder with migrations
    pattern: /^[\w-]+\d+\.ts$/, // regex pattern for the migration files
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    emit: 'ts' // migration generation mode
  }
}
export default options
