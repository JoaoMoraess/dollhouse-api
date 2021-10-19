import { DeliVeryCalculator } from '@/domain/contracts/gateways'
import { CorreiosApi } from '@/infra/gateways'

describe('CorreiosApi', () => {
  let sut: CorreiosApi
  let input: DeliVeryCalculator.Input

  beforeEach(() => {
    input = {
      cepWithoutIffen: '90030140',
      declaredValue: 100
    }
  })
  beforeEach(() => {
    sut = new CorreiosApi('91740001', 'pac', 'N', 'N')
  })

  it('should return the correct data on success', async () => {
    const result = await sut.calc(input)
    expect(result).toEqual(2258)
  })

  it('should return error if cep is invalid', async () => {
    const errorMessaage = `CalcPreco:
Não foi encontrada precificação. ERP-005: CEP inexistente (00000000) --> UF DESTINO(-1).`

    input = { ...input, cepWithoutIffen: '00000000' }
    const promise = sut.calc(input)
    await expect(promise).rejects.toThrow(new Error(errorMessaage))
  })
})
