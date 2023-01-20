import { dataAccess } from '../data'
import PrisonerService from './prisonerService'
import UserService from './userService'
import WarrantFormDataService from './warrantFormDataService'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonerService = new PrisonerService(hmppsAuthClient)
  const warrantFormDataService = new WarrantFormDataService(prisonerService)
  return {
    userService,
    prisonerService,
    warrantFormDataService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
