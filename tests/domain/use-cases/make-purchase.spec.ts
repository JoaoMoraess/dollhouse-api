import { mock, MockProxy } from 'jest-mock-extended'

interface ChargePurchase {
  charge: (input: any) => void
}

type MakePurchase = (input: any) => Promise<void>

type SetupMakePurchase = (chargePurchase: ChargePurchase) => MakePurchase

const setupMakePurchase: SetupMakePurchase = chargePurchase => async input => {
  await chargePurchase.charge(input)
}

describe('MakePurchase', () => {
  let sut: MakePurchase
  let chargePurchase: MockProxy<ChargePurchase>

  beforeAll(() => {
    chargePurchase = mock()
    chargePurchase.charge.mockImplementation(() => {})
  })
  beforeEach(() => {
    sut = setupMakePurchase(chargePurchase)
  })

  it('should call changePurchase with correct input', async () => {
    await sut({})

    expect(chargePurchase.charge).toHaveBeenCalledWith({})
    expect(chargePurchase.charge).toHaveBeenCalledTimes(1)
  })
})
