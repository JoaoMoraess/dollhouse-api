export interface LoadUserByEmail {
  loadByEmail: (input: {email: string}) => Promise<{id: string, name: string, password: string} | null>
}
