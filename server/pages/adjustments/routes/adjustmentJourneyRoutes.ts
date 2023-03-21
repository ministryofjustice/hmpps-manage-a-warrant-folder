import { RequestHandler } from 'express'
import { AdjustmentDetails } from '../../../@types/adjustments/adjustmentsTypes'
import { PrisonApiAdjustment } from '../../../@types/prisonApi/prisonClientTypes'
import AdjustmentsService from '../../../services/adjustmentsService'
import PrisonerService from '../../../services/prisonerService'
import WarrantFolderService from '../../../services/warrantFolderService'
import AdjustmentsListViewModel, { Message } from '../data/adjustmentsListModel'
import adjustmentTypes from '../data/adjustmentTypes'

export default class AdjustmentJourneyRoutes {
  constructor(
    private readonly prisonerService: PrisonerService,
    private readonly warrantFolderService: WarrantFolderService,
    private readonly adjustmentsService: AdjustmentsService
  ) {}

  public entry: RequestHandler = async (req, res): Promise<void> => {
    const { prisonId } = req.query as Record<string, string>
    return res.redirect(`/adjustments/${prisonId}/start`)
  }

  public start: RequestHandler = async (req, res): Promise<void> => {
    const { caseloads, token } = res.locals.user
    const { nomsId } = req.params
    const prisonerDetail = await this.prisonerService.getPrisonerDetail(nomsId, caseloads, token)

    return res.render('pages/adjustments/start', {
      model: {
        prisonerDetail,
      },
    })
  }

  public list: RequestHandler = async (req, res): Promise<void> => {
    const { caseloads, token } = res.locals.user
    const { nomsId } = req.params
    const prisonerDetail = await this.prisonerService.getPrisonerDetail(nomsId, caseloads, token)
    const adjustments = await this.adjustmentsService.findByPersonAndSource(nomsId, 'DPS', token)
    const relevantRemand = await this.warrantFolderService.calculateRelevantRemand(nomsId, token)
    const message = req.flash('message')
    return res.render('pages/adjustments/list', {
      model: new AdjustmentsListViewModel(
        prisonerDetail,
        adjustments,
        relevantRemand.finalRemand,
        message[0] && (JSON.parse(message[0]) as Message)
      ),
    })
  }

  public remand: RequestHandler = async (req, res): Promise<void> => {
    const { caseloads, token } = res.locals.user
    const { nomsId } = req.params
    const prisonerDetail = await this.prisonerService.getPrisonerDetail(nomsId, caseloads, token)
    const relevantRemand = await this.warrantFolderService.calculateRelevantRemand(nomsId, token)
    return res.render('pages/adjustments/remand', {
      model: {
        prisonerDetail,
        relevantRemand,
      },
    })
  }

  public remandSubmit: RequestHandler = async (req, res): Promise<void> => {
    const { token } = res.locals.user
    const { nomsId } = req.params
    const relevantRemand = await this.warrantFolderService.calculateRelevantRemand(nomsId, token)

    const nomisAdjustments: PrisonApiAdjustment[] = relevantRemand.finalRemand.map(it => {
      return {
        from: it.from,
        to: it.to,
        type: 'REMAND',
        days: it.days,
        sequence: it.sentence,
      }
    })
    await Promise.all(
      nomisAdjustments.map(it =>
        this.prisonerService.createAdjustment(relevantRemand.finalRemand[0].bookingId, it, token)
      )
    )

    const adjustments: AdjustmentDetails[] = relevantRemand.finalRemand.map(it => {
      return {
        fromDate: it.from,
        toDate: it.to,
        adjustmentType: 'REMAND',
        days: it.days,
        sentenceSequence: it.sentence,
        bookingId: it.bookingId,
        person: nomsId,
      } as AdjustmentDetails
    })
    await Promise.all(adjustments.map(it => this.adjustmentsService.create(it, token)))

    req.flash(
      'message',
      JSON.stringify({
        type: adjustmentTypes.find(it => it.value === 'REMAND'),
        days: relevantRemand.finalRemand.map(it => it.days).reduce((sum, current) => sum + current, 0),
      } as Message)
    )
    return res.redirect(`/adjustments/${nomsId}/list`)
  }
}
