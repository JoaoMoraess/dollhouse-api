import { DeleteFile, UploadFile } from '@/domain/contracts/gateways'
import { config, S3 } from 'aws-sdk'
import { mocked } from 'ts-jest/utils'

jest.mock('aws-sdk')

class AWSS3FileStorage implements UploadFile, DeleteFile {
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

describe('AWSS3FileStorage', () => {
  let sut: AWSS3FileStorage
  let accessKeyId: string
  let secretAccessKey: string
  let bucketName: string
  let fileName: string

  beforeAll(() => {
    accessKeyId = 'any_access_key_id'
    secretAccessKey = 'any_secret_access_key'
    bucketName = 'any_bucket_name'
    fileName = 'any_file_name'
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
    let file: Buffer
    let putObjectPromiseSpy: jest.Mock
    let putObjectSpy: jest.Mock

    beforeEach(() => {
      file = Buffer.from('any_file')
      putObjectPromiseSpy = jest.fn()
      putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ putObject: putObjectSpy })))
    })

    it('should call putObject with correct input', async () => {
      await sut.upload({ file, fileName })

      expect(putObjectSpy).toHaveBeenCalledTimes(1)
      expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
    })
    it('should return the correct imageUrl', async () => {
      const imageUrl = await sut.upload({ file, fileName })

      expect(imageUrl).toEqual(`https://${bucketName}.s3.amazonaws.com/${fileName}`)
    })

    it('should return encoded imageUrl', async () => {
      const imageUrl = await sut.upload({ file, fileName: 'any file name' })

      expect(imageUrl).toBe(`https://${bucketName}.s3.amazonaws.com/any%20file%20name`)
    })

    it('should rethrow if putObject throws', async () => {
      putObjectPromiseSpy.mockRejectedValueOnce(new Error('any_error'))
      const promise = sut.upload({ file, fileName })

      await expect(promise).rejects.toThrow('any_error')
    })
  })
  describe('delete()', () => {
    let deleteObjectPromiseSpy: jest.Mock
    let deleteObjectSpy: jest.Mock

    beforeAll(() => {
      deleteObjectPromiseSpy = jest.fn()
      deleteObjectSpy = jest.fn().mockImplementation(() => ({ promise: deleteObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ deleteObject: deleteObjectSpy })))
    })

    it('should call deleteObject with correct input', async () => {
      await sut.delete({ fileName })
      expect(deleteObjectSpy).toHaveBeenCalledWith({
        Bucket: bucketName,
        Key: fileName
      })
      expect(deleteObjectSpy).toHaveBeenCalledTimes(1)
      expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1)
    })
  })
})
