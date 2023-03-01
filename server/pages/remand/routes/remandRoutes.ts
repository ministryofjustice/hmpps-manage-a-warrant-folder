import { RequestHandler } from 'express'
import { stringify } from 'csv-stringify'
import { PrisonApiAdjustment } from '../../../@types/prisonApi/prisonClientTypes'
import PrisonerService from '../../../services/prisonerService'
import WarrantFolderService from '../../../services/warrantFolderService'
import BulkRemandCalculationService from '../services/bulkRemandCalculationService'

export default class RemandRoutes {
  constructor(
    private readonly prisonerService: PrisonerService,
    private readonly warrantFolderService: WarrantFolderService,
    private readonly bulkRemandCalculationService: BulkRemandCalculationService
  ) {}

  public remandDetails: RequestHandler = async (req, res): Promise<void> => {
    const { caseloads, token } = res.locals.user
    const { nomsId } = req.params

    const prisonerDetail = await this.prisonerService.getPrisonerDetailIncludingReleased(nomsId, caseloads, token)

    const nomisRemand = (
      await this.prisonerService.getBookingAndSentenceAdjustments(prisonerDetail.bookingId, token)
    ).sentenceAdjustments
      .filter(it => it.type === 'REMAND')
      .map(it => {
        return { ...it, bookingId: prisonerDetail.bookingId }
      })

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

    const relevantRemand = (await this.warrantFolderService.calculateRelevantRemand(nomsId, token)).finalRemand
    const adjustment: PrisonApiAdjustment = {
      from: relevantRemand[0].from,
      to: relevantRemand[0].to,
      type: 'REMAND',
      days: relevantRemand[0].days,
      sequence: relevantRemand[0].sentence,
    }

    await this.prisonerService.createAdjustment(relevantRemand[0].bookingId, adjustment, token)

    return res.redirect(`/remand/${nomsId}`)
  }

  public bulkRemand: RequestHandler = async (req, res): Promise<void> => {
    return res.render('pages/remand/bulk')
  }

  public submitBulkRemand: RequestHandler = async (req, res) => {
    const { caseloads, token } = res.locals.user
    const { prisonerIds } = req.body
    const nomsIds = prisonerIds.split(/\r?\n/)
    if (nomsIds.length > 500) return res.redirect(`/remand/`)

    const results = await this.bulkRemandCalculationService.runCalculations(caseloads, token, nomsIds)
    const fileName = `download-remand-dates.csv`
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    return stringify(results, {
      header: true,
    }).pipe(res)
  }
}
