type BulkRemandCalculationRow = {
  NOMS_ID: string
  ACTIVE_BOOKING_ID: number
  COURT_DATES_JSON: string
  NOMIS_REMAND_DAYS: number
  CALCULATED_REMAND_DAYS: number
  NOMIS_REMAND_JSON: string
  CALCULATED_REMAND_JSON: string
  IS_REMAND_SAME: 'Y' | 'N'

  ERROR_TEXT: string
  ERROR_JSON: string
}

export default BulkRemandCalculationRow
