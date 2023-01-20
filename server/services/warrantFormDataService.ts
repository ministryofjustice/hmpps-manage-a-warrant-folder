import { Request } from 'express'
import WarrantFormData from '../model/WarrantFormData'
import PrisonerService from './prisonerService'

export default class WarrantFormDataService {
  constructor(private readonly prisonerService: PrisonerService) {}

  public setData(req: Request, nomsId: string, formData: WarrantFormData): void {
    if (!req.session.formData) {
      req.session.formData = {}
    }
    req.session.formData[nomsId] = formData
  }

  public resetData(req: Request, nomsId: string): void {
    if (!req.session.formData) {
      req.session.formData = {}
    }
    req.session.formData[nomsId] = undefined
  }

  public getData(req: Request, nomsId: string): WarrantFormData {
    if (req.session.formData && req.session.formData[nomsId]) {
      return req.session.formData[nomsId]
    }
    return {}
  }

  public async pushToNomis(req: Request, nomsId: string, userCaseLoads: string[], token: string): Promise<void> {
    const data = this.getData(req, nomsId)
    const prisoner = await this.prisonerService.getPrisonerDetail(nomsId, userCaseLoads, token)
    const { bookingId } = prisoner

    data.courtCase.caseType = 'A'
    const courtCaseId = await this.prisonerService.createCourtCase(bookingId, data.courtCase, token)

    data.charge.courtCaseId = courtCaseId

    const chargeId = await this.prisonerService.createCharge(bookingId, data.charge, token)

    data.sentence.courtCaseId = courtCaseId
    data.sentence.offenderChargeId = chargeId

    await this.prisonerService.createSentence(bookingId, data.sentence, token)
  }
}
