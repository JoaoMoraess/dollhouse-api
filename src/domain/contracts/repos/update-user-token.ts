export interface UpdateUserToken {
  updateToken: (input: {id: string, token: string}) => Promise<void>
}
