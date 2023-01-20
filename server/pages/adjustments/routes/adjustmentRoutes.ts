import { RequestHandler } from 'express'
import { PrisonApiAdjustment } from '../../../@types/prisonApi/prisonClientTypes'
import PrisonerService from '../../../services/prisonerService'
import adjustmentTypes from '../data/adjustmentTypes'

export default class AdjustmentRoutes {
  constructor(private readonly prisonerService: PrisonerService) {}

  public adjustmentDetails: RequestHandler = async (req, res): Promise<void> => {
    const { caseloads, token } = res.locals.user
    const { nomsId } = req.params

    const prisonerDetail = await this.prisonerService.getPrisonerDetail(nomsId, caseloads, token)

    return res.render('pages/adjustments/form', {
      model: {
        prisonerDetail,
        adjustmentTypes,
      },
    })
  }

  public submitAdjustment: RequestHandler = async (req, res): Promise<void> => {
    const { caseloads, token } = res.locals.user
    const { nomsId } = req.params

    const adjustment: PrisonApiAdjustment = {
      from: `${req.body['adjustment-from-year']}-${req.body['adjustment-from-month']}-${req.body['adjustment-from-day']}`,
      to: `${req.body['adjustment-to-year']}-${req.body['adjustment-to-month']}-${req.body['adjustment-to-day']}`,
      type: req.body['adjustment-type'],
      days: Number(req.body['number-of-days']),
      sequence: req.body.sentence ? Number(req.body.sentence) : null,
    }

    const prisonerDetail = await this.prisonerService.getPrisonerDetail(nomsId, caseloads, token)

    await this.prisonerService.createAdjustment(prisonerDetail.bookingId, adjustment, token)

    return res.redirect(`/`)
  }
}
