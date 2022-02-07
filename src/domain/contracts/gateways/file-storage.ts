export interface UploadFile {
  upload: (input: { file: Buffer, fileName: string }) => Promise<string>
}

export interface DeleteFile {
  delete: (input: { fileName: string }) => Promise<void>
}
