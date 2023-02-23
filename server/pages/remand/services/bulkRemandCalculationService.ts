import {
  PrisonApiCourtDateResult,
  PrisonApiPrisoner,
  PrisonApiSentenceAdjustments,
} from '../../../@types/prisonApi/prisonClientTypes'
import { Remand, RemandResult } from '../../../@types/warrantFolder/warrantFolderTypes'
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
        const prisonDetails = await this.prisonerService.getPrisonerDetailIncludingReleased(nomsId, caseloads, token)
        const bookingId = prisonDetails.bookingId
        const nomisAdjustments = await this.prisonerService.getBookingAndSentenceAdjustments(bookingId, token)
        const nomisRemand = nomisAdjustments.sentenceAdjustments.filter(it => it.type === 'REMAND')
        const nomisUnusedRemand = nomisAdjustments.sentenceAdjustments.filter(it => it.type === 'UNUSED_REMAND')
        const courtDates = await this.prisonerService.getCourtDateResults(nomsId, token)

        try {
          const calculatedRemand = await this.warrantFolderService.calculateRelevantRemand(nomsId, token)

          csvData.push(
            this.addRow(nomsId, bookingId, prisonDetails, nomisRemand, nomisUnusedRemand, courtDates, calculatedRemand)
          )
        } catch (ex) {
          csvData.push(
            this.addRow(
              nomsId,
              bookingId,
              prisonDetails,
              nomisRemand,
              nomisUnusedRemand,
              courtDates,
              null,
              ex,
              'Error calculating remand'
            )
          )
        }
      } catch (ex) {
        csvData.push(this.addRow(nomsId, null, null, null, null, null, null, ex, 'Error fetching data from prison-api'))
      }
    }
    return csvData
  }
  /* eslint-enable */

  private addRow(
    nomsId: string,
    bookingId: number,
    prisoner: PrisonApiPrisoner,
    nomisRemandSentenceAdjustment: PrisonApiSentenceAdjustments[],
    nomisUnusedRemandSentenceAdjustment: PrisonApiSentenceAdjustments[],
    courtDates: PrisonApiCourtDateResult[],
    calculatedRemand: RemandResult,
    ex?: unknown,
    errorText?: string
  ): BulkRemandCalculationRow {
    const nomisRemand = this.sentenceAdjustmentToRemand(nomisRemandSentenceAdjustment)
    const nomisUnusedRemand = this.sentenceAdjustmentToRemand(nomisUnusedRemandSentenceAdjustment)
    return {
      NOMS_ID: nomsId,
      ACTIVE_BOOKING_ID: bookingId,
      AGENCY_LOCATION_ID: prisoner?.agencyId,
      COURT_DATES_JSON: JSON.stringify(courtDates),
      CALCULATED_ALL_JSON: JSON.stringify(calculatedRemand),
      NOMIS_REMAND_DAYS: this.sumRemandDays(nomisRemand),
      NOMIS_UNUSED_REMAND_DAYS: this.sumRemandDays(nomisUnusedRemand),
      CALCULATED_REMAND_DAYS: this.sumRemandDays(calculatedRemand?.finalRemand),
      NOMIS_REMAND_JSON: JSON.stringify(nomisRemand),
      NOMIS_UNUSED_REMAND_JSON: JSON.stringify(nomisUnusedRemand),
      CALCULATED_REMAND_JSON: JSON.stringify(calculatedRemand?.finalRemand),
      IS_REMAND_SAME: this.isRemandSame(nomisRemand, calculatedRemand?.finalRemand) ? 'Y' : 'N',
      IS_DATES_SAME: this.isDatesSame(nomisRemand, calculatedRemand?.finalRemand) ? 'Y' : 'N',
      IS_DAYS_SAME: this.isDaysSame(nomisRemand, calculatedRemand?.finalRemand) ? 'Y' : 'N',
      ERROR_JSON: JSON.stringify(ex),
      ERROR_TEXT: errorText,
    }
  }

  private isRemandSame(nomisRemand: Remand[], calculatedRemand: Remand[]): boolean {
    return nomisRemand != null && calculatedRemand != null && sameMembers(nomisRemand, calculatedRemand)
  }

  private isDaysSame(nomisRemand: Remand[], calculatedRemand: Remand[]): boolean {
    return (
      nomisRemand != null &&
      calculatedRemand != null &&
      sameMembers(
        nomisRemand.map(it => {
          return { days: it.days }
        }),
        calculatedRemand.map(it => {
          return { days: it.days }
        })
      )
    )
  }

  private isDatesSame(nomisRemand: Remand[], calculatedRemand: Remand[]): boolean {
    return (
      nomisRemand != null &&
      calculatedRemand != null &&
      sameMembers(
        nomisRemand.map(it => {
          return { from: it.from, to: it.to }
        }),
        calculatedRemand.map(it => {
          return { from: it.from, to: it.to }
        })
      )
    )
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
