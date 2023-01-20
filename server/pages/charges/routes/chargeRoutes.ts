import { RequestHandler } from 'express'
import PrisonerService from '../../../services/prisonerService'
import WarrantFormDataService from '../../../services/warrantFormDataService'
import offences from '../data/offences'

export default class ChargeRoutes {
  constructor(
    private readonly prisonerService: PrisonerService,
    private readonly warrantFormDataService: WarrantFormDataService
  ) {}

  public chargeDetails: RequestHandler = async (req, res): Promise<void> => {
    const { caseloads, token } = res.locals.user
    const { nomsId } = req.params

    const prisonerDetail = await this.prisonerService.getPrisonerDetail(nomsId, caseloads, token)

    return res.render('pages/charges/form', {
      model: {
        prisonerDetail,
        offences,
      },
    })
  }

  public submitChargeDetails: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId } = req.params

    const data = this.warrantFormDataService.getData(req, nomsId)

    const offence = offences.find(off => off.code === req.body['offence-name'])

    data.charge = {
      offenceStatue: offence.statute,
      offenceCode: offence.code,
      offenceDate: `${req.body['offence-start-year']}-${req.body['offence-start-month']}-${req.body['offence-start-day']}`,
      offenceEndDate: `${req.body['offence-end-year']}-${req.body['offence-end-month']}-${req.body['offence-end-day']}`,
      guilty: req.body.outcome === 'Guilty',
    }

    this.warrantFormDataService.setData(req, nomsId, data)

    return res.redirect(`/sentences/${nomsId}`)
  }
}
