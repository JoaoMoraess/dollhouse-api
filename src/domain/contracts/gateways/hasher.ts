export interface Hasher {
  hash: (input: { plainText: string }) => Promise<string>
}
