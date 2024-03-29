import { dataAccess } from '../data'
import BulkRemandCalculationService from '../pages/remand/services/bulkRemandCalculationService'
import AdjustmentsService from './adjustmentsService'
import PrisonerService from './prisonerService'
import UserService from './userService'
import WarrantFolderService from './warrantFolderService'
import WarrantFormDataService from './warrantFormDataService'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonerService = new PrisonerService(hmppsAuthClient)
  const warrantFormDataService = new WarrantFormDataService(prisonerService)
  const warrantFolderService = new WarrantFolderService()
  const bulkRemandCalculationService = new BulkRemandCalculationService(prisonerService, warrantFolderService)
  const adjustmentsService = new AdjustmentsService()
  return {
    userService,
    prisonerService,
    warrantFormDataService,
    warrantFolderService,
    bulkRemandCalculationService,
    adjustmentsService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
