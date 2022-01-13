export interface HashComparer {
  compare: (input: {plainText: string, digest: string}) => Promise<boolean>
}
