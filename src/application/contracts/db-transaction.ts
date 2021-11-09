export interface DbTransaction {
  openTransaction: () => Promise<void>
  commit: () => Promise<void>
  roolback: () => Promise<void>
}
