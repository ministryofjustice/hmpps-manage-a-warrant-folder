import { RequestHandler } from 'express'
import { PrisonApiAdjustment } from '../../../@types/prisonApi/prisonClientTypes'
import PrisonerService from '../../../services/prisonerService'
import WarrantFolderService from '../../../services/warrantFolderService'

export default class RemandRoutes {
  constructor(
    private readonly prisonerService: PrisonerService,
    private readonly warrantFolderService: WarrantFolderService
  ) {}

  public remandDetails: RequestHandler = async (req, res): Promise<void> => {
    const { caseloads, token } = res.locals.user
    const { nomsId } = req.params

    const prisonerDetail = await this.prisonerService.getPrisonerDetail(nomsId, caseloads, token)

    const nomisRemand = await (
      await this.prisonerService.getBookingAndSentenceAdjustments(prisonerDetail.bookingId, token)
    ).sentenceAdjustments.filter(it => it.type === 'REMAND')

    const relevantRemand = await this.warrantFolderService.calculateRelevantRemand(nomsId, token)

    return res.render('pages/remand/results', {
      model: {
        prisonerDetail,
        relevantRemand,
        nomisRemand,
      },
    })
  }

  public submitRemand: RequestHandler = async (req, res): Promise<void> => {
    const { caseloads, token } = res.locals.user
    const { nomsId } = req.params

    const relevantRemand = await this.warrantFolderService.calculateRelevantRemand(nomsId, token)
    const adjustment: PrisonApiAdjustment = {
      from: relevantRemand[0].from,
      to: relevantRemand[0].to,
      type: 'REMAND',
      days: relevantRemand[0].days,
      sequence: relevantRemand[0].sentence,
    }

    const prisonerDetail = await this.prisonerService.getPrisonerDetail(nomsId, caseloads, token)

    await this.prisonerService.createAdjustment(prisonerDetail.bookingId, adjustment, token)

    return res.redirect(`/remand/${nomsId}`)
  }
}
