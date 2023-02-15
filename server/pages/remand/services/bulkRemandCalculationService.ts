import {
  PrisonApiCourtDateResult,
  PrisonApiPrisoner,
  PrisonApiSentenceAdjustments,
} from '../../../@types/prisonApi/prisonClientTypes'
import { Remand } from '../../../@types/warrantFolder/warrantFolderTypes'
import PrisonerService from '../../../services/prisonerService'
import WarrantFolderService from '../../../services/warrantFolderService'
import { sameMembers } from '../../../utils/utils'
import BulkRemandCalculationRow from '../models/BulkRemandCalculationRow'

export default class BulkRemandCalculationService {
  constructor(
    private readonly prisonerService: PrisonerService,
    private readonly warrantFolderService: WarrantFolderService
  ) {}

  /* eslint-disable */
  public async runCalculations(
    caseloads: string[],
    token: string,
    nomsIds: string[]
  ): Promise<BulkRemandCalculationRow[]> {
    const csvData: BulkRemandCalculationRow[] = []

    for (const nomsId of nomsIds) {
      try {
        const prisonDetails = await this.prisonerService.getPrisonerDetail(nomsId, caseloads, token)
        const bookingId = prisonDetails.bookingId
        const nomisRemand = (
          await this.prisonerService.getBookingAndSentenceAdjustments(bookingId, token)
        ).sentenceAdjustments.filter(it => it.type === 'REMAND' && it.active)
        const courtDates = await this.prisonerService.getCourtDateResults(nomsId, token)

        try {
          const calculatedRemand = await this.warrantFolderService.calculateRelevantRemand(nomsId, token)

          csvData.push(this.addRow(nomsId, bookingId, prisonDetails, nomisRemand, courtDates, calculatedRemand))
        } catch (ex) {
          csvData.push(
            this.addRow(nomsId, bookingId, prisonDetails, nomisRemand, courtDates, null, ex, 'Error calculating remand')
          )
        }
      } catch (ex) {
        csvData.push(this.addRow(nomsId, null, null, null, null, null, ex, 'Error fetching data from prison-api'))
      }
    }
    return csvData
  }
  /* eslint-enable */

  private addRow(
    nomsId: string,
    bookingId: number,
    prisoner: PrisonApiPrisoner,
    nomisAdjustments: PrisonApiSentenceAdjustments[],
    courtDates: PrisonApiCourtDateResult[],
    calculatedRemand: Remand[],
    ex?: unknown,
    errorText?: string
  ): BulkRemandCalculationRow {
    const nomisRemand = this.sentenceAdjustmentToRemand(nomisAdjustments)
    return {
      NOMS_ID: nomsId,
      ACTIVE_BOOKING_ID: bookingId,
      COURT_DATES_JSON: JSON.stringify(courtDates),
      NOMIS_REMAND_DAYS: this.sumRemandDays(nomisRemand),
      CALCULATED_REMAND_DAYS: this.sumRemandDays(calculatedRemand),
      NOMIS_REMAND_JSON: JSON.stringify(nomisRemand),
      CALCULATED_REMAND_JSON: JSON.stringify(calculatedRemand),
      IS_REMAND_SAME: this.isRemandSame(nomisRemand, calculatedRemand) ? 'Y' : 'N',
      ERROR_JSON: JSON.stringify(ex),
      ERROR_TEXT: errorText,
    }
  }

  private isRemandSame(nomisRemand: Remand[], calculatedRemand: Remand[]): boolean {
    return nomisRemand != null && calculatedRemand != null && sameMembers(nomisRemand, calculatedRemand)
  }

  private sumRemandDays(remand: Remand[]): number {
    return remand ? remand.map(a => a.days).reduce((sum, current) => sum + current, 0) : 0
  }

  private sentenceAdjustmentToRemand(sentenceAdjustments: PrisonApiSentenceAdjustments[]): Remand[] {
    return sentenceAdjustments
      ? sentenceAdjustments.map(it => {
          return {
            days: it.numberOfDays,
            from: it.fromDate,
            to: it.toDate,
            sentence: it.sentenceSequence,
          }
        })
      : []
  }
}
