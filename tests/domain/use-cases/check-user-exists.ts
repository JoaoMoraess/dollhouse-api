// import { mock, MockProxy } from 'jest-mock-extended'

// interface LoadAmmoutOfUsersByField {
//   load: (field: string) => Promise<number>
// }

// export type CheckUserExists = (input: {email: string}) => Promise<boolean>
// type Setup = (userRepo: LoadAmmoutOfUsersByField) => CheckUserExists

// export const setCheckUserExists: Setup = (userRepo) => async ({ email }) => {
//   return false
// }

// describe('checkUserExists', () => {
//   let userRepo: MockProxy<LoadAmmoutOfUsersByField>
//   let sut: CheckUserExists

//   beforeAll(() => {
//     userRepo.load = mock()
//     userRepo.load.mockResolvedValue(0)
//   })
//   beforeEach(() => {
//     sut = setCheckUserExists(userRepo)
//   })
// })
