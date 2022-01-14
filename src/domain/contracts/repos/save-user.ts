export interface SaveUser {
  save: (input: {name: string, email: string, password: string}) => Promise<{id: string}>
}
