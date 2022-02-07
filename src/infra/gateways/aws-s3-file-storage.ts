import { DeleteFile, UploadFile } from '@/domain/contracts/gateways'
import { config, S3 } from 'aws-sdk'

export class AWSS3FileStorage implements UploadFile, DeleteFile {
  constructor (accessKeyId: string, secretAccessKey: string, private readonly bucketName: string) {
    config.update({ credentials: { accessKeyId, secretAccessKey } })
  }

  async upload ({ file, fileName }: { file: Buffer, fileName: string }): Promise<string> {
    await new S3().putObject({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file,
      ACL: 'public-read'
    }).promise()
    return `https://${this.bucketName}.s3.amazonaws.com/${encodeURIComponent(fileName)}`
  }

  async delete ({ fileName }: { fileName: string }): Promise<void> {
    await new S3().deleteObject({
      Bucket: this.bucketName,
      Key: fileName
    }).promise()
  }
}
