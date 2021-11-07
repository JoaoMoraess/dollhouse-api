import './config/module-alias'
import { env } from '@/main/config/env'
import { MikroORM } from '@mikro-orm/core'
import options from '@/infra/repos/postgres/helpers/database-config'
import { PgConnection } from '@/infra/repos/postgres/helpers/connection'

void MikroORM.init(options).then(async orm => {
  await PgConnection.getInstance(orm).connect()
  const { app } = await import('@/main/config/app')
  app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
})
