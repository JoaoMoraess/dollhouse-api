export interface Encrypter {
  encrypt: (input: {plainText: string}) => Promise<string>
}
