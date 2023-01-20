import { RequestHandler } from 'express'
import PrisonerService from '../../../services/prisonerService'
import WarrantFormDataService from '../../../services/warrantFormDataService'
import courts from '../data/courts'
import hearingTypes from '../data/hearingTypes'

export default class CourtRoutes {
  constructor(
    private readonly prisonerService: PrisonerService,
    private readonly warrantFormDataService: WarrantFormDataService
  ) {}

  public courtDetails: RequestHandler = async (req, res): Promise<void> => {
    const { caseloads, token } = res.locals.user
    const { nomsId } = req.params

    const prisonerDetail = await this.prisonerService.getPrisonerDetail(nomsId, caseloads, token)

    return res.render('pages/courts/form', {
      model: {
        prisonerDetail,
        hearingTypes,
        courts,
      },
    })
  }

  public submitCourtDetails: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId } = req.params

    const data = this.warrantFormDataService.getData(req, nomsId)

    data.courtCase = {
      agencyId: req.body['court-name'],
      beginDate: `${req.body['court-date-year']}-${req.body['court-date-month']}-${req.body['court-date-day']}`,
      caseInfoNumber: req.body['court-case-reference'],
      hearingType: req.body['hearing-type'],
    }

    this.warrantFormDataService.setData(req, nomsId, data)

    return res.redirect(`/charges/${nomsId}`)
  }
}
