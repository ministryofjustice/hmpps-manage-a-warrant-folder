import { RequestHandler } from 'express'
import PrisonerService from '../../../services/prisonerService'

export default class RemandRoutes {
  constructor(private readonly prisonerService: PrisonerService) {}

  public remandDetails: RequestHandler = async (req, res): Promise<void> => {
    const { caseloads, token } = res.locals.user
    const { nomsId } = req.params

    const prisonerDetail = await this.prisonerService.getPrisonerDetail(nomsId, caseloads, token)

    return res.render('pages/remand/results', {
      model: {
        prisonerDetail,
      },
    })
  }
}
