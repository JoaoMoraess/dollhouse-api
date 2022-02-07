import { UploadFile } from '@/domain/contracts/gateways'
import { config } from 'aws-sdk'

jest.mock('aws-sdk')

class AWSS3FileStorage implements UploadFile {
  constructor (accessKeyId: string, secretAccessKey: string, private readonly bucketName: string) {
    config.update({ credentials: { accessKeyId, secretAccessKey } })
  }

  async upload (input: { file: Buffer, fileName: string }): Promise<string> {
    return ''
  }
}

describe('AWSS3FileStorage', () => {
  let sut: AWSS3FileStorage
  let accessKeyId: string
  let secretAccessKey: string
  let bucketName: string

  beforeAll(() => {
    accessKeyId = 'any_access_key_id'
    secretAccessKey = 'any_secret_access_key'
    bucketName = 'any_bucket_name'
  })

  beforeEach(() => {
    sut = new AWSS3FileStorage(accessKeyId, secretAccessKey, bucketName)
  })

  it('should config aws credentials on creation', async () => {
    expect(sut).toBeDefined()

    expect(config.update).toHaveBeenCalledWith({ credentials: { accessKeyId, secretAccessKey } })
    expect(config.update).toHaveBeenCalledTimes(1)
  })
  describe('upload()', () => {

  })
})
