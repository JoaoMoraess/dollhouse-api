import './config/module-alias'
import { env } from '@/main/config/env'

import { PgConnection } from '@/infra/repos/postgres/helpers/connection'
import { configOrm } from './config/orm'

void configOrm().then(async ({ orm, storage }) => {
  await PgConnection.getInstance(orm).connect()
  const { configApp } = await import('@/main/config/app')
  const app = configApp({ orm, storage })
  app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
})
